import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bookmark, BookmarkCheck, Clock, Calendar, Target, AlertTriangle, Package, Bell, Lock, ShoppingCart } from "lucide-react";
import { SetReminderDialog } from "./SetReminderDialog";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Protocol {
  id: string;
  peptide_name: string;
  category: string;
  recommended_dose: string;
  frequency: string;
  cycle_length: string;
  expected_results: string[];
  common_stacks: string[];
  warnings: string[];
  description: string;
  benefits: string[];
  purchase_url?: string;
}

interface ProtocolCardProps {
  protocol: Protocol;
  isSaved: boolean;
  onSaveToggle: () => void;
}

export function ProtocolCard({ protocol, isSaved, onSaveToggle }: ProtocolCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const { isPremium } = useSubscription();
  const navigate = useNavigate();

  const handlePremiumFeature = (action: string) => {
    if (!isPremium) {
      toast.error("Premium Feature", {
        description: `${action} is only available for premium users. Upgrade to access all features!`,
        action: {
          label: "Upgrade",
          onClick: () => navigate("/auth")
        }
      });
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (handlePremiumFeature("Saving protocols")) {
      onSaveToggle();
    }
  };

  const handleReminder = () => {
    if (handlePremiumFeature("Setting reminders")) {
      setShowDetails(false);
      setShowReminder(true);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Injury Recovery": "bg-green-500/10 text-green-700 dark:text-green-400",
      "Tissue Repair": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      "Growth Hormone": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      "Muscle Growth": "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      "Weight Loss": "bg-pink-500/10 text-pink-700 dark:text-pink-400",
      "Fat Loss": "bg-red-500/10 text-red-700 dark:text-red-400",
      "Longevity": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
      "Anti-Aging": "bg-violet-500/10 text-violet-700 dark:text-violet-400",
      "Cognitive Enhancement": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
      "Sexual Health": "bg-rose-500/10 text-rose-700 dark:text-rose-400",
      "Immune Support": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      "Tanning & Sexual Health": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    };
    return colors[category] || "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  };

  return (
    <>
      <Card className="hover-lift group cursor-pointer" onClick={() => setShowDetails(true)}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Badge className={getCategoryColor(protocol.category)} variant="secondary">
                {protocol.category}
              </Badge>
              <CardTitle className="text-2xl mt-2">{protocol.peptide_name}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="shrink-0"
            >
              {!isPremium ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
          <CardDescription className="line-clamp-2 mt-2">{protocol.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Dose</p>
                <p className="text-muted-foreground">{protocol.recommended_dose}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Frequency</p>
                <p className="text-muted-foreground">{protocol.frequency}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Cycle Length</p>
                <p className="text-muted-foreground">{protocol.cycle_length}</p>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            View Full Details
          </Button>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className={getCategoryColor(protocol.category)} variant="secondary">
                  {protocol.category}
                </Badge>
                <DialogTitle className="text-3xl mt-2">{protocol.peptide_name}</DialogTitle>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={!isPremium}
                >
                  {!isPremium ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : isSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={handleReminder}
                  disabled={!isPremium}
                >
                  {!isPremium && <Lock className="h-4 w-4 mr-2" />}
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminder
                </Button>
              </div>
            </div>
            <DialogDescription className="text-base mt-4">{protocol.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Dosing Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Recommended Dose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{protocol.recommended_dose}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Frequency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{protocol.frequency}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Cycle Length
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{protocol.cycle_length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Key Benefits</h3>
              <div className="grid gap-2">
                {protocol.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-sm">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Results */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Expected Results</h3>
              <div className="grid gap-2">
                {protocol.expected_results.map((result, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <p className="text-sm">{result}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Stacks */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Common Stacks
              </h3>
              <div className="grid gap-2">
                {protocol.common_stacks.map((stack, idx) => (
                  <Badge key={idx} variant="outline" className="justify-start text-left">
                    {stack}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Warnings */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Important Warnings
              </h3>
              <div className="grid gap-2">
                {protocol.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    <p className="text-sm text-destructive">{warning}</p>
                  </div>
                ))}
              </div>
            </div>

            {protocol.purchase_url && (
              <div className="border-t pt-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => window.open(protocol.purchase_url, '_blank')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {protocol.purchase_url.includes('nexaph.com') ? 'Buy from Nexaph' : 
                   protocol.purchase_url.includes('corepeptides.com') ? 'Buy from Core Peptides' : 
                   'Purchase'}
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground border-t pt-4">
              This information is for educational purposes only. Always consult with a qualified healthcare professional before starting any peptide protocol.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <SetReminderDialog
        open={showReminder}
        onOpenChange={setShowReminder}
        protocolId={protocol.id}
        protocolName={protocol.peptide_name}
        frequency={protocol.frequency}
      />
    </>
  );
}
