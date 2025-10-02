import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

interface ProgressPhoto {
  id: string;
  photo_url: string;
  date_taken: string;
  weight?: number;
  measurements?: any;
  notes?: string;
  peptides_used?: string[];
}

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: ProgressPhoto[];
}

export function CompareDialog({ open, onOpenChange, photos }: CompareDialogProps) {
  if (photos.length !== 2) return null;

  const [photo1, photo2] = photos.sort(
    (a, b) => new Date(a.date_taken).getTime() - new Date(b.date_taken).getTime()
  );

  const calculateChange = (before?: number, after?: number) => {
    if (!before || !after) return null;
    const change = after - before;
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}`;
  };

  const getMeasurementChange = (key: string) => {
    const before = photo1.measurements?.[key];
    const after = photo2.measurements?.[key];
    return calculateChange(
      before ? parseFloat(before) : undefined,
      after ? parseFloat(after) : undefined
    );
  };

  const allMeasurementKeys = new Set([
    ...Object.keys(photo1.measurements || {}),
    ...Object.keys(photo2.measurements || {}),
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Progress</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before Photo */}
          <div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
              <img
                src={photo1.photo_url}
                alt="Before"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge>Before</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">
                  {format(new Date(photo1.date_taken), "MMMM d, yyyy")}
                </p>
                {photo1.weight && (
                  <p className="text-muted-foreground">{photo1.weight} lbs</p>
                )}
              </div>

              {photo1.peptides_used && photo1.peptides_used.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Peptides:</p>
                  <div className="flex flex-wrap gap-1">
                    {photo1.peptides_used.map((peptide, index) => (
                      <Badge key={index} variant="secondary">
                        {peptide}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {photo1.measurements && Object.keys(photo1.measurements).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Measurements:</p>
                  <div className="text-sm space-y-1">
                    {Object.entries(photo1.measurements).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize text-muted-foreground">{key}:</span>
                        <span>{String(value)}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {photo1.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{photo1.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* After Photo */}
          <div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
              <img
                src={photo2.photo_url}
                alt="After"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge>After</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">
                  {format(new Date(photo2.date_taken), "MMMM d, yyyy")}
                </p>
                {photo2.weight && (
                  <p className="text-muted-foreground">
                    {photo2.weight} lbs
                    {calculateChange(photo1.weight, photo2.weight) && (
                      <span className="ml-2 text-sm">
                        ({calculateChange(photo1.weight, photo2.weight)} lbs)
                      </span>
                    )}
                  </p>
                )}
              </div>

              {photo2.peptides_used && photo2.peptides_used.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Peptides:</p>
                  <div className="flex flex-wrap gap-1">
                    {photo2.peptides_used.map((peptide, index) => (
                      <Badge key={index} variant="secondary">
                        {peptide}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {photo2.measurements && Object.keys(photo2.measurements).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Measurements:</p>
                  <div className="text-sm space-y-1">
                    {Array.from(allMeasurementKeys).map((key) => {
                      const value = photo2.measurements?.[key];
                      const change = getMeasurementChange(key);
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize text-muted-foreground">{key}:</span>
                          <span>
                            {value ? `${value}"` : "-"}
                            {change && (
                              <span className="ml-2 text-sm">({change}")</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {photo2.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{photo2.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time Between */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {Math.floor(
              (new Date(photo2.date_taken).getTime() -
                new Date(photo1.date_taken).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days between photos
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
