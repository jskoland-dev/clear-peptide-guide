import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, BookmarkCheck, Flag, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ProtocolComments } from "./ProtocolComments";
import { FlagDialog } from "./FlagDialog";

interface ProtocolCardProps {
  protocol: any;
  onUpdate: () => void;
}

export function ProtocolCard({ protocol, onUpdate }: ProtocolCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserVote();
      checkSavedStatus();
    }
  }, [user, protocol.id]);

  const checkUserVote = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("protocol_votes")
      .select("vote_type")
      .eq("user_id", user.id)
      .eq("protocol_id", protocol.id)
      .maybeSingle();
    
    if (data) setUserVote(data.vote_type);
  };

  const checkSavedStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("saved_community_protocols")
      .select("id")
      .eq("user_id", user.id)
      .eq("protocol_id", protocol.id)
      .maybeSingle();
    
    setIsSaved(!!data);
  };

  const handleVote = async (voteType: "up" | "down") => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to vote on protocols." });
      return;
    }

    if (userVote === voteType) {
      // Remove vote
      await supabase
        .from("protocol_votes")
        .delete()
        .eq("user_id", user.id)
        .eq("protocol_id", protocol.id);
      setUserVote(null);
    } else if (userVote) {
      // Update vote
      await supabase
        .from("protocol_votes")
        .update({ vote_type: voteType })
        .eq("user_id", user.id)
        .eq("protocol_id", protocol.id);
      setUserVote(voteType);
    } else {
      // New vote
      await supabase
        .from("protocol_votes")
        .insert({ user_id: user.id, protocol_id: protocol.id, vote_type: voteType });
      setUserVote(voteType);
    }
    onUpdate();
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save protocols." });
      return;
    }

    if (isSaved) {
      await supabase
        .from("saved_community_protocols")
        .delete()
        .eq("user_id", user.id)
        .eq("protocol_id", protocol.id);
      setIsSaved(false);
      toast({ title: "Removed", description: "Protocol removed from saved." });
    } else {
      await supabase
        .from("saved_community_protocols")
        .insert({ user_id: user.id, protocol_id: protocol.id });
      setIsSaved(true);
      toast({ title: "Saved", description: "Protocol saved to your account." });
    }
  };

  const goalLabels: Record<string, string> = {
    fat_loss: "Fat Loss",
    muscle_gain: "Muscle Gain",
    recovery: "Recovery",
    anti_aging: "Anti-Aging",
    cognitive: "Cognitive",
    sleep: "Sleep",
    skin_health: "Skin Health",
    injury_healing: "Injury Healing",
    general_wellness: "General Wellness",
  };

  const netScore = protocol.upvotes - protocol.downvotes;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{goalLabels[protocol.goal]}</Badge>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(protocol.created_at), { addSuffix: true })}
              </span>
            </div>
            <CardTitle className="text-2xl">{protocol.title}</CardTitle>
            <CardDescription className="mt-2">
              <div className="flex flex-wrap gap-2 mt-2">
                {protocol.peptides_used.map((peptide: string) => (
                  <Badge key={peptide} variant="outline">{peptide}</Badge>
                ))}
              </div>
            </CardDescription>
          </div>

          {/* Vote Buttons */}
          <div className="flex flex-col items-center gap-1">
            <Button
              variant={userVote === "up" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("up")}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className={`font-bold ${netScore > 0 ? "text-green-600" : netScore < 0 ? "text-red-600" : ""}`}>
              {netScore}
            </span>
            <Button
              variant={userVote === "down" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("down")}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold">Duration:</span> {protocol.duration}
          </div>
          <div>
            <span className="font-semibold">Schedule:</span> {protocol.schedule}
          </div>
        </div>

        <Separator />

        {/* Results */}
        <div>
          <h4 className="font-semibold mb-2">Results:</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {expanded ? protocol.results : `${protocol.results.slice(0, 200)}${protocol.results.length > 200 ? "..." : ""}`}
          </p>
          {protocol.results.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="mt-2"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Read More
                </>
              )}
            </Button>
          )}
        </div>

        {/* Dosages */}
        {expanded && (
          <>
            <div>
              <h4 className="font-semibold mb-2">Dosages:</h4>
              <div className="text-sm text-muted-foreground">
                {Object.entries(protocol.dosages).map(([peptide, dose]) => (
                  <div key={peptide}>
                    <strong>{peptide}:</strong> {dose as string}
                  </div>
                ))}
              </div>
            </div>

            {protocol.side_effects && (
              <div>
                <h4 className="font-semibold mb-2">Side Effects:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{protocol.side_effects}</p>
              </div>
            )}

            {protocol.notes && (
              <div>
                <h4 className="font-semibold mb-2">Additional Notes:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{protocol.notes}</p>
              </div>
            )}
          </>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comments
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFlagDialog(true)}
          >
            <Flag className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <ProtocolComments protocolId={protocol.id} />
        )}
      </CardContent>

      <FlagDialog
        open={showFlagDialog}
        onOpenChange={setShowFlagDialog}
        protocolId={protocol.id}
        type="protocol"
      />
    </Card>
  );
}
