-- Fix public exposure of community_protocols table
-- Restrict SELECT access to authenticated users only

DROP POLICY IF EXISTS "Authenticated users can view protocols" ON public.community_protocols;

CREATE POLICY "Authenticated users can view protocols"
ON public.community_protocols
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);