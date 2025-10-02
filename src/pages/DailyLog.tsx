import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { DailyLogForm } from "@/components/daily-log/DailyLogForm";
import { LogTrends } from "@/components/daily-log/LogTrends";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

class DailyLogErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error("DailyLog crashed:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-6">
          <div className="rounded-md border p-6 text-muted-foreground">Something went wrong loading Daily Log. Please refresh.</div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default function DailyLog() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Allow access without authentication (free feature)
  // Users can try the feature, but need to sign in to save logs

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <DailyLogErrorBoundary>
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
    </DailyLogErrorBoundary>
  );
}
