import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { injectionSchema } from "@/lib/validationSchemas";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Vial {
  id: string;
  peptide_name: string;
}

interface AddInjectionDialogProps {
  vials: Vial[];
  onSuccess: () => void;
}

const INJECTION_SITES = [
  "Abdomen",
  "Thigh (Left)",
  "Thigh (Right)",
  "Upper Arm (Left)",
  "Upper Arm (Right)",
  "Gluteal (Left)",
  "Gluteal (Right)",
];

export function AddInjectionDialog({ vials, onSuccess }: AddInjectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vialId: "",
    peptideName: "",
    doseAmount: "",
    doseUnit: "mg",
    injectionSite: "",
    injectionDate: new Date().toISOString().slice(0, 16),
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    try {
      const validationResult = injectionSchema.safeParse({
        peptideName: formData.peptideName,
        doseAmount: formData.doseAmount,
        doseUnit: formData.doseUnit,
        injectionSite: formData.injectionSite,
        injectionDate: formData.injectionDate,
        notes: formData.notes || undefined,
      });

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => e.message).join(", ");
        toast({
          title: "Validation Error",
          description: errors,
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("injections").insert({
        user_id: user.id,
        vial_id: formData.vialId || null,
        peptide_name: formData.peptideName,
        dose_amount: parseFloat(formData.doseAmount),
        dose_unit: formData.doseUnit,
        injection_site: formData.injectionSite,
        injection_date: formData.injectionDate,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Injection logged successfully." });
      setOpen(false);
      setFormData({
        vialId: "",
        peptideName: "",
        doseAmount: "",
        doseUnit: "mg",
        injectionSite: "",
        injectionDate: new Date().toISOString().slice(0, 16),
        notes: "",
      });
      onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVialSelect = (vialId: string) => {
    const vial = vials.find(v => v.id === vialId);
    setFormData(prev => ({
      ...prev,
      vialId,
      peptideName: vial?.peptide_name || "",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Injection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log New Injection</DialogTitle>
          <DialogDescription>Record your peptide injection details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vial">Select Vial (Optional)</Label>
            <Select value={formData.vialId} onValueChange={handleVialSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a vial or enter manually" />
              </SelectTrigger>
              <SelectContent>
                {vials.map((vial) => (
                  <SelectItem key={vial.id} value={vial.id}>
                    {vial.peptide_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="peptideName">Peptide Name *</Label>
            <Input
              id="peptideName"
              value={formData.peptideName}
              onChange={(e) => setFormData(prev => ({ ...prev, peptideName: e.target.value }))}
              required
              placeholder="e.g., Semaglutide"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doseAmount">Dose Amount *</Label>
              <Input
                id="doseAmount"
                type="number"
                step="0.01"
                value={formData.doseAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, doseAmount: e.target.value }))}
                required
                placeholder="0.25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doseUnit">Unit *</Label>
              <Select value={formData.doseUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, doseUnit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="mcg">mcg</SelectItem>
                  <SelectItem value="units">units</SelectItem>
                  <SelectItem value="IU">IU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="injectionSite">Injection Site *</Label>
            <Select value={formData.injectionSite} onValueChange={(value) => setFormData(prev => ({ ...prev, injectionSite: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select injection site" />
              </SelectTrigger>
              <SelectContent>
                {INJECTION_SITES.map((site) => (
                  <SelectItem key={site} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="injectionDate">Date & Time *</Label>
            <Input
              id="injectionDate"
              type="datetime-local"
              value={formData.injectionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, injectionDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any observations or notes..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging..." : "Log Injection"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
