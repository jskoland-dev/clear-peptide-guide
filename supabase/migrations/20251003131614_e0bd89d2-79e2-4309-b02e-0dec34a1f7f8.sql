-- Drop the public access policy on protocols table
DROP POLICY IF EXISTS "Protocols are viewable by everyone" ON public.protocols;

-- Add authentication requirement for viewing protocols
CREATE POLICY "Authenticated users can view protocols" 
ON public.protocols 
FOR SELECT 
TO authenticated
USING (true);

-- This prevents competitors from scraping the protocol database
-- Only logged-in users (free or premium) can access the library