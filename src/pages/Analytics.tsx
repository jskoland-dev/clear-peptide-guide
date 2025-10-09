import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, TrendingUp, Calendar, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { CalendarHeatmap } from "@/components/analytics/CalendarHeatmap";
import { PDFExport } from "@/components/analytics/PDFExport";

interface Injection {
  id: string;
  peptide_name: string;
  dose_amount: number;
  dose_unit: string;
  injection_site: string;
  injection_date: string;
  notes?: string;
  vial_id?: string;
}

interface Vial {
  id: string;
  peptide_name: string;
  total_amount_mg: number;
  remaining_amount_mg: number;
  bac_water_ml: number;
  reconstitution_date: string;
  expiration_date?: string;
  cost?: number;
  notes?: string;
}

export default function Analytics() {
  const { user, loading } = useAuth();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [injections, setInjections] = useState<Injection[]>([]);
  const [vials, setVials] = useState<Vial[]>([]);
  const [stats, setStats] = useState({
    totalInjections: 0,
    averageDose: 0,
    activeVials: 0,
    totalSpent: 0,
    avgCostPerInjection: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only redirect if user exists, subscription is loaded, AND confirmed not premium
    if (user && !subscriptionLoading && !loading && !isPremium) {
      navigate("/dashboard");
    }
  }, [user, isPremium, subscriptionLoading, loading, navigate]);

  useEffect(() => {
    if (user && isPremium) {
      fetchData();
    }
  }, [user, isPremium]);

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
    }

    if (vialsRes.data) {
      setVials(vialsRes.data);
      
      // Calculate stats
      const totalSpent = vialsRes.data.reduce((sum, v) => sum + (Number(v.cost) || 0), 0);
      const activeVials = vialsRes.data.filter(v => Number(v.remaining_amount_mg) > 0).length;
      const totalInjections = injectionsRes.data?.length || 0;
      const avgDose = totalInjections > 0
        ? (injectionsRes.data?.reduce((acc, inj) => acc + Number(inj.dose_amount), 0) || 0) / totalInjections
        : 0;
      const avgCostPerInjection = totalInjections > 0 ? totalSpent / totalInjections : 0;

      setStats({
        totalInjections,
        averageDose: avgDose,
        activeVials,
        totalSpent,
        avgCostPerInjection,
      });
    }
  };

  const getPeptideUsageOverTime = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: injections.filter(inj => inj.injection_date.split('T')[0] === date).length,
    }));
  };

  const getMonthlyCostBreakdown = () => {
    const monthlyData: Record<string, number> = {};
    
    vials.forEach(vial => {
      const month = new Date(vial.reconstitution_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyData[month] = (monthlyData[month] || 0) + (Number(vial.cost) || 0);
    });

    return Object.entries(monthlyData)
      .map(([month, cost]) => ({ month, cost }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6);
  };

  const getPeptideCostDistribution = () => {
    const peptideCosts: Record<string, number> = {};
    
    vials.forEach(vial => {
      peptideCosts[vial.peptide_name] = (peptideCosts[vial.peptide_name] || 0) + (Number(vial.cost) || 0);
    });

    return Object.entries(peptideCosts).map(([name, value]) => ({ name, value }));
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
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Deep insights into your peptide usage and spending
            </p>
          </div>
          <PDFExport injections={injections} vials={vials} stats={stats} />
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cost per Injection</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.avgCostPerInjection.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Average</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Injections</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalInjections}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Vials</CardTitle>
              <PieChartIcon className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeVials}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently tracking</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Heatmap */}
        <CalendarHeatmap injections={injections} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peptide Usage Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Peptide Usage Over Time</CardTitle>
              <CardDescription>Last 30 days of injection activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getPeptideUsageOverTime()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost Breakdown</CardTitle>
              <CardDescription>Spending trends by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getMonthlyCostBreakdown()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Distribution by Peptide */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Distribution by Peptide</CardTitle>
              <CardDescription>Total spending per peptide type</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getPeptideCostDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPeptideCostDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
