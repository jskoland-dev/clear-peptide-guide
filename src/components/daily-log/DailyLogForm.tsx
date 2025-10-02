import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Smile, Meh, Frown, Save } from "lucide-react";

const COMMON_SIDE_EFFECTS = [
  "Headache",
  "Nausea",
  "Fatigue",
  "Injection site redness",
  "Dizziness",
  "Increased appetite",
  "Decreased appetite",
  "Water retention",
];

const MOOD_EMOJIS = [
  { value: 1, icon: Frown, label: "Very Bad" },
  { value: 3, icon: Frown, label: "Bad" },
  { value: 5, icon: Meh, label: "Neutral" },
  { value: 7, icon: Smile, label: "Good" },
  { value: 10, icon: Smile, label: "Excellent" },
];

export function DailyLogForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [existingLog, setExistingLog] = useState<any>(null);
  
  const [moodRating, setMoodRating] = useState(5);
  const [selectedSideEffects, setSelectedSideEffects] = useState<string[]>([]);
  const [sideEffectsNotes, setSideEffectsNotes] = useState("");
  const [positiveEffects, setPositiveEffects] = useState("");
  const [sleepQuality, setSleepQuality] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sorenessLevel, setSorenessLevel] = useState(5);
  const [bodyWeight, setBodyWeight] = useState("");
  const [bodyFatPercentage, setBodyFatPercentage] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadTodayLog();
  }, []);

  const loadTodayLog = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("log_date", today)
      .maybeSingle();

    if (data && !error) {
      setExistingLog(data);
      setMoodRating(data.mood_rating || 5);
      setSelectedSideEffects(data.side_effects || []);
      setSideEffectsNotes(data.side_effects_notes || "");
      setPositiveEffects(data.positive_effects || "");
      setSleepQuality(data.sleep_quality || 5);
      setEnergyLevel(data.energy_level || 5);
      setSorenessLevel(data.soreness_level || 5);
      setBodyWeight(data.body_weight?.toString() || "");
      setBodyFatPercentage(data.body_fat_percentage?.toString() || "");
      setNotes(data.notes || "");
    }
  };

  const handleSideEffectToggle = (effect: string) => {
    setSelectedSideEffects(prev =>
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date().toISOString().split('T')[0];
    const logData = {
      log_date: today,
      mood_rating: moodRating,
      side_effects: selectedSideEffects,
      side_effects_notes: sideEffectsNotes || null,
      positive_effects: positiveEffects || null,
      sleep_quality: sleepQuality,
      energy_level: energyLevel,
      soreness_level: sorenessLevel,
      body_weight: bodyWeight ? parseFloat(bodyWeight) : null,
      body_fat_percentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : null,
      notes: notes || null,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    };

    const { error } = existingLog
      ? await supabase.from("daily_logs").update(logData).eq("id", existingLog.id)
      : await supabase.from("daily_logs").insert(logData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save log. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: existingLog ? "Log updated successfully!" : "Log saved successfully!",
      });
      loadTodayLog();
    }

    setLoading(false);
  };

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return { icon: Frown, color: "text-red-500" };
    if (value <= 4) return { icon: Frown, color: "text-orange-500" };
    if (value <= 6) return { icon: Meh, color: "text-yellow-500" };
    if (value <= 8) return { icon: Smile, color: "text-green-500" };
    return { icon: Smile, color: "text-emerald-500" };
  };

  const currentMoodEmoji = getMoodEmoji(moodRating);
  const MoodIcon = currentMoodEmoji.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Entry</CardTitle>
        <CardDescription>
          {existingLog ? "Update your log for today" : "Quick log - takes less than 30 seconds"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Rating */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>How do you feel today?</Label>
              <div className="flex items-center gap-2">
                <MoodIcon className={`h-6 w-6 ${currentMoodEmoji.color}`} />
                <span className="font-semibold">{moodRating}/10</span>
              </div>
            </div>
            <Slider
              value={[moodRating]}
              onValueChange={([value]) => setMoodRating(value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Side Effects */}
          <div className="space-y-3">
            <Label>Side Effects (if any)</Label>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_SIDE_EFFECTS.map((effect) => (
                <div key={effect} className="flex items-center space-x-2">
                  <Checkbox
                    id={effect}
                    checked={selectedSideEffects.includes(effect)}
                    onCheckedChange={() => handleSideEffectToggle(effect)}
                  />
                  <label
                    htmlFor={effect}
                    className="text-sm cursor-pointer select-none"
                  >
                    {effect}
                  </label>
                </div>
              ))}
            </div>
            <Input
              placeholder="Other side effects..."
              value={sideEffectsNotes}
              onChange={(e) => setSideEffectsNotes(e.target.value)}
            />
          </div>

          {/* Positive Effects */}
          <div className="space-y-2">
            <Label htmlFor="positive">Positive Effects</Label>
            <Textarea
              id="positive"
              placeholder="Any positive changes you've noticed..."
              value={positiveEffects}
              onChange={(e) => setPositiveEffects(e.target.value)}
              rows={2}
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Sleep Quality: {sleepQuality}/10</Label>
              <Slider
                value={[sleepQuality]}
                onValueChange={([value]) => setSleepQuality(value)}
                min={1}
                max={10}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Energy Level: {energyLevel}/10</Label>
              <Slider
                value={[energyLevel]}
                onValueChange={([value]) => setEnergyLevel(value)}
                min={1}
                max={10}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Soreness: {sorenessLevel}/10</Label>
              <Slider
                value={[sorenessLevel]}
                onValueChange={([value]) => setSorenessLevel(value)}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>

          {/* Body Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Body Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 180.5"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyfat">Body Fat %</Label>
              <Input
                id="bodyfat"
                type="number"
                step="0.1"
                placeholder="e.g., 15.2"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Anything else you want to remember..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : existingLog ? "Update Log" : "Save Log"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
