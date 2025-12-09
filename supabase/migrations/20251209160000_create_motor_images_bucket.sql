-- Create storage bucket for motor images
INSERT INTO storage.buckets (id, name, public)
VALUES ('motor-images', 'motor-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for motor images bucket
CREATE POLICY "Public Access for motor images"
ON storage.objects FOR SELECT
USING (bucket_id = 'motor-images');

CREATE POLICY "Authenticated users can upload motor images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'motor-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update motor images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'motor-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete motor images"
ON storage.objects FOR DELETE
USING (bucket_id = 'motor-images' AND auth.role() = 'authenticated');
