import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, BookMarked } from "lucide-react";
import { ProtocolCard } from "@/components/protocols/ProtocolCard";

interface Protocol {
  id: string;
  peptide_name: string;
  category: string;
  recommended_dose: string;
  frequency: string;
  cycle_length: string;
  expected_results: string[];
  common_stacks: string[];
  warnings: string[];
  description: string;
  benefits: string[];
}

interface SavedProtocol {
  protocol_id: string;
}

const CATEGORIES = ["All", "Injury Recovery", "Tissue Repair", "Growth Hormone", "Muscle Growth", "Weight Loss", "Fat Loss", "Longevity", "Anti-Aging", "Cognitive Enhancement", "Sexual Health", "Immune Support", "Tanning & Sexual Health"];

export default function Protocols() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [savedProtocols, setSavedProtocols] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProtocols();
      fetchSavedProtocols();
    }
  }, [user]);

  const fetchProtocols = async () => {
    const { data, error } = await supabase
      .from("protocols")
      .select("*")
      .order("peptide_name");

    if (data && !error) {
      setProtocols(data);
    }
  };

  const fetchSavedProtocols = async () => {
    const { data, error } = await supabase
      .from("user_saved_protocols")
      .select("protocol_id");

    if (data && !error) {
      setSavedProtocols(new Set(data.map((sp: SavedProtocol) => sp.protocol_id)));
    }
  };

  const handleSaveToggle = async (protocolId: string) => {
    const isSaved = savedProtocols.has(protocolId);

    if (isSaved) {
      await supabase
        .from("user_saved_protocols")
        .delete()
        .eq("protocol_id", protocolId)
        .eq("user_id", user?.id);
    } else {
      await supabase.from("user_saved_protocols").insert({
        user_id: user?.id,
        protocol_id: protocolId,
      });
    }

    fetchSavedProtocols();
  };

  const filteredProtocols = protocols.filter((protocol) => {
    const matchesSearch =
      protocol.peptide_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || protocol.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const savedProtocolsList = protocols.filter((p) => savedProtocols.has(p.id));

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Protocol Library
              </h1>
              <p className="text-muted-foreground mt-2">Pre-built dosing schedules from experts</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">All Protocols</TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              Saved ({savedProtocolsList.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Protocols Grid */}
            {filteredProtocols.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No protocols found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProtocols.map((protocol) => (
                  <ProtocolCard
                    key={protocol.id}
                    protocol={protocol}
                    isSaved={savedProtocols.has(protocol.id)}
                    onSaveToggle={() => handleSaveToggle(protocol.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedProtocolsList.length === 0 ? (
              <div className="text-center py-12">
                <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You haven't saved any protocols yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Browse the "All Protocols" tab to save your favorites.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProtocolsList.map((protocol) => (
                  <ProtocolCard
                    key={protocol.id}
                    protocol={protocol}
                    isSaved={true}
                    onSaveToggle={() => handleSaveToggle(protocol.id)}
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
