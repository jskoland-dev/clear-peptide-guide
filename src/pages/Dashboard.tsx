import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Activity, Syringe, FlaskConical, TrendingUp, LogOut, Plus } from "lucide-react";
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

  if (loading) {
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
              Dose Tracker Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Track your peptide journey with precision</p>
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
