-- Fix public exposure of protocol_votes table
-- Restrict SELECT access to authenticated users viewing only their own votes

DROP POLICY IF EXISTS "Anyone can view votes" ON public.protocol_votes;

CREATE POLICY "Users can view their own votes"
ON public.protocol_votes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);