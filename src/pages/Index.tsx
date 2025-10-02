import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator, BookOpen, Beaker, Droplet, Target, GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <Beaker className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">The Most Intuitive Peptide Calculator</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Calculate Peptide Doses</span>
              <br />
              <span className="text-foreground">With Confidence</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The only peptide calculator designed for beginners. We explain everything step-by-step, from mg to mcg conversions, BAC water ratios, and proper dosing - so you never have to guess.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/calculator')}
                className="group"
              >
                <Calculator className="w-5 h-5" />
                Start Calculating
              </Button>
              <Button 
                variant="feature" 
                size="xl"
                onClick={() => navigate('/learn')}
              >
                <GraduationCap className="w-5 h-5" />
                Learn the Basics
              </Button>
            </div>
          </div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Calculator?
            </h2>
            <p className="text-muted-foreground text-lg">
              Built specifically for peptide therapy beginners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 card-hover border-primary/10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Educational First</h3>
              <p className="text-muted-foreground leading-relaxed">
                We don't just give you numbers - we teach you what they mean. Understand mg, mcg, units, and IU conversions with clear explanations.
              </p>
            </Card>

            <Card className="p-8 card-hover border-secondary/10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-6 shadow-lg">
                <Droplet className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">BAC Water Guide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get precise bacteriostatic water recommendations for any peptide. No more confusion about reconstitution ratios or volumes.
              </p>
            </Card>

            <Card className="p-8 card-hover border-accent/10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Precision Dosing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Calculate exact doses with confidence. Our smart calculator accounts for concentration, injection volume, and unit conversions automatically.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Master Peptide Dosing?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our calculator for accurate, easy-to-understand peptide calculations.
            </p>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate('/calculator')}
            >
              <Calculator className="w-5 h-5" />
              Get Started Free
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground text-sm">
          <p>© 2025 Peptide Calculator. For educational purposes only. Consult healthcare professionals for medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
