import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Pill } from "lucide-react";
import { format } from "date-fns";

interface Injection {
  id: string;
  peptide_name: string;
  dose_amount: number;
  dose_unit: string;
  injection_site: string;
  injection_date: string;
  notes?: string;
}

interface InjectionLogProps {
  injections: Injection[];
  onUpdate: () => void;
}

export function InjectionLog({ injections }: InjectionLogProps) {
  if (injections.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No injections logged yet. Add your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {injections.map((injection) => (
        <Card key={injection.id} className="hover-lift">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                {injection.peptide_name}
              </CardTitle>
              <Badge variant="secondary">
                {injection.dose_amount} {injection.dose_unit}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(injection.injection_date), "MMM dd, yyyy 'at' h:mm a")}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {injection.injection_site}
            </div>
            {injection.notes && (
              <p className="text-sm text-muted-foreground mt-2 pt-2 border-t">
                {injection.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
