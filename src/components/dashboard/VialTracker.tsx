import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FlaskConical } from "lucide-react";
import { format } from "date-fns";

interface Vial {
  id: string;
  peptide_name: string;
  total_amount_mg: number;
  remaining_amount_mg: number;
  bac_water_ml: number;
  reconstitution_date: string;
  expiration_date?: string;
  notes?: string;
}

interface VialTrackerProps {
  vials: Vial[];
  onUpdate: () => void;
}

export function VialTracker({ vials }: VialTrackerProps) {
  if (vials.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No vials tracked yet. Add your first vial!</p>
        </CardContent>
      </Card>
    );
  }

  const getVialStatus = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage === 0) return { label: "Empty", color: "destructive" as const };
    if (percentage < 20) return { label: "Low", color: "destructive" as const };
    if (percentage < 50) return { label: "Medium", color: "secondary" as const };
    return { label: "Good", color: "default" as const };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vials.map((vial) => {
        const remaining = Number(vial.remaining_amount_mg);
        const total = Number(vial.total_amount_mg);
        const percentage = (remaining / total) * 100;
        const status = getVialStatus(remaining, total);
        const concentration = (total / Number(vial.bac_water_ml)).toFixed(2);

        return (
          <Card key={vial.id} className="hover-lift">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  {vial.peptide_name}
                </CardTitle>
                <Badge variant={status.color}>{status.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-semibold">
                    {remaining.toFixed(2)} / {total} mg
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Concentration</p>
                  <p className="font-medium">{concentration} mg/mL</p>
                </div>
                <div>
                  <p className="text-muted-foreground">BAC Water</p>
                  <p className="font-medium">{vial.bac_water_ml} mL</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Reconstituted: {format(new Date(vial.reconstitution_date), "MMM dd, yyyy")}</p>
                {vial.expiration_date && (
                  <p className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Expires: {format(new Date(vial.expiration_date), "MMM dd, yyyy")}
                  </p>
                )}
              </div>

              {vial.notes && (
                <p className="text-sm text-muted-foreground pt-2 border-t">
                  {vial.notes}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
