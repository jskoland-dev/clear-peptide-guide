import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Activity, Syringe, FlaskConical, TrendingUp, LogOut, Plus, BookOpen, Lock, Sparkles, Bot } from "lucide-react";
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

  // Premium Gate - Show upgrade prompt if not premium
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dose Tracker Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Upgrade to unlock tracking features</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Upgrade Card */}
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Unlock Premium Tracking</CardTitle>
              <CardDescription className="text-lg">
                Get full access to dose tracking, vial management, and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Card className="p-4 bg-muted/50">
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/50 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Total Injections</div>
                    <div className="text-2xl font-bold mt-1">--</div>
                  </Card>
                </div>
                <div className="relative">
                  <Card className="p-4 bg-muted/50">
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/50 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Average Dose</div>
                    <div className="text-2xl font-bold mt-1">--</div>
                  </Card>
                </div>
                <div className="relative">
                  <Card className="p-4 bg-muted/50">
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/50 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Active Vials</div>
                    <div className="text-2xl font-bold mt-1">--</div>
                  </Card>
                </div>
                <div className="relative">
                  <Card className="p-4 bg-muted/50">
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/50 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Low Vials</div>
                    <div className="text-2xl font-bold mt-1">--</div>
                  </Card>
                </div>
              </div>

              {/* Features List */}
              <div className="grid md:grid-cols-2 gap-4 py-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Track Every Injection</div>
                    <div className="text-sm text-muted-foreground">Log dose, site, date, and notes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Manage Vial Inventory</div>
                    <div className="text-sm text-muted-foreground">Track remaining amounts & expiration</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Visual Analytics</div>
                    <div className="text-sm text-muted-foreground">Charts showing usage patterns</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Save Protocols</div>
                    <div className="text-sm text-muted-foreground">Bookmark your favorite routines</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4 pt-4">
                <div className="text-2xl font-bold">$9<span className="text-lg text-muted-foreground font-normal">/month</span></div>
                <Button size="lg" className="w-full md:w-auto px-8" onClick={() => navigate("/")}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already premium? Refresh the page or sign out and back in.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Free Features Reminder */}
          <div className="text-center mt-8 text-muted-foreground">
            <p className="mb-2">You still have access to:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/calculator")}>
                Calculator
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/learn")}>
                Learning Resources
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/protocols")}>
                Browse Protocols
              </Button>
            </div>
          </div>
        </div>
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
              Dose Tracker Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Track your peptide journey with precision</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/ai-assistant")}>
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="outline" onClick={() => navigate("/vials")}>
              <FlaskConical className="h-4 w-4 mr-2" />
              My Vials
            </Button>
            <Button variant="outline" onClick={() => navigate("/protocols")}>
              <BookOpen className="h-4 w-4 mr-2" />
              Protocols
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

        {/* Stats Cards */}
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

        {/* Charts */}
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

        {/* Main Content Tabs */}
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
      </div>
    </div>
  );
}
