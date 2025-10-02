-- Create enum for goal categories
CREATE TYPE public.protocol_goal AS ENUM (
  'fat_loss',
  'muscle_gain',
  'recovery',
  'anti_aging',
  'cognitive',
  'sleep',
  'skin_health',
  'injury_healing',
  'general_wellness'
);

-- Community protocols table (anonymous submissions)
CREATE TABLE public.community_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal public.protocol_goal NOT NULL,
  peptides_used TEXT[] NOT NULL,
  dosages JSONB NOT NULL, -- {peptide: dose}
  schedule TEXT NOT NULL,
  duration TEXT NOT NULL, -- e.g., "8 weeks", "3 months"
  results TEXT NOT NULL,
  side_effects TEXT,
  notes TEXT,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Protocol votes table (one vote per user per protocol)
CREATE TABLE public.protocol_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES public.community_protocols(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, protocol_id)
);

-- Protocol comments table
CREATE TABLE public.protocol_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES public.community_protocols(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saved protocols table (favorites)
CREATE TABLE public.saved_community_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES public.community_protocols(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, protocol_id)
);

-- Enable RLS
ALTER TABLE public.community_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_community_protocols ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_protocols
CREATE POLICY "Anyone can view protocols"
  ON public.community_protocols FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create protocols"
  ON public.community_protocols FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own protocols"
  ON public.community_protocols FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own protocols"
  ON public.community_protocols FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for protocol_votes
CREATE POLICY "Anyone can view votes"
  ON public.protocol_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.protocol_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.protocol_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.protocol_votes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for protocol_comments
CREATE POLICY "Anyone can view comments"
  ON public.protocol_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.protocol_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.protocol_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.protocol_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for saved_community_protocols
CREATE POLICY "Users can view their saved protocols"
  ON public.saved_community_protocols FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save protocols"
  ON public.saved_community_protocols FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave protocols"
  ON public.saved_community_protocols FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION public.update_protocol_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE public.community_protocols
      SET upvotes = upvotes + 1
      WHERE id = NEW.protocol_id;
    ELSE
      UPDATE public.community_protocols
      SET downvotes = downvotes + 1
      WHERE id = NEW.protocol_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
      UPDATE public.community_protocols
      SET upvotes = upvotes - 1, downvotes = downvotes + 1
      WHERE id = NEW.protocol_id;
    ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
      UPDATE public.community_protocols
      SET upvotes = upvotes + 1, downvotes = downvotes - 1
      WHERE id = NEW.protocol_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE public.community_protocols
      SET upvotes = upvotes - 1
      WHERE id = OLD.protocol_id;
    ELSE
      UPDATE public.community_protocols
      SET downvotes = downvotes - 1
      WHERE id = OLD.protocol_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for vote counts
CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.protocol_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_protocol_vote_count();

-- Trigger for updated_at
CREATE TRIGGER update_community_protocols_updated_at
  BEFORE UPDATE ON public.community_protocols
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_protocol_comments_updated_at
  BEFORE UPDATE ON public.protocol_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_community_protocols_goal ON public.community_protocols(goal);
CREATE INDEX idx_community_protocols_created_at ON public.community_protocols(created_at DESC);
CREATE INDEX idx_community_protocols_upvotes ON public.community_protocols(upvotes DESC);
CREATE INDEX idx_protocol_votes_protocol_id ON public.protocol_votes(protocol_id);
CREATE INDEX idx_protocol_votes_user_protocol ON public.protocol_votes(user_id, protocol_id);
CREATE INDEX idx_protocol_comments_protocol_id ON public.protocol_comments(protocol_id);
CREATE INDEX idx_saved_protocols_user ON public.saved_community_protocols(user_id);