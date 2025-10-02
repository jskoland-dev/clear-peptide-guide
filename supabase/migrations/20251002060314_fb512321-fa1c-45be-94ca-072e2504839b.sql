-- Add status column to vials table for tracking active/finished/disposed vials
ALTER TABLE public.vials 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' 
CHECK (status IN ('active', 'finished', 'disposed', 'expired'));

-- Add an index for better query performance on status
CREATE INDEX IF NOT EXISTS idx_vials_status ON public.vials(status);

-- Add an index for expiration date queries
CREATE INDEX IF NOT EXISTS idx_vials_expiration ON public.vials(expiration_date);

-- Create a function to automatically update vial status to expired when expiration date passes
CREATE OR REPLACE FUNCTION public.check_vial_expiration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.expiration_date IS NOT NULL AND NEW.expiration_date < CURRENT_DATE AND NEW.status = 'active' THEN
    NEW.status = 'expired';
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to check expiration on insert and update
DROP TRIGGER IF EXISTS check_vial_expiration_trigger ON public.vials;
CREATE TRIGGER check_vial_expiration_trigger
  BEFORE INSERT OR UPDATE ON public.vials
  FOR EACH ROW
  EXECUTE FUNCTION public.check_vial_expiration();