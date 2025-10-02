import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Beaker, Droplet, Scale, Syringe, FlaskConical, BookOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Learn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Peptide Basics Guide</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about peptides, reconstitution, and proper dosing
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 text-center card-hover border-primary/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">What Are Peptides?</h3>
            <p className="text-sm text-muted-foreground">Short chains of amino acids used for various therapeutic purposes</p>
          </Card>

          <Card className="p-6 text-center card-hover border-secondary/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Measurement Units</h3>
            <p className="text-sm text-muted-foreground">Understanding mg, mcg, IU, and injection units</p>
          </Card>

          <Card className="p-6 text-center card-hover border-accent/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">BAC Water</h3>
            <p className="text-sm text-muted-foreground">How to properly reconstitute your peptides</p>
          </Card>
        </div>

        {/* Detailed Information Sections */}
        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Beaker className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Understanding Peptides</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Peptides are short chains of amino acids that act as signaling molecules in the body. They're used for various therapeutic purposes including muscle growth, fat loss, recovery, and anti-aging. Peptides typically come in lyophilized (freeze-dried) powder form and must be reconstituted with bacteriostatic water before use.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Measurement Units Explained</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Understanding the different units is crucial for safe and effective peptide use:
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pl-14">
              <div className="border-l-4 border-primary/50 pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">Milligrams (mg)</h3>
                <p className="text-muted-foreground text-sm">
                  The standard unit of weight for peptides. Most vials contain 2mg, 5mg, or 10mg of peptide powder. This is what you'll see labeled on your vial.
                </p>
              </div>

              <div className="border-l-4 border-secondary/50 pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">Micrograms (mcg)</h3>
                <p className="text-muted-foreground text-sm">
                  A smaller unit where 1,000 mcg = 1 mg. Many peptide doses are measured in mcg (e.g., 250 mcg). To convert: mg × 1,000 = mcg. Example: 0.25 mg = 250 mcg.
                </p>
              </div>

              <div className="border-l-4 border-accent/50 pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">Units (on syringe)</h3>
                <p className="text-muted-foreground text-sm">
                  The tick marks on insulin syringes. A 1mL syringe has 100 units (100 unit = 1 mL). Each unit represents 0.01 mL of liquid. This is what you'll use to measure your injection volume.
                </p>
              </div>

              <div className="border-l-4 border-primary/30 pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">International Units (IU)</h3>
                <p className="text-muted-foreground text-sm">
                  Used for some peptides like HGH and HCG. The conversion varies by peptide - always check your specific peptide's documentation. Not the same as syringe units!
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Droplet className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Bacteriostatic Water (BAC Water)</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  BAC water is sterile water with 0.9% benzyl alcohol that prevents bacterial growth. It's essential for reconstituting peptides and allows the solution to remain stable for weeks when refrigerated.
                </p>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 space-y-4 ml-14">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-accent" />
                  Common Reconstitution Ratios
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="font-medium text-foreground">1 mL</span> - Creates higher concentration, smaller injection volume</li>
                  <li>• <span className="font-medium text-foreground">2 mL</span> - Most common, balanced concentration</li>
                  <li>• <span className="font-medium text-foreground">3 mL</span> - Lower concentration, easier to measure small doses</li>
                </ul>
              </div>

              <div className="bg-card p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Pro Tip:</strong> More water = easier to measure, but larger injection volume. Less water = smaller injection volume, but harder to measure precisely. For beginners, 2 mL is ideal.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Syringe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Reconstitution Steps</h2>
              </div>
            </div>

            <ol className="space-y-4 ml-14">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium mb-1">Prepare Materials</p>
                  <p className="text-sm text-muted-foreground">Gather your peptide vial, BAC water, alcohol swabs, and syringe</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-medium mb-1">Draw BAC Water</p>
                  <p className="text-sm text-muted-foreground">Use a sterile syringe to draw your desired amount (typically 2 mL)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-medium mb-1">Add Water Slowly</p>
                  <p className="text-sm text-muted-foreground">Inject water down the side of the vial, not directly onto the powder. Go slowly to avoid foaming</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-medium mb-1">Gently Swirl</p>
                  <p className="text-sm text-muted-foreground">Swirl gently (don't shake!) until powder is fully dissolved. This may take 1-2 minutes</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">5</span>
                <div>
                  <p className="font-medium mb-1">Store Properly</p>
                  <p className="text-sm text-muted-foreground">Refrigerate immediately (2-8°C / 36-46°F). Label with date of reconstitution</p>
                </div>
              </li>
            </ol>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold">
                  How long does reconstituted peptide last?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Most peptides last 2-4 weeks when stored properly in the refrigerator with BAC water. Some peptides (like GLP-1 variants) can last longer. Always check your specific peptide's stability data and look for cloudiness or discoloration before use.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold">
                  Can I use regular sterile water instead of BAC water?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Regular sterile water can be used but must be used within 24-48 hours as it lacks the preservative that prevents bacterial growth. BAC water is strongly recommended for multi-dose vials as it remains stable for weeks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-semibold">
                  What size syringe should I use?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  For most peptide injections, use insulin syringes (0.3 mL, 0.5 mL, or 1 mL). The 0.5 mL (50 unit) syringe with a 29-31 gauge needle is ideal for subcutaneous injections. Smaller syringes allow more precise measurement of small doses.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold">
                  Where should I inject peptides?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Most peptides are injected subcutaneously (under the skin). Common sites include the abdomen (2 inches from navel), thighs, or back of the upper arm. Rotate injection sites to prevent irritation and lipohypertrophy.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-semibold">
                  Do I need to reconstitute peptides immediately?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No. Lyophilized (powder) peptides are very stable and can be stored in the freezer or refrigerator for months or even years before reconstitution. Only reconstitute what you'll use within a few weeks. Keep unopened vials frozen for maximum shelf life.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Calculate Your Dose?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Now that you understand the basics, use our calculator to determine your exact injection volume.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate("/calculator")}
            >
              Go to Calculator
            </Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-16">
        <div className="container mx-auto max-w-4xl text-center text-muted-foreground text-sm">
          <p>© 2025 Peptide Calculator. For educational purposes only. Consult healthcare professionals for medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Learn;
