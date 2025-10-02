import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, TrendingUp, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Unlock Progress Tracking
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Track your transformation with before/after photos and measurements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 p-2 rounded-lg bg-primary/10">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Photo Timeline</div>
              <div className="text-sm text-muted-foreground">
                Upload before/after photos with timestamps and notes
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Track Measurements</div>
              <div className="text-sm text-muted-foreground">
                Log weight, body measurements, and how you feel
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Side-by-Side Comparison</div>
              <div className="text-sm text-muted-foreground">
                Compare any two photos to see your progress over time
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold">
                $9<span className="text-lg text-muted-foreground font-normal">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Includes AI Assistant, Progress Tracking, Dose Tracking & More
              </p>
            </div>

            <div className="space-y-2">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/");
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
