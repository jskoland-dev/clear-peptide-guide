import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Calculator as CalcIcon, Beaker, Layers, Lock } from "lucide-react";
import { toast } from "sonner";
import { StackCalculator } from "@/components/calculator/StackCalculator";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeDialog } from "@/components/progress/UpgradeDialog";
import { SyringeVisual } from "@/components/calculator/SyringeVisual";

const Calculator = () => {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState("single");
  const [peptideMg, setPeptideMg] = useState("");
  const [bacWater, setBacWater] = useState("");
  const [desiredDose, setDesiredDose] = useState("");
  const [doseUnit, setDoseUnit] = useState("mg");
  const [result, setResult] = useState<{ volume: number; concentration: number } | null>(null);

  const handleTabChange = (value: string) => {
    if (value === "stack" && !isPremium) {
      setShowUpgradeDialog(true);
      return;
    }
    setCurrentTab(value);
  };

  const calculateDose = () => {
    const peptide = parseFloat(peptideMg);
    const water = parseFloat(bacWater);
    const dose = parseFloat(desiredDose);

    if (!peptide || !water || !dose) {
      toast.error("Please fill in all fields");
      return;
    }

    const concentration = peptide / water; // mg per mL
    
    // Convert dose to mg if needed, or calculate from ml
    let doseInMg = dose;
    let volumeNeeded = 0;
    
    if (doseUnit === "mcg") {
      doseInMg = dose / 1000;
      volumeNeeded = doseInMg / concentration;
    } else if (doseUnit === "units") {
      // Assuming 1 unit = 0.01mg for general peptides (can vary)
      doseInMg = dose * 0.01;
      volumeNeeded = doseInMg / concentration;
    } else if (doseUnit === "ml") {
      // User specified volume directly in ml
      volumeNeeded = dose;
      doseInMg = volumeNeeded * concentration;
    } else {
      // mg
      volumeNeeded = doseInMg / concentration;
    }
    
    const volumeInUnits = volumeNeeded * 100; // units (0.01mL = 1 unit on insulin syringe)

    setResult({
      volume: volumeInUnits,
      concentration: concentration,
    });

    toast.success("Calculation complete!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
            <CalcIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Peptide Dose Calculator</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Calculate doses for single peptides or complete stacks
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Beaker className="w-4 h-4" />
              Single Peptide
            </TabsTrigger>
            <TabsTrigger 
              value="stack" 
              className="flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Stack Calculator
              {!isPremium && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="p-8 space-y-6">
            <div>
              <Label htmlFor="peptide" className="text-base font-semibold mb-2 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-primary" />
                Peptide Amount (mg)
              </Label>
              <Input
                id="peptide"
                type="number"
                placeholder="e.g., 5"
                value={peptideMg}
                onChange={(e) => setPeptideMg(e.target.value)}
                className="text-lg h-12"
              />
              <p className="text-sm text-muted-foreground mt-2">
                <Info className="w-3 h-3 inline mr-1" />
                This is the total amount in your vial (usually 2mg, 5mg, or 10mg)
              </p>
            </div>

            <div>
              <Label htmlFor="water" className="text-base font-semibold mb-2">
                BAC Water Amount (mL)
              </Label>
              <Input
                id="water"
                type="number"
                placeholder="e.g., 2"
                value={bacWater}
                onChange={(e) => setBacWater(e.target.value)}
                className="text-lg h-12"
              />
              <p className="text-sm text-muted-foreground mt-2">
                <Info className="w-3 h-3 inline mr-1" />
                How much bacteriostatic water you'll add (typically 1-3 mL)
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="dose" className="text-base font-semibold mb-2">
                Desired Dose
              </Label>
              <div className="flex gap-3">
                <Input
                  id="dose"
                  type="number"
                  placeholder="e.g., 250"
                  value={desiredDose}
                  onChange={(e) => setDesiredDose(e.target.value)}
                  className="text-lg h-12 flex-1"
                />
                <Select value={doseUnit} onValueChange={setDoseUnit}>
                  <SelectTrigger className="w-32 h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="mcg">mcg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="units">units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                <Info className="w-3 h-3 inline mr-1" />
                Your target dose per injection
              </p>
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              onClick={calculateDose}
              className="w-full"
            >
              <CalcIcon className="w-5 h-5" />
              Calculate Dose
            </Button>
          </Card>

          {/* Results & Info */}
          <div className="space-y-6">
            {result && (
              <>
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <CalcIcon className="w-4 h-4 text-white" />
                    </div>
                    Your Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-card p-4 rounded-lg border border-primary/10">
                      <p className="text-sm text-muted-foreground mb-1">Inject Volume</p>
                      <p className="text-3xl font-bold text-primary">
                        {result.volume.toFixed(1)} units
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        on an insulin syringe (100 unit = 1mL)
                      </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg border border-secondary/10">
                      <p className="text-sm text-muted-foreground mb-1">Concentration</p>
                      <p className="text-2xl font-bold text-secondary">
                        {result.concentration.toFixed(2)} mg/mL
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or {(result.concentration * 1000).toFixed(0)} mcg/mL
                      </p>
                    </div>
                  </div>
                </Card>

                <SyringeVisual units={result.volume} />
              </>
            )}

            <Card className="p-6 bg-accent/5 border-accent/20">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Understanding Units
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">mg (milligrams)</p>
                  <p>Standard weight measurement. 1mg = 1,000 mcg</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">mcg (micrograms)</p>
                  <p>Smaller unit. 1,000 mcg = 1 mg</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">ml (milliliters)</p>
                  <p>Volume measurement. 1 mL = 100 units on insulin syringe</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">units (syringe marks)</p>
                  <p>Volume markers on insulin syringes. 100 units = 1 mL</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Need More Help?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about BAC water ratios, reconstitution, and peptide storage best practices.
              </p>
              <Button 
                variant="feature" 
                onClick={() => navigate("/learn")}
                className="w-full"
              >
                Visit Learning Center
              </Button>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="stack">
            <StackCalculator />
          </TabsContent>
        </Tabs>
      </div>
      
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
      />
    </div>
  );
};

export default Calculator;
