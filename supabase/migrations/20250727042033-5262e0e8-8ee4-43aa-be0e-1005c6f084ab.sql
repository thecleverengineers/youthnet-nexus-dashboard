-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']);

-- Create storage policies for logo uploads
CREATE POLICY "Anyone can view logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'logos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'logos' AND auth.uid() IS NOT NULL);