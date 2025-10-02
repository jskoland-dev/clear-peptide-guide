import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const FLAG_REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "misinformation", label: "Dangerous misinformation" },
  { value: "harassment", label: "Harassment or abuse" },
  { value: "other", label: "Other" },
];

interface FlagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocolId?: string;
  commentId?: string;
  type: "protocol" | "comment";
}

export function FlagDialog({ open, onOpenChange, protocolId, commentId, type }: FlagDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    if (!reason) {
      toast({ title: "Please select a reason", variant: "destructive" });
      return;
    }

    setLoading(true);

    const flagReason = `${reason}: ${details || "No additional details"}`;

    if (type === "protocol" && protocolId) {
      const { error } = await supabase
        .from("community_protocols")
        .update({ is_flagged: true, flag_reason: flagReason })
        .eq("id", protocolId);

      if (error) {
        toast({ title: "Error", description: "Failed to report. Please try again.", variant: "destructive" });
      } else {
        toast({ title: "Reported", description: "Thank you for helping keep our community safe." });
        onOpenChange(false);
      }
    } else if (type === "comment" && commentId) {
      const { error } = await supabase
        .from("protocol_comments")
        .update({ is_flagged: true, flag_reason: flagReason })
        .eq("id", commentId);

      if (error) {
        toast({ title: "Error", description: "Failed to report. Please try again.", variant: "destructive" });
      } else {
        toast({ title: "Reported", description: "Thank you for helping keep our community safe." });
        onOpenChange(false);
      }
    }

    setLoading(false);
    setReason("");
    setDetails("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report {type === "protocol" ? "Protocol" : "Comment"}</DialogTitle>
          <DialogDescription>
            Help us maintain a safe and helpful community by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Reason for reporting:</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {FLAG_REASONS.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="font-normal cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide more context about why you're reporting this..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !reason}>
              {loading ? "Reporting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
