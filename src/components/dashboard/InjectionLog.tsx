import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, MapPin, Pill, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

export function InjectionLog({ injections, onUpdate }: InjectionLogProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (injectionId: string) => {
    setDeletingId(injectionId);
    
    const { error } = await supabase
      .from("injections")
      .delete()
      .eq("id", injectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete injection. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Injection deleted successfully.",
      });
      onUpdate();
    }
    
    setDeletingId(null);
  };

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
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {injection.dose_amount} {injection.dose_unit}
                </Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={deletingId === injection.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Injection</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this injection record? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(injection.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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
