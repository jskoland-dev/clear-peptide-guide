import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { progressPhotoSchema } from "@/lib/validationSchemas";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AddPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoAdded: () => void;
}

export function AddPhotoDialog({ open, onOpenChange, onPhotoAdded }: AddPhotoDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    weight: "",
    notes: "",
    peptides: [] as string[],
    peptideInput: "",
    measurements: {
      chest: "",
      waist: "",
      hips: "",
      arms: "",
      legs: "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const addPeptide = () => {
    if (formData.peptideInput.trim()) {
      setFormData({
        ...formData,
        peptides: [...formData.peptides, formData.peptideInput.trim()],
        peptideInput: "",
      });
    }
  };

  const removePeptide = (index: number) => {
    setFormData({
      ...formData,
      peptides: formData.peptides.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user) return;

    // Validate inputs
    try {
      const validationResult = progressPhotoSchema.safeParse({
        weight: formData.weight,
        peptides: formData.peptides,
        measurements: formData.measurements,
        notes: formData.notes,
        file: selectedFile,
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
      // Upload to storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("progress-photos")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save to database
      const measurements = Object.fromEntries(
        Object.entries(formData.measurements).filter(([_, v]) => v !== "")
      );

      const { error: dbError } = await supabase
        .from("progress_photos")
        .insert({
          user_id: user.id,
          photo_url: fileName,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          measurements: Object.keys(measurements).length > 0 ? measurements : null,
          notes: formData.notes || null,
          peptides_used: formData.peptides.length > 0 ? formData.peptides : null,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Photo added successfully",
      });

      // Reset form
      setImagePreview(null);
      setSelectedFile(null);
      setFormData({
        weight: "",
        notes: "",
        peptides: [],
        peptideInput: "",
        measurements: {
          chest: "",
          waist: "",
          hips: "",
          arms: "",
          legs: "",
        },
      });

      onPhotoAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add photo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Progress Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {!imagePreview ? (
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-32"
                onClick={handleCameraCapture}
              >
                <div className="text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Take Photo</p>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-32"
                onClick={handleFileUpload}
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Upload Photo</p>
                </div>
              </Button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full rounded-lg"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="peptide">Peptides Used</Label>
              <div className="flex gap-2">
                <Input
                  id="peptide"
                  value={formData.peptideInput}
                  onChange={(e) =>
                    setFormData({ ...formData, peptideInput: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPeptide();
                    }
                  }}
                  placeholder="e.g., BPC-157"
                />
                <Button type="button" onClick={addPeptide} size="sm">
                  Add
                </Button>
              </div>
              {formData.peptides.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.peptides.map((peptide, index) => (
                    <Badge key={index} variant="secondary">
                      {peptide}
                      <button
                        onClick={() => removePeptide(index)}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Measurements (inches)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Input
                  placeholder="Chest"
                  type="number"
                  step="0.1"
                  value={formData.measurements.chest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: {
                        ...formData.measurements,
                        chest: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Waist"
                  type="number"
                  step="0.1"
                  value={formData.measurements.waist}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: {
                        ...formData.measurements,
                        waist: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Hips"
                  type="number"
                  step="0.1"
                  value={formData.measurements.hips}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: {
                        ...formData.measurements,
                        hips: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Arms"
                  type="number"
                  step="0.1"
                  value={formData.measurements.arms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: {
                        ...formData.measurements,
                        arms: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Input
                  placeholder="Legs"
                  type="number"
                  step="0.1"
                  value={formData.measurements.legs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      measurements: {
                        ...formData.measurements,
                        legs: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="How are you feeling? Any changes you've noticed?"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Photo"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
