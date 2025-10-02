import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FlaskConical, Lock, Sparkles } from "lucide-react";
import { AddVialDialog } from "@/components/dashboard/AddVialDialog";
import { VialCard } from "@/components/vials/VialCard";
import { useToast } from "@/hooks/use-toast";

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
  created_at: string;
}

export default function MyVials() {
  const { user, loading } = useAuth();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vials, setVials] = useState<Vial[]>([]);
  const [fetchingVials, setFetchingVials] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchVials();
      checkExpiringVials();
    }
  }, [user]);

  const fetchVials = async () => {
    setFetchingVials(true);
    const { data, error } = await supabase
      .from("vials")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setVials(data);
    }
    setFetchingVials(false);
  };

  const checkExpiringVials = async () => {
    const { data } = await supabase
      .from("vials")
      .select("*")
      .eq("status", "active")
      .not("expiration_date", "is", null);

    if (data) {
      const now = new Date();
      const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      data.forEach((vial) => {
        if (vial.expiration_date) {
          const expirationDate = new Date(vial.expiration_date);
          if (expirationDate <= twoDaysFromNow && expirationDate > now) {
            toast({
              title: "⚠️ Vial Expiring Soon!",
              description: `Your ${vial.peptide_name} vial expires in ${Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))} day(s)`,
              duration: 10000,
            });
          }
        }
      });
    }
  };

  const handleStatusUpdate = async (vialId: string, newStatus: string) => {
    const { error } = await supabase
      .from("vials")
      .update({ status: newStatus })
      .eq("id", vialId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update vial status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Vial marked as ${newStatus}`,
      });
      fetchVials();
    }
  };

  const activeVials = vials.filter(
    (v) => v.status === "active" || v.status === "expired"
  );
  const inactiveVials = vials.filter(
    (v) => v.status === "finished" || v.status === "disposed"
  );

  if (loading || subscriptionLoading || fetchingVials) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading your vials...</div>
      </div>
    );
  }

  // Premium Gate
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  My Vials
                </h1>
                <p className="text-muted-foreground mt-2">Upgrade to unlock vial tracking</p>
              </div>
            </div>
          </div>

          {/* Upgrade Card */}
          <Card className="max-w-3xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FlaskConical className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Track Your Vial Inventory</CardTitle>
              <CardDescription className="text-lg">
                Never inject expired peptides or run out unexpectedly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Log Reconstitution Details</div>
                    <div className="text-sm text-muted-foreground">Track peptide amount, BAC water, and mixing date</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Expiration Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified 2 days before vials expire</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Auto-Calculate Remaining Amount</div>
                    <div className="text-sm text-muted-foreground">Automatically deducts as you log injections</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Organized Archive</div>
                    <div className="text-sm text-muted-foreground">Keep history of finished and expired vials</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4 pt-4 border-t">
                <div className="text-2xl font-bold">$9<span className="text-lg text-muted-foreground font-normal">/month</span></div>
                <Button size="lg" className="w-full md:w-auto px-8" onClick={() => navigate("/")}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <p className="text-sm text-muted-foreground">
                  Includes full dashboard, injection tracking, and protocol saving
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Vials
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your peptide inventory and expiration dates
              </p>
            </div>
          </div>
          <AddVialDialog onSuccess={fetchVials} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Active ({activeVials.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Archived ({inactiveVials.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeVials.length === 0 ? (
              <div className="text-center py-12">
                <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active vials yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add your first vial to start tracking!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeVials.map((vial) => (
                  <VialCard
                    key={vial.id}
                    vial={vial}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-6">
            {inactiveVials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No archived vials yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveVials.map((vial) => (
                  <VialCard
                    key={vial.id}
                    vial={vial}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
