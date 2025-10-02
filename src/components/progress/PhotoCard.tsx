import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check } from "lucide-react";
import { format } from "date-fns";
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

interface ProgressPhoto {
  id: string;
  photo_url: string;
  date_taken: string;
  weight?: number;
  measurements?: any;
  notes?: string;
  peptides_used?: string[];
}

interface PhotoCardProps {
  photo: ProgressPhoto;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function PhotoCard({ photo, isSelected, onSelect, onDelete }: PhotoCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={photo.photo_url}
          alt={`Progress photo from ${format(new Date(photo.date_taken), "MMM d, yyyy")}`}
          className="w-full h-full object-cover"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardContent className="p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold">
              {format(new Date(photo.date_taken), "MMM d, yyyy")}
            </p>
            {photo.weight && (
              <p className="text-sm text-muted-foreground">{photo.weight} lbs</p>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this progress photo. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {photo.peptides_used && photo.peptides_used.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {photo.peptides_used.map((peptide, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {peptide}
              </Badge>
            ))}
          </div>
        )}

        {photo.measurements && Object.keys(photo.measurements).length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1 mb-2">
            {Object.entries(photo.measurements).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span>{String(value)}"</span>
              </div>
            ))}
          </div>
        )}

        {photo.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {photo.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
