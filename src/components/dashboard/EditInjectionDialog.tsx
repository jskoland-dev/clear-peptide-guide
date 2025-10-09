import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

interface Injection {
  id: string;
  peptide_name: string;
  dose_amount: number;
  dose_unit: string;
  injection_site: string;
  injection_date: string;
  notes?: string;
}

interface EditInjectionDialogProps {
  injection: Injection;
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

export function EditInjectionDialog({ injection, onSuccess }: EditInjectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    peptideName: injection.peptide_name,
    doseAmount: injection.dose_amount.toString(),
    doseUnit: injection.dose_unit,
    injectionSite: injection.injection_site,
    injectionDate: injection.injection_date.slice(0, 16),
    notes: injection.notes || "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("injections")
        .update({
          peptide_name: formData.peptideName,
          dose_amount: parseFloat(formData.doseAmount),
          dose_unit: formData.doseUnit,
          injection_site: formData.injectionSite,
          injection_date: formData.injectionDate,
          notes: formData.notes || null,
        })
        .eq("id", injection.id);

      if (error) throw error;

      toast({ title: "Success!", description: "Injection updated successfully." });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Injection</DialogTitle>
          <DialogDescription>Update your injection record</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Updating..." : "Update Injection"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
