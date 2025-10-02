-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'progress-photos',
  'progress-photos',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Create progress_photos table
CREATE TABLE public.progress_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  date_taken TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  weight NUMERIC,
  measurements JSONB,
  notes TEXT,
  peptides_used TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for progress_photos table
CREATE POLICY "Users can view their own photos"
  ON public.progress_photos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos"
  ON public.progress_photos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON public.progress_photos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON public.progress_photos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Storage RLS Policies for progress-photos bucket
CREATE POLICY "Users can view their own progress photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own progress photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own progress photos"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own progress photos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger for updated_at
CREATE TRIGGER update_progress_photos_updated_at
  BEFORE UPDATE ON public.progress_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();