import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, Upload, Plus, X, ArrowLeftRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddPhotoDialog } from "@/components/progress/AddPhotoDialog";
import { PhotoCard } from "@/components/progress/PhotoCard";
import { CompareDialog } from "@/components/progress/CompareDialog";
import { UpgradeDialog } from "@/components/progress/UpgradeDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressPhoto {
  id: string;
  photo_url: string;
  date_taken: string;
  weight?: number;
  measurements?: any;
  notes?: string;
  peptides_used?: string[];
}

const Progress = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Show upgrade dialog for non-premium users
  useEffect(() => {
    if (!subLoading && !isPremium && user) {
      setIsUpgradeDialogOpen(true);
    }
  }, [isPremium, subLoading, user]);

  useEffect(() => {
    if (user && isPremium) {
      fetchPhotos();
    }
  }, [user, isPremium]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .order("date_taken", { ascending: false });

      if (error) throw error;

      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from("progress-photos")
            .createSignedUrl(photo.photo_url, 3600);
          
          return {
            ...photo,
            photo_url: urlData?.signedUrl || photo.photo_url,
          };
        })
      );

      setPhotos(photosWithUrls);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoAdded = () => {
    fetchPhotos();
    setIsAddDialogOpen(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const photo = photos.find((p) => p.id === photoId);
      if (!photo) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("progress-photos")
        .remove([photo.photo_url.split("/progress-photos/")[1]]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("progress_photos")
        .delete()
        .eq("id", photoId);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
      fetchPhotos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      }
      if (prev.length >= 2) {
        return [prev[1], photoId];
      }
      return [...prev, photoId];
    });
  };

  // Show loading state while checking auth and subscription
  if (authLoading || subLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // For non-premium users, show the main UI with upgrade dialog
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Progress Tracker</h1>
                  <p className="text-sm text-muted-foreground">
                    Premium Feature
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center blur-sm pointer-events-none">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Progress Photos</h3>
            <p className="text-muted-foreground">Track your transformation</p>
          </Card>
        </main>

        <UpgradeDialog 
          open={isUpgradeDialogOpen} 
          onOpenChange={(open) => {
            setIsUpgradeDialogOpen(open);
            if (!open) navigate("/");
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Progress Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  Track your transformation journey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedPhotos.length === 2 && (
                <Button
                  variant="secondary"
                  onClick={() => setIsCompareDialogOpen(true)}
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              )}
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedPhotos.length > 0 && (
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                {selectedPhotos.length} photo{selectedPhotos.length > 1 ? "s" : ""} selected for comparison
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhotos([])}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="w-full aspect-[3/4] rounded-lg mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </Card>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <Card className="p-12 text-center">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your progress by adding your first photo
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Photo
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.includes(photo.id)}
                onSelect={() => togglePhotoSelection(photo.id)}
                onDelete={() => handleDeletePhoto(photo.id)}
              />
            ))}
          </div>
        )}
      </main>

      <AddPhotoDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onPhotoAdded={handlePhotoAdded}
      />

      <CompareDialog
        open={isCompareDialogOpen}
        onOpenChange={setIsCompareDialogOpen}
        photos={photos.filter((p) => selectedPhotos.includes(p.id))}
      />
    </div>
  );
};

export default Progress;
