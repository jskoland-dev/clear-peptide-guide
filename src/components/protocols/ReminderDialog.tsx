import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

interface Protocol {
  id: string;
  peptide_name: string;
  frequency: string;
}

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: Protocol;
  userId: string;
}

const DAYS_OF_WEEK = [
  { value: "Monday", label: "Mon" },
  { value: "Tuesday", label: "Tue" },
  { value: "Wednesday", label: "Wed" },
  { value: "Thursday", label: "Thu" },
  { value: "Friday", label: "Fri" },
  { value: "Saturday", label: "Sat" },
  { value: "Sunday", label: "Sun" },
];

export function ReminderDialog({ open, onOpenChange, protocol, userId }: ReminderDialogProps) {
  const [reminderTime, setReminderTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDays.length === 0) {
      toast({
        title: "Select days",
        description: "Please select at least one day for reminders",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("protocol_reminders").insert({
        user_id: userId,
        protocol_id: protocol.id,
        reminder_time: reminderTime,
        reminder_days: selectedDays,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Reminder set!",
        description: `You'll receive reminders for ${protocol.peptide_name}`,
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
            Set Reminder for {protocol.peptide_name}
          </DialogTitle>
          <DialogDescription>
            Based on the recommended frequency: {protocol.frequency}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="time">Reminder Time</Label>
            <Input
              id="time"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Choose a time that works best for your schedule
            </p>
          </div>

          <div className="space-y-3">
            <Label>Select Days</Label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex flex-col items-center">
                  <Checkbox
                    id={day.value}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <label
                    htmlFor={day.value}
                    className="text-xs mt-1 cursor-pointer select-none"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select the days you want to be reminded to take your dose
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium mb-1">Note:</p>
            <p className="text-xs text-muted-foreground">
              These are in-app reminders. For best results, also set phone notifications
              to ensure you never miss a dose.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Setting Reminder..." : "Set Reminder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
