import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

interface SetReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocolId: string;
  protocolName: string;
  frequency: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SetReminderDialog({ open, onOpenChange, protocolId, protocolName, frequency }: SetReminderDialogProps) {
  const [reminderTime, setReminderTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one day for reminders.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("protocol_reminders").insert({
        user_id: user.id,
        protocol_id: protocolId,
        reminder_time: reminderTime,
        reminder_days: selectedDays,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Reminder Set!",
        description: `You'll receive reminders for ${protocolName} on ${selectedDays.join(", ")} at ${reminderTime}.`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Set Reminder for {protocolName}
          </DialogTitle>
          <DialogDescription>
            Get reminders to take your doses based on the protocol schedule: {frequency}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Reminder Time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Days of Week</Label>
            <div className="grid grid-cols-2 gap-3">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <label
                    htmlFor={day}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> Browser reminders require permission. You'll need to allow notifications to receive these reminders.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "Setting..." : "Set Reminder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
