CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric(12,2) NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "admins insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "admins upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.products (name, category, price, description, image_url) VALUES
('عطر عود ملكي فاخر', 'عطور', 45000, 'عطر شرقي فاخر بثبات عالي يدوم طوال اليوم.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80'),
('عطر مسك أبيض', 'عطور', 32000, 'رائحة نظيفة وناعمة مناسبة للاستخدام اليومي.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80'),
('ساعة رجالية كلاسيك', 'ساعات', 75000, 'ساعة أنيقة بسوار جلد طبيعي ومقاومة للماء.', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'),
('ساعة نسائية ذهبية', 'ساعات', 68000, 'تصميم أنثوي راقٍ بلمسة ذهبية.', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80'),
('سماعات لاسلكية', 'اجهزة الكترونية', 55000, 'صوت نقي وعزل ضوضاء مع بطارية تدوم طويلاً.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
('شاحن سريع 65 واط', 'اجهزة الكترونية', 25000, 'شحن سريع لجميع الأجهزة بمنفذين.', 'https://images.unsplash.com/photo-1591290619762-b0b1c0b5b7ba?w=800&q=80'),
('طقم عناية بالبشرة', 'عناية بالبشرة', 38000, 'روتين متكامل لترطيب ونضارة البشرة.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'),
('سيروم فيتامين سي', 'عناية بالبشرة', 22000, 'يوحّد لون البشرة ويمنحها إشراقة طبيعية.', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80'),
('سوار جلدي أنيق', 'إكسسوارات', 15000, 'إكسسوار عملي يناسب جميع الإطلالات.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'),
('نظارة شمسية عصرية', 'إكسسوارات', 28000, 'حماية من الأشعة بتصميم أنيق.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'),
('طقم هدايا رجالي', 'هدايا رجالية', 60000, 'محفظة وحزام وقلم في علبة فاخرة.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'),
('صندوق هدايا نسائي', 'هدايا نسائية', 52000, 'مجموعة مختارة بعناية لإهداء مميز.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80'),
('منظم مطبخ متعدد', 'مواد منزلية', 18000, 'ينظم أدوات المطبخ ويوفر المساحة.', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80'),
('طقم أكواب زجاجية', 'مواد منزلية', 20000, 'ستة أكواب بتصميم عصري.', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80'),
('حامل هاتف للسيارة', 'كماليات السيارات', 12000, 'تثبيت قوي ودوران 360 درجة.', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80'),
('معطر سيارة فاخر', 'كماليات السيارات', 9000, 'رائحة منعشة تدوم لأسابيع.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80');