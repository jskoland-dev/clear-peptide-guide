import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FlaskConical, MoreVertical, CheckCircle, XCircle, Clock, Trash2, Pencil } from "lucide-react";
import { format, differenceInDays, differenceInHours, isPast } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditVialDialog } from "@/components/dashboard/EditVialDialog";

interface Vial {
  id: string;
  peptide_name: string;
  total_amount_mg: number;
  remaining_amount_mg: number;
  bac_water_ml: number;
  reconstitution_date: string;
  expiration_date: string | null;
  notes: string | null;
  status: string;
}

interface VialCardProps {
  vial: Vial;
  onStatusUpdate: (vialId: string, status: string) => void;
  onDelete?: () => void;
}

export function VialCard({ vial, onStatusUpdate, onDelete }: VialCardProps) {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState("");
  const [statusColor, setStatusColor] = useState<"default" | "warning" | "destructive">("default");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    const { error } = await supabase
      .from("vials")
      .delete()
      .eq("id", vial.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete vial. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    } else {
      toast({
        title: "Success",
        description: "Vial deleted successfully.",
      });
      setShowDeleteDialog(false);
      if (onDelete) onDelete();
    }
  };

  useEffect(() => {
    if (!vial.expiration_date) return;

    const updateCountdown = () => {
      const now = new Date();
      const expiration = new Date(vial.expiration_date!);
      
      if (isPast(expiration)) {
        setTimeRemaining("Expired");
        setStatusColor("destructive");
        return;
      }

      const daysLeft = differenceInDays(expiration, now);
      const hoursLeft = differenceInHours(expiration, now);

      if (daysLeft > 7) {
        setTimeRemaining(`${daysLeft} days left`);
        setStatusColor("default");
      } else if (daysLeft > 2) {
        setTimeRemaining(`${daysLeft} days left`);
        setStatusColor("warning");
      } else if (daysLeft >= 0) {
        setTimeRemaining(`${hoursLeft} hours left`);
        setStatusColor("destructive");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [vial.expiration_date]);

  const getStatusBadge = () => {
    if (vial.status === "finished") {
      return <Badge variant="secondary">Finished</Badge>;
    }
    if (vial.status === "disposed") {
      return <Badge variant="secondary">Disposed</Badge>;
    }
    if (vial.status === "expired" || (vial.expiration_date && isPast(new Date(vial.expiration_date)))) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return null;
  };

  const getCardStyle = () => {
    if (vial.status !== "active" && vial.status !== "expired") {
      return "opacity-60";
    }
    if (statusColor === "destructive") {
      return "border-red-500/50 shadow-red-500/20";
    }
    if (statusColor === "warning") {
      return "border-yellow-500/50 shadow-yellow-500/20";
    }
    return "border-green-500/50 shadow-green-500/20";
  };

  const remaining = Number(vial.remaining_amount_mg);
  const total = Number(vial.total_amount_mg);
  const percentage = (remaining / total) * 100;
  const concentration = (total / Number(vial.bac_water_ml)).toFixed(2);

  return (
    <Card className={`hover-lift transition-all ${getCardStyle()}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            {vial.peptide_name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {(vial.status === "active" || vial.status === "expired") && (
              <>
                <EditVialDialog vial={vial} onSuccess={onDelete || (() => {})} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusUpdate(vial.id, "finished")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Finished
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(vial.id, "disposed")}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Mark as Disposed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Vial
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Countdown Timer */}
        {vial.expiration_date && vial.status === "active" && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              statusColor === "destructive"
                ? "bg-red-500/10 border border-red-500/20"
                : statusColor === "warning"
                ? "bg-yellow-500/10 border border-yellow-500/20"
                : "bg-green-500/10 border border-green-500/20"
            }`}
          >
            <Clock className="h-4 w-4" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{timeRemaining}</p>
              <p className="text-xs text-muted-foreground">
                Until {format(new Date(vial.expiration_date), "MMM dd")}
              </p>
            </div>
          </div>
        )}

        {/* Amount Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-semibold">
              {remaining.toFixed(2)} / {total} mg
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Details Grid */}
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

        {/* Dates */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>Reconstituted: {format(new Date(vial.reconstitution_date), "MMM dd, yyyy")}</p>
          {vial.expiration_date && (
            <p>Expires: {format(new Date(vial.expiration_date), "MMM dd, yyyy")}</p>
          )}
        </div>

        {/* Notes */}
        {vial.notes && (
          <p className="text-sm text-muted-foreground pt-2 border-t italic">
            {vial.notes}
          </p>
        )}
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vial? This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
