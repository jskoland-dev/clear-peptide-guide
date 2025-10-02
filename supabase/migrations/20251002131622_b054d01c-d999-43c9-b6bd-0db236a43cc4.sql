-- Add cost tracking to vials table
ALTER TABLE public.vials
ADD COLUMN cost numeric DEFAULT 0;