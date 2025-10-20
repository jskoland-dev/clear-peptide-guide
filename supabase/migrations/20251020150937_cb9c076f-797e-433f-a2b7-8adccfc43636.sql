-- Add Row Level Security policies to progress-photos storage bucket
-- This ensures users can only access their own progress photos

-- Policy 1: Users can view their own photos
CREATE POLICY "Users can view their own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'progress-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can upload to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'progress-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users cannot update photos (photos should be immutable)
CREATE POLICY "Users cannot update photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

-- Policy 4: Users can delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'progress-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);