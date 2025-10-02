import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, TrendingUp, Lock, Sparkles } from "lucide-react";
import { DailyLogForm } from "@/components/daily-log/DailyLogForm";
import { LogTrends } from "@/components/daily-log/LogTrends";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DailyLog() {
  const { user, loading } = useAuth();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
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
                  Daily Log
                </h1>
                <p className="text-muted-foreground mt-2">Upgrade to unlock daily tracking</p>
              </div>
            </div>
          </div>

          {/* Upgrade Card */}
          <Card className="max-w-3xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Track Your Daily Progress</CardTitle>
              <CardDescription className="text-lg">
                Document side effects, results, and correlate with peptide usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Quick Daily Entries</div>
                    <div className="text-sm text-muted-foreground">Log mood, sleep, energy, and side effects in under 30 seconds</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Track Physical Changes</div>
                    <div className="text-sm text-muted-foreground">Monitor body weight, body fat %, and soreness levels</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Visualize Trends</div>
                    <div className="text-sm text-muted-foreground">See patterns over time with beautiful charts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold">Correlate with Peptides</div>
                    <div className="text-sm text-muted-foreground">Understand which peptides are working for you</div>
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
                Daily Log
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your daily progress and side effects
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="log" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Log
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log">
            <DailyLogForm />
          </TabsContent>

          <TabsContent value="trends">
            <LogTrends />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
