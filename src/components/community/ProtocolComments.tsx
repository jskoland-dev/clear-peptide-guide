import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FlagDialog } from "./FlagDialog";

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  is_flagged: boolean;
}

interface ProtocolCommentsProps {
  protocolId: string;
}

export function ProtocolComments({ protocolId }: ProtocolCommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string>("");

  useEffect(() => {
    fetchComments();
  }, [protocolId]);

  const fetchComments = async () => {
    // Exclude user_id from comments for privacy - keep comments anonymous
    const { data, error } = await supabase
      .from("protocol_comments")
      .select("id, comment, created_at, is_flagged")
      .eq("protocol_id", protocolId)
      .eq("is_flagged", false)
      .order("created_at", { ascending: false });

    if (data && !error) {
      setComments(data);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to comment." });
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("protocol_comments").insert({
      user_id: user.id,
      protocol_id: protocolId,
      comment: newComment.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } else {
      setNewComment("");
      fetchComments();
      toast({ title: "Comment posted!" });
    }
    setLoading(false);
  };

  const handleFlagComment = (commentId: string) => {
    setSelectedCommentId(commentId);
    setFlagDialogOpen(true);
  };

  return (
    <div className="space-y-4 border-t pt-4">
      {/* Comment Form */}
      {user && (
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment (anonymous to community)..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            className="flex-1"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={loading || !newComment.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm whitespace-pre-wrap flex-1">{comment.comment}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFlagComment(comment.id)}
                  className="shrink-0"
                >
                  <Flag className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </p>
            </div>
          ))
        )}
      </div>

      <FlagDialog
        open={flagDialogOpen}
        onOpenChange={setFlagDialogOpen}
        commentId={selectedCommentId}
        type="comment"
      />
    </div>
  );
}
