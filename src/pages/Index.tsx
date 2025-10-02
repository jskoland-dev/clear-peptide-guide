import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Calculator, BookOpen, Beaker, Droplet, Target, GraduationCap, Check, X, LogIn, Bot, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header with Sign In */}
      <header className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {user ? 'Dashboard' : 'Sign In'}
          </Button>
        </div>
      </header>

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
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/protocols')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Protocols
              </Button>
            </div>
          </div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Free vs Premium Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free, upgrade when you need advanced features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground">/month</span></p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Peptide dose calculator</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Educational resources & guides</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Browse protocol library (view only)</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground italic">All premium features locked:</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">AI Dosing Assistant</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Dose tracking & history</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Vial inventory management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Save protocols & set reminders</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Analytics & insights</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  Get Started Free
                </Button>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-4xl font-bold">$9<span className="text-lg text-muted-foreground">/month</span></p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-semibold">Everything in Free, plus:</span>
                  </div>
                  
                  {/* AI Assistant Feature - Highlighted */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="shrink-0 p-1.5 rounded-lg bg-primary/20">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">AI Dosing Assistant</span>
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Get personalized peptide protocol recommendations from our AI expert. Ask about dosing, stacking, timing, and safety - 100 messages per month included.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Complete dose tracking dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Full injection history & analytics</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Vial inventory & expiration tracking</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Save unlimited protocols</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium">Set custom reminders</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Priority support</span>
                  </div>
                </div>

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  Upgrade to Premium
                </Button>
              </div>
            </Card>
          </div>
        </div>
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
