import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subDays } from "date-fns";
import { TrendingUp, Activity, Moon, Zap, Scale, LogIn } from "lucide-react";

interface DailyLog {
  log_date: string;
  mood_rating: number | null;
  sleep_quality: number | null;
  energy_level: number | null;
  soreness_level: number | null;
  body_weight: number | null;
  body_fat_percentage: number | null;
  side_effects: string[] | null;
  positive_effects: string | null;
}

export function LogTrends() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    if (user) {
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, [timeRange, user]);

  const fetchLogs = async () => {
    setLoading(true);
    const daysAgo = parseInt(timeRange);
    const startDate = subDays(new Date(), daysAgo).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("daily_logs")
      .select("*")
      .gte("log_date", startDate)
      .order("log_date", { ascending: true });

    if (data && !error) {
      setLogs(data);
    }
    setLoading(false);
  };

  const getMoodData = () => {
    return logs.map(log => ({
      date: format(new Date(log.log_date), "MMM dd"),
      mood: log.mood_rating,
      sleep: log.sleep_quality,
      energy: log.energy_level,
    }));
  };

  const getBodyData = () => {
    return logs.map(log => ({
      date: format(new Date(log.log_date), "MMM dd"),
      weight: log.body_weight,
      bodyFat: log.body_fat_percentage,
    }));
  };

  const getSorenessData = () => {
    return logs.map(log => ({
      date: format(new Date(log.log_date), "MMM dd"),
      soreness: log.soreness_level,
    }));
  };

  const calculateAverage = (key: keyof DailyLog) => {
    const validLogs = logs.filter(log => log[key] !== null);
    if (validLogs.length === 0) return 0;
    const sum = validLogs.reduce((acc, log) => acc + (Number(log[key]) || 0), 0);
    return (sum / validLogs.length).toFixed(1);
  };

  const getMostCommonSideEffect = () => {
    const allEffects: string[] = [];
    logs.forEach(log => {
      if (log.side_effects) {
        allEffects.push(...log.side_effects);
      }
    });
    
    if (allEffects.length === 0) return "None";
    
    const counts = allEffects.reduce((acc, effect) => {
      acc[effect] = (acc[effect] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None";
  };

  if (loading) {
    return <div className="text-center py-8">Loading trends...</div>;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to view your trends and analytics</p>
          <Button onClick={() => navigate("/auth")}>
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No logs yet. Start logging daily to see trends!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)} className="w-auto">
          <TabsList>
            <TabsTrigger value="7">7 Days</TabsTrigger>
            <TabsTrigger value="30">30 Days</TabsTrigger>
            <TabsTrigger value="90">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Mood</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage("mood_rating")}/10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Sleep</CardTitle>
            <Moon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage("sleep_quality")}/10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Energy</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage("energy_level")}/10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Common Side Effect</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold truncate">{getMostCommonSideEffect()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mood, Sleep & Energy Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood, Sleep & Energy Trends</CardTitle>
          <CardDescription>Track your daily well-being over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getMoodData()}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" name="Mood" strokeWidth={2} />
              <Line type="monotone" dataKey="sleep" stroke="hsl(var(--secondary))" name="Sleep" strokeWidth={2} />
              <Line type="monotone" dataKey="energy" stroke="hsl(var(--accent))" name="Energy" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Body Metrics Chart */}
      {logs.some(log => log.body_weight || log.body_fat_percentage) && (
        <Card>
          <CardHeader>
            <CardTitle>Body Composition Trends</CardTitle>
            <CardDescription>Track physical changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getBodyData()}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  name="Weight (lbs)" 
                  strokeWidth={2} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="bodyFat" 
                  stroke="hsl(var(--destructive))" 
                  name="Body Fat %" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Soreness Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Soreness Levels</CardTitle>
          <CardDescription>Monitor recovery and inflammation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={getSorenessData()}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="soreness" 
                stroke="hsl(var(--destructive))" 
                name="Soreness" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
