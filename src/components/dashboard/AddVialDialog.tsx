import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface AddVialDialogProps {
  onSuccess: () => void;
}

export function AddVialDialog({ onSuccess }: AddVialDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    peptideName: "",
    totalAmount: "",
    bacWater: "",
    reconstitutionDate: new Date().toISOString().split('T')[0],
    expirationDate: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const totalAmount = parseFloat(formData.totalAmount);

      const { error } = await supabase.from("vials").insert({
        user_id: user.id,
        peptide_name: formData.peptideName,
        total_amount_mg: totalAmount,
        remaining_amount_mg: totalAmount,
        bac_water_ml: parseFloat(formData.bacWater),
        reconstitution_date: formData.reconstitutionDate,
        expiration_date: formData.expirationDate || null,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Vial added successfully." });
      setOpen(false);
      setFormData({
        peptideName: "",
        totalAmount: "",
        bacWater: "",
        reconstitutionDate: new Date().toISOString().split('T')[0],
        expirationDate: "",
        notes: "",
      });
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vial</DialogTitle>
          <DialogDescription>Track a new peptide vial in your inventory</DialogDescription>
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
            {loading ? "Adding..." : "Add Vial"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
