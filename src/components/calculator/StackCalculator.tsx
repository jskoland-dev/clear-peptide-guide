import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, AlertTriangle, Save, Info, Calculator as CalcIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PeptideInStack {
  id: string;
  name: string;
  peptideMg: string;
  bacWater: string;
  desiredDose: string;
  doseUnit: string;
  frequency: string;
  timing: string;
  result?: {
    volume: number;
    concentration: number;
  };
}

interface StackTemplate {
  id: string;
  name: string;
  peptides: PeptideInStack[];
  created_at?: string;
  updated_at?: string;
}

// Peptides that shouldn't be mixed in the same syringe
const INCOMPATIBLE_PAIRS = [
  ["BPC-157", "TB-500"],
  ["Ipamorelin", "CJC-1295"],
];

const TIMING_OPTIONS = [
  { value: "morning", label: "Morning (AM)" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening (PM)" },
  { value: "before-bed", label: "Before Bed" },
  { value: "pre-workout", label: "Pre-Workout" },
  { value: "post-workout", label: "Post-Workout" },
];

export const StackCalculator = () => {
  const { user } = useAuth();
  const [peptides, setPeptides] = useState<PeptideInStack[]>([]);
  const [stackName, setStackName] = useState("");
  const [savedTemplates, setSavedTemplates] = useState<StackTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const addPeptide = () => {
    const newPeptide: PeptideInStack = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      peptideMg: "",
      bacWater: "",
      desiredDose: "",
      doseUnit: "mcg",
      frequency: "daily",
      timing: "morning",
    };
    setPeptides([...peptides, newPeptide]);
  };

  const removePeptide = (id: string) => {
    setPeptides(peptides.filter(p => p.id !== id));
  };

  const updatePeptide = (id: string, field: keyof PeptideInStack, value: string) => {
    setPeptides(peptides.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculatePeptide = (peptide: PeptideInStack) => {
    const peptideMgVal = parseFloat(peptide.peptideMg);
    const water = parseFloat(peptide.bacWater);
    const dose = parseFloat(peptide.desiredDose);

    if (!peptideMgVal || !water || !dose) {
      return null;
    }

    let doseInMg = dose;
    if (peptide.doseUnit === "mcg") {
      doseInMg = dose / 1000;
    } else if (peptide.doseUnit === "units") {
      doseInMg = dose * 0.01;
    }

    const concentration = peptideMgVal / water;
    const volumeNeeded = doseInMg / concentration;
    const volumeInUnits = volumeNeeded * 100;

    return {
      volume: volumeInUnits,
      concentration: concentration,
    };
  };

  const calculateAll = () => {
    if (peptides.length === 0) {
      toast.error("Please add at least one peptide to your stack");
      return;
    }

    let hasErrors = false;
    const updatedPeptides = peptides.map(p => {
      if (!p.name || !p.peptideMg || !p.bacWater || !p.desiredDose) {
        hasErrors = true;
        return p;
      }
      const result = calculatePeptide(p);
      return result ? { ...p, result } : p;
    });

    if (hasErrors) {
      toast.error("Please fill in all fields for each peptide");
      return;
    }

    setPeptides(updatedPeptides);
    toast.success("Stack calculated successfully!");
  };

  const checkMixingWarnings = () => {
    const warnings: string[] = [];
    const peptidesByTiming: { [key: string]: string[] } = {};

    // Group peptides by timing
    peptides.forEach(p => {
      if (!peptidesByTiming[p.timing]) {
        peptidesByTiming[p.timing] = [];
      }
      peptidesByTiming[p.timing].push(p.name);
    });

    // Check for incompatible pairs in same timing
    Object.entries(peptidesByTiming).forEach(([timing, names]) => {
      INCOMPATIBLE_PAIRS.forEach(([p1, p2]) => {
        if (names.includes(p1) && names.includes(p2)) {
          warnings.push(`${p1} and ${p2} scheduled at ${timing} - should not be mixed in same syringe`);
        }
      });
    });

    return warnings;
  };

  const saveTemplate = async () => {
    if (!user) {
      toast.error("Please sign in to save templates");
      return;
    }

    if (!stackName.trim()) {
      toast.error("Please enter a name for your stack");
      return;
    }

    if (peptides.length === 0) {
      toast.error("Please add peptides to your stack");
      return;
    }

    try {
      const { error } = await supabase
        .from("peptide_stack_templates")
        .insert([{
          name: stackName,
          peptides: peptides as any,
          user_id: user.id,
        }]);

      if (error) throw error;

      toast.success("Stack template saved!");
      setStackName("");
      loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  const loadTemplates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("peptide_stack_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Cast the peptides JSON to our type
      const templates = (data || []).map(item => ({
        ...item,
        peptides: item.peptides as any as PeptideInStack[]
      }));

      setSavedTemplates(templates);
      setShowTemplates(true);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load templates");
    }
  };

  const loadTemplate = (template: StackTemplate) => {
    setPeptides(template.peptides);
    setStackName(template.name);
    setShowTemplates(false);
    toast.success(`Loaded template: ${template.name}`);
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("peptide_stack_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Template deleted");
      loadTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const warnings = checkMixingWarnings();

  return (
    <div className="space-y-6">
      {/* Stack Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Your Peptide Stack</h3>
          <div className="flex gap-2">
            {user && (
              <Button variant="outline" onClick={loadTemplates}>
                Load Template
              </Button>
            )}
            <Button onClick={addPeptide}>
              <Plus className="w-4 h-4 mr-2" />
              Add Peptide
            </Button>
          </div>
        </div>

        {peptides.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No peptides in your stack yet.</p>
            <p className="text-sm mt-2">Click "Add Peptide" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {peptides.map((peptide, index) => (
              <Card key={peptide.id} className="p-6 bg-accent/5">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-lg">Peptide #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePeptide(peptide.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Peptide Name</Label>
                    <Input
                      placeholder="e.g., BPC-157"
                      value={peptide.name}
                      onChange={(e) => updatePeptide(peptide.id, "name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Amount (mg)</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={peptide.peptideMg}
                      onChange={(e) => updatePeptide(peptide.id, "peptideMg", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>BAC Water (mL)</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={peptide.bacWater}
                      onChange={(e) => updatePeptide(peptide.id, "bacWater", e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Desired Dose</Label>
                      <Input
                        type="number"
                        placeholder="250"
                        value={peptide.desiredDose}
                        onChange={(e) => updatePeptide(peptide.id, "desiredDose", e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <Label>Unit</Label>
                      <Select 
                        value={peptide.doseUnit} 
                        onValueChange={(value) => updatePeptide(peptide.id, "doseUnit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mg">mg</SelectItem>
                          <SelectItem value="mcg">mcg</SelectItem>
                          <SelectItem value="units">units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Frequency</Label>
                    <Select 
                      value={peptide.frequency} 
                      onValueChange={(value) => updatePeptide(peptide.id, "frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="twice-daily">Twice Daily</SelectItem>
                        <SelectItem value="eod">Every Other Day</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Timing</Label>
                    <Select 
                      value={peptide.timing} 
                      onValueChange={(value) => updatePeptide(peptide.id, "timing", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMING_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {peptide.result && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Inject Volume</p>
                        <p className="text-xl font-bold text-primary">
                          {peptide.result.volume.toFixed(1)} units
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Concentration</p>
                        <p className="text-lg font-semibold text-secondary">
                          {peptide.result.concentration.toFixed(2)} mg/mL
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {peptides.length > 0 && (
          <Button 
            variant="hero" 
            size="lg" 
            onClick={calculateAll}
            className="w-full mt-6"
          >
            <CalcIcon className="w-5 h-5 mr-2" />
            Calculate All Doses
          </Button>
        )}
      </Card>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Mixing Warnings:</div>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, idx) => (
                <li key={idx} className="text-sm">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Combined Schedule */}
      {peptides.some(p => p.result) && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Combined Injection Schedule
          </h3>
          
          <div className="space-y-3">
            {TIMING_OPTIONS.map(timing => {
              const peptidesAtTime = peptides.filter(p => p.timing === timing.value && p.result);
              if (peptidesAtTime.length === 0) return null;

              return (
                <div key={timing.value} className="p-4 bg-accent/5 rounded-lg border">
                  <h4 className="font-semibold mb-2">{timing.label}</h4>
                  <ul className="space-y-2">
                    {peptidesAtTime.map(p => (
                      <li key={p.id} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground">
                          {p.result!.volume.toFixed(1)} units • {p.frequency}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Save Template */}
      {user && peptides.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Save as Template</h3>
          <div className="flex gap-3">
            <Input
              placeholder="Stack name (e.g., My Recovery Stack)"
              value={stackName}
              onChange={(e) => setStackName(e.target.value)}
            />
            <Button onClick={saveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </Card>
      )}

      {/* Templates List */}
      {showTemplates && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Saved Templates</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
              Close
            </Button>
          </div>
          
          {savedTemplates.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No saved templates yet</p>
          ) : (
            <div className="space-y-2">
              {savedTemplates.map(template => (
                <div key={template.id} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border">
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {template.peptides.length} peptide{template.peptides.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => loadTemplate(template)}>
                      Load
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
