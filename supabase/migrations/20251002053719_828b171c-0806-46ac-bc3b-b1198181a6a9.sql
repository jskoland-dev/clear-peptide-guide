-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create vials table
CREATE TABLE public.vials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  peptide_name text NOT NULL,
  total_amount_mg numeric NOT NULL,
  remaining_amount_mg numeric NOT NULL,
  bac_water_ml numeric NOT NULL,
  reconstitution_date timestamptz NOT NULL,
  expiration_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on vials
ALTER TABLE public.vials ENABLE ROW LEVEL SECURITY;

-- Vials policies
CREATE POLICY "Users can view their own vials"
  ON public.vials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vials"
  ON public.vials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vials"
  ON public.vials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vials"
  ON public.vials FOR DELETE
  USING (auth.uid() = user_id);

-- Create injections table
CREATE TABLE public.injections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  vial_id uuid REFERENCES public.vials(id) ON DELETE SET NULL,
  peptide_name text NOT NULL,
  dose_amount numeric NOT NULL,
  dose_unit text NOT NULL DEFAULT 'mg',
  injection_site text NOT NULL,
  injection_date timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on injections
ALTER TABLE public.injections ENABLE ROW LEVEL SECURITY;

-- Injections policies
CREATE POLICY "Users can view their own injections"
  ON public.injections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own injections"
  ON public.injections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own injections"
  ON public.injections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own injections"
  ON public.injections FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_vials_updated_at
  BEFORE UPDATE ON public.vials
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update vial remaining amount after injection
CREATE OR REPLACE FUNCTION public.update_vial_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vial_id IS NOT NULL THEN
    UPDATE public.vials
    SET remaining_amount_mg = remaining_amount_mg - NEW.dose_amount
    WHERE id = NEW.vial_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update vial amount on injection
CREATE TRIGGER on_injection_created
  AFTER INSERT ON public.injections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vial_amount();