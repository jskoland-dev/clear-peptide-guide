import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Search, Plus, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { ProtocolCard } from "@/components/community/ProtocolCard";
import { SubmitProtocolDialog } from "@/components/community/SubmitProtocolDialog";

const GOAL_CATEGORIES = [
  { value: "all", label: "All Goals" },
  { value: "fat_loss", label: "Fat Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "recovery", label: "Recovery" },
  { value: "anti_aging", label: "Anti-Aging" },
  { value: "cognitive", label: "Cognitive Enhancement" },
  { value: "sleep", label: "Sleep Improvement" },
  { value: "skin_health", label: "Skin Health" },
  { value: "injury_healing", label: "Injury Healing" },
  { value: "general_wellness", label: "General Wellness" },
];

const SORT_OPTIONS = [
  { value: "trending", label: "Trending", icon: TrendingUp },
  { value: "recent", label: "Most Recent", icon: Clock },
];

interface CommunityProtocol {
  id: string;
  title: string;
  goal: string;
  peptides_used: string[];
  dosages: any;
  schedule: string;
  duration: string;
  results: string;
  side_effects: string | null;
  notes: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  user_id: string;
}

export default function Community() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [protocols, setProtocols] = useState<CommunityProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  // Redirect unauthenticated users to login (protocols now require auth)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProtocols();
    }
  }, [selectedGoal, sortBy, user]);

  const fetchProtocols = async () => {
    setLoading(true);
    let query = supabase
      .from("community_protocols")
      .select("*")
      .eq("is_flagged", false);

    if (selectedGoal !== "all") {
      query = query.eq("goal", selectedGoal as any);
    }

    if (sortBy === "trending") {
      query = query.order("upvotes", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query.limit(50);

    if (data && !error) {
      setProtocols(data);
    }
    setLoading(false);
  };

  const filteredProtocols = protocols.filter(
    (protocol) =>
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.peptides_used.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      protocol.results.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Community Protocols
              </h1>
              <p className="text-muted-foreground mt-2">
                Real experiences from the peptide community
              </p>
            </div>
          </div>
          {user && (
            <Button onClick={() => setIsSubmitDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Share Protocol
            </Button>
          )}
        </div>

        {/* Disclaimer */}
        <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important Disclaimer:</strong> These are user-submitted experiences and should NOT be considered medical advice. 
            Always consult with a qualified healthcare provider before starting any peptide protocol. Individual results may vary.
          </AlertDescription>
        </Alert>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search protocols, peptides, or results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedGoal} onValueChange={setSelectedGoal}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Filter by goal" />
            </SelectTrigger>
            <SelectContent>
              {GOAL_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Protocol Feed */}
        {authLoading || loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading protocols...</div>
        ) : filteredProtocols.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No protocols found. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProtocols.map((protocol) => (
              <ProtocolCard 
                key={protocol.id} 
                protocol={protocol}
                onUpdate={fetchProtocols}
              />
            ))}
          </div>
        )}

        {/* Submit Dialog */}
        <SubmitProtocolDialog
          open={isSubmitDialogOpen}
          onOpenChange={setIsSubmitDialogOpen}
          onSuccess={fetchProtocols}
        />
      </div>
    </div>
  );
}
