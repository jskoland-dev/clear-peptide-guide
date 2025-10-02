import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Activity, Syringe, FlaskConical, TrendingUp, LogOut, Plus, BookOpen, Lock, Sparkles, Bot, Camera, BarChart3 } from "lucide-react";
import { InjectionLog } from "@/components/dashboard/InjectionLog";
import { VialTracker } from "@/components/dashboard/VialTracker";
import { AddInjectionDialog } from "@/components/dashboard/AddInjectionDialog";
import { AddVialDialog } from "@/components/dashboard/AddVialDialog";

interface Injection {
  id: string;
  peptide_name: string;
  dose_amount: number;
  dose_unit: string;
  injection_site: string;
  injection_date: string;
  notes?: string;
}

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

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [injections, setInjections] = useState<Injection[]>([]);
  const [vials, setVials] = useState<Vial[]>([]);
  const [stats, setStats] = useState({
    totalInjections: 0,
    averageDose: 0,
    activeVials: 0,
    lowVials: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [injectionsRes, vialsRes] = await Promise.all([
      supabase
        .from("injections")
        .select("*")
        .order("injection_date", { ascending: false }),
      supabase
        .from("vials")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (injectionsRes.data) {
      setInjections(injectionsRes.data);
      const total = injectionsRes.data.length;
      const avgDose = total > 0
        ? injectionsRes.data.reduce((acc, inj) => acc + Number(inj.dose_amount), 0) / total
        : 0;
      setStats(prev => ({ ...prev, totalInjections: total, averageDose: avgDose }));
    }

    if (vialsRes.data) {
      setVials(vialsRes.data);
      const active = vialsRes.data.filter(v => Number(v.remaining_amount_mg) > 0).length;
      const low = vialsRes.data.filter(v => {
        const remaining = Number(v.remaining_amount_mg);
        const total = Number(v.total_amount_mg);
        return remaining > 0 && remaining < total * 0.2;
      }).length;
      setStats(prev => ({ ...prev, activeVials: active, lowVials: low }));
    }
  };

  const getInjectionChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: injections.filter(inj => inj.injection_date.split('T')[0] === date).length,
    }));
  };

  const getInjectionSiteData = () => {
    const sites = injections.reduce((acc, inj) => {
      acc[inj.injection_site] = (acc[inj.injection_site] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sites).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isPremium ? "Dose Tracker Dashboard" : "Welcome to Your Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isPremium ? "Track your peptide journey with precision" : "Explore free features and upgrade for full tracking"}
            </p>
          </div>
          <div className="flex gap-2">
            {isPremium && (
              <Button variant="outline" onClick={() => navigate("/analytics")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/ai-assistant")}>
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            {isPremium && (
              <>
                <Button variant="outline" onClick={() => navigate("/progress")}>
                  <Camera className="h-4 w-4 mr-2" />
                  Progress
                </Button>
                <Button variant="outline" onClick={() => navigate("/analytics")}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" onClick={() => navigate("/daily-log")}>
                  <Activity className="h-4 w-4 mr-2" />
                  Daily Log
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => navigate("/protocols")}>
              <BookOpen className="h-4 w-4 mr-2" />
              Protocols
            </Button>
            <Button variant="outline" onClick={() => navigate("/calculator")}>
              Calculator
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Upgrade Banner for Free Users */}
        {!isPremium && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Unlock Full Tracking Features</h3>
                    <p className="text-sm text-muted-foreground">Get dose tracking, vial management, progress photos, and unlimited AI messages</p>
                  </div>
                </div>
                <Button size="lg" className="shrink-0">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade to Premium - $9/mo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {isPremium ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Injections</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalInjections}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Dose</CardTitle>
              <Syringe className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.averageDose.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">mg per injection</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Vials</CardTitle>
              <FlaskConical className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeVials}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in use</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Vials</CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.lowVials}</div>
              <p className="text-xs text-muted-foreground mt-1">Need attention</p>
            </CardContent>
          </Card>
        </div>
        ) : (
          /* Free User View - Locked Preview */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Card className="stat-card opacity-50">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-background/30 rounded-lg flex items-center justify-center z-10">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Injections</CardTitle>
                  <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground mt-1">Premium feature</p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <Card className="stat-card opacity-50">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-background/30 rounded-lg flex items-center justify-center z-10">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Dose</CardTitle>
                  <Syringe className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground mt-1">Premium feature</p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <Card className="stat-card opacity-50">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-background/30 rounded-lg flex items-center justify-center z-10">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Vials</CardTitle>
                  <FlaskConical className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground mt-1">Premium feature</p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <Card className="stat-card opacity-50">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-background/30 rounded-lg flex items-center justify-center z-10">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Low Vials</CardTitle>
                  <TrendingUp className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground mt-1">Premium feature</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Charts - Premium Only */}
        {isPremium && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Injection Frequency (Last 7 Days)</CardTitle>
              <CardDescription>Track your injection pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getInjectionChartData()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Injection Sites Distribution</CardTitle>
              <CardDescription>Where you inject most often</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getInjectionSiteData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getInjectionSiteData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Main Content Tabs - Premium Only */}
        {isPremium && (
          <Tabs defaultValue="injections" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="injections">Injection Log</TabsTrigger>
            <TabsTrigger value="vials">Vial Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="injections" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Recent Injections</h2>
              <AddInjectionDialog vials={vials} onSuccess={fetchData} />
            </div>
            <InjectionLog injections={injections} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="vials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Vial Inventory</h2>
              <AddVialDialog onSuccess={fetchData} />
            </div>
            <VialTracker vials={vials} onUpdate={fetchData} />
          </TabsContent>
        </Tabs>
        )}

        {/* Free User - Available Features */}
        {!isPremium && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/ai-assistant")}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Get personalized peptide guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Ask questions about dosing, protocols, and safety
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  5 free messages/month
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/calculator")}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                  <Activity className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Dosage Calculator</CardTitle>
                <CardDescription>
                  Calculate precise peptide doses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Easy-to-use calculator for reconstitution and dosing
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/protocols")}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Protocols Library</CardTitle>
                <CardDescription>
                  Browse peptide protocols
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View detailed protocols for different goals
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
