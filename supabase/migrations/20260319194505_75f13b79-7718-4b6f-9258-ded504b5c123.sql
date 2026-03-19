
CREATE TABLE public.saved_navs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_saved_navs_updated_at
  BEFORE UPDATE ON public.saved_navs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.saved_navs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select saved_navs" ON public.saved_navs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert saved_navs" ON public.saved_navs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update saved_navs" ON public.saved_navs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete saved_navs" ON public.saved_navs FOR DELETE TO authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_navs;
