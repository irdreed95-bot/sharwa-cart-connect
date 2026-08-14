ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS usage_text text NOT NULL DEFAULT ''::text;