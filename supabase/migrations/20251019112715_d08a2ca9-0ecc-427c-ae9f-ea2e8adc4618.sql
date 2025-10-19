-- Create table for daily prices
CREATE TABLE public.daily_prices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  price numeric(10,2) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_prices ENABLE ROW LEVEL SECURITY;

-- Policies for daily_prices
CREATE POLICY "Anyone can view daily prices"
  ON public.daily_prices
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert daily prices"
  ON public.daily_prices
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update daily prices"
  ON public.daily_prices
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete daily prices"
  ON public.daily_prices
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create table for gallery images
CREATE TABLE public.gallery_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  title text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Policies for gallery_images
CREATE POLICY "Anyone can view gallery images"
  ON public.gallery_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON public.gallery_images
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery images"
  ON public.gallery_images
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery images"
  ON public.gallery_images
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create table for story content
CREATE TABLE public.story_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.story_content ENABLE ROW LEVEL SECURITY;

-- Policies for story_content
CREATE POLICY "Anyone can view story content"
  ON public.story_content
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage story content"
  ON public.story_content
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Create table for contact info
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  whatsapp text,
  instagram text,
  facebook text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Policies for contact_info
CREATE POLICY "Anyone can view contact info"
  ON public.contact_info
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage contact info"
  ON public.contact_info
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_daily_prices_updated_at
  BEFORE UPDATE ON public.daily_prices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_story_content_updated_at
  BEFORE UPDATE ON public.story_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();