-- Fix public exposure of protocol_comments table
-- Restrict SELECT access to authenticated users only

DROP POLICY IF EXISTS "Anyone can view comments" ON public.protocol_comments;

CREATE POLICY "Authenticated users can view comments"
ON public.protocol_comments
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);