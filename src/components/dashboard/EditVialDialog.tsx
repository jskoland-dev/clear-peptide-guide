import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

interface Vial {
  id: string;
  peptide_name: string;
  total_amount_mg: number;
  remaining_amount_mg: number;
  bac_water_ml: number;
  reconstitution_date: string;
  expiration_date?: string;
  cost?: number;
  notes?: string;
}

interface EditVialDialogProps {
  vial: Vial;
  onSuccess: () => void;
}

export function EditVialDialog({ vial, onSuccess }: EditVialDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    peptideName: vial.peptide_name,
    totalAmount: vial.total_amount_mg.toString(),
    remainingAmount: vial.remaining_amount_mg.toString(),
    bacWater: vial.bac_water_ml.toString(),
    reconstitutionDate: vial.reconstitution_date.split('T')[0],
    expirationDate: vial.expiration_date ? vial.expiration_date.split('T')[0] : "",
    cost: vial.cost?.toString() || "",
    notes: vial.notes || "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("vials")
        .update({
          peptide_name: formData.peptideName,
          total_amount_mg: parseFloat(formData.totalAmount),
          remaining_amount_mg: parseFloat(formData.remainingAmount),
          bac_water_ml: parseFloat(formData.bacWater),
          reconstitution_date: formData.reconstitutionDate,
          expiration_date: formData.expirationDate || null,
          cost: formData.cost ? parseFloat(formData.cost) : 0,
          notes: formData.notes || null,
        })
        .eq("id", vial.id);

      if (error) throw error;

      toast({ title: "Success!", description: "Vial updated successfully." });
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
          <DialogTitle>Edit Vial</DialogTitle>
          <DialogDescription>Update your vial information</DialogDescription>
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

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount (mg) *</Label>
            <Input
              id="totalAmount"
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
              required
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remainingAmount">Remaining Amount (mg) *</Label>
            <Input
              id="remainingAmount"
              type="number"
              step="0.01"
              value={formData.remainingAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, remainingAmount: e.target.value }))}
              required
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bacWater">BAC Water (mL) *</Label>
            <Input
              id="bacWater"
              type="number"
              step="0.1"
              value={formData.bacWater}
              onChange={(e) => setFormData(prev => ({ ...prev, bacWater: e.target.value }))}
              required
              placeholder="2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reconstitutionDate">Reconstitution Date *</Label>
            <Input
              id="reconstitutionDate"
              type="date"
              value={formData.reconstitutionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, reconstitutionDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
            <Input
              id="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (Optional)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Vial"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
