import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

const GOAL_OPTIONS = [
  { value: "fat_loss", label: "Fat Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "recovery", label: "Recovery" },
  { value: "anti_aging", label: "Anti-Aging" },
  { value: "cognitive", label: "Cognitive Enhancement" },
  { value: "sleep", label: "Sleep Improvement" },
  { value: "skin_health", label: "Skin Health" },
  { value: "injury_healing", label: "Injury Healing" },
  { value: "general_wellness", label: "General Wellness" },
];

interface SubmitProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SubmitProtocolDialog({ open, onOpenChange, onSuccess }: SubmitProtocolDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [peptides, setPeptides] = useState<Array<{ name: string; dose: string }>>([{ name: "", dose: "" }]);
  const [schedule, setSchedule] = useState("");
  const [duration, setDuration] = useState("");
  const [results, setResults] = useState("");
  const [sideEffects, setSideEffects] = useState("");
  const [notes, setNotes] = useState("");

  const addPeptide = () => {
    setPeptides([...peptides, { name: "", dose: "" }]);
  };

  const removePeptide = (index: number) => {
    setPeptides(peptides.filter((_, i) => i !== index));
  };

  const updatePeptide = (index: number, field: "name" | "dose", value: string) => {
    const updated = [...peptides];
    updated[index][field] = value;
    setPeptides(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!title || !goal || !schedule || !duration || !results) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const validPeptides = peptides.filter((p) => p.name && p.dose);
    if (validPeptides.length === 0) {
      toast({
        title: "No peptides",
        description: "Please add at least one peptide with dosage.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const dosagesObj: Record<string, string> = {};
    validPeptides.forEach((p) => {
      dosagesObj[p.name] = p.dose;
    });

    const { error } = await supabase.from("community_protocols").insert({
      title,
      goal: goal as any,
      peptides_used: validPeptides.map((p) => p.name),
      dosages: dosagesObj,
      schedule,
      duration,
      results,
      side_effects: sideEffects || null,
      notes: notes || null,
      user_id: user.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit protocol. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your protocol has been shared with the community.",
      });
      onSuccess();
      onOpenChange(false);
      // Reset form
      setTitle("");
      setGoal("");
      setPeptides([{ name: "", dose: "" }]);
      setSchedule("");
      setDuration("");
      setResults("");
      setSideEffects("");
      setNotes("");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Protocol</DialogTitle>
          <DialogDescription>
            Help others by sharing your peptide experience. All submissions are anonymous to the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Protocol Title *</Label>
            <Input
              id="title"
              placeholder="e.g., My 12-Week Fat Loss Stack"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Primary Goal *</Label>
            <Select value={goal} onValueChange={setGoal} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                {GOAL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Peptides Used *</Label>
            {peptides.map((peptide, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Peptide name"
                  value={peptide.name}
                  onChange={(e) => updatePeptide(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Dosage (e.g., 250mcg/day)"
                  value={peptide.dose}
                  onChange={(e) => updatePeptide(index, "dose", e.target.value)}
                  className="flex-1"
                />
                {peptides.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePeptide(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addPeptide}>
              <Plus className="h-4 w-4 mr-2" />
              Add Peptide
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule *</Label>
              <Input
                id="schedule"
                placeholder="e.g., Once daily, morning"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                placeholder="e.g., 12 weeks"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Results *</Label>
            <Textarea
              id="results"
              placeholder="Describe your results, progress, and outcomes..."
              value={results}
              onChange={(e) => setResults(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="side-effects">Side Effects (Optional)</Label>
            <Textarea
              id="side-effects"
              placeholder="Any side effects experienced..."
              value={sideEffects}
              onChange={(e) => setSideEffects(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any other important information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Share Protocol"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
