CREATE OR REPLACE FUNCTION public.load_nav_snapshot(snapshot JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item JSONB;
  section JSONB;
  link JSONB;
  new_item_id UUID;
  new_section_id UUID;
BEGIN
  -- Delete all existing nav data (cascade handles children)
  DELETE FROM public.nav_items;

  -- Insert from snapshot
  FOR item IN SELECT * FROM jsonb_array_elements(snapshot)
  LOOP
    INSERT INTO public.nav_items (label, url, sort_order, is_cta, mega_menu_layout)
    VALUES (
      item->>'label',
      item->>'url',
      (item->>'sort_order')::int,
      (item->>'is_cta')::boolean,
      COALESCE(item->>'mega_menu_layout', 'horizontal')
    )
    RETURNING id INTO new_item_id;

    FOR section IN SELECT * FROM jsonb_array_elements(
      COALESCE(item->'sections', '[]'::jsonb)
    )
    LOOP
      INSERT INTO public.mega_menu_sections (nav_item_id, title, sort_order)
      VALUES (new_item_id, section->>'title', (section->>'sort_order')::int)
      RETURNING id INTO new_section_id;

      FOR link IN SELECT * FROM jsonb_array_elements(
        COALESCE(section->'links', '[]'::jsonb)
      )
      LOOP
        INSERT INTO public.mega_menu_links (section_id, label, url, description, sort_order)
        VALUES (
          new_section_id,
          link->>'label',
          link->>'url',
          link->>'description',
          (link->>'sort_order')::int
        );
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$;