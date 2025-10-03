-- Drop the existing public access policy
DROP POLICY IF EXISTS "Anyone can view protocols" ON public.community_protocols;

-- Create new policy restricting SELECT to authenticated users only
CREATE POLICY "Authenticated users can view protocols" 
ON public.community_protocols 
FOR SELECT 
TO authenticated
USING (true);

-- This prevents public scraping of sensitive health data while still allowing
-- the community to share experiences with each other