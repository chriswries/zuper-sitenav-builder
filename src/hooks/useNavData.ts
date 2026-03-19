import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NavItem, MegaMenuSection, MegaMenuLink, NavItemWithSections } from "@/types/nav";

export function useNavData() {
  const [navItems, setNavItems] = useState<NavItemWithSections[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNav() {
      const [itemsRes, sectionsRes, linksRes] = await Promise.all([
        supabase.from("nav_items").select("*").order("sort_order"),
        supabase.from("mega_menu_sections").select("*").order("sort_order"),
        supabase.from("mega_menu_links").select("*").order("sort_order"),
      ]);

      const items = (itemsRes.data ?? []) as NavItem[];
      const sections = (sectionsRes.data ?? []) as MegaMenuSection[];
      const links = (linksRes.data ?? []) as MegaMenuLink[];

      const combined: NavItemWithSections[] = items.map((item) => {
        const itemSections = sections
          .filter((s) => s.nav_item_id === item.id)
          .map((section) => ({
            ...section,
            links: links.filter((l) => l.section_id === section.id),
          }));
        return { ...item, sections: itemSections };
      });

      setNavItems(combined);
      setLoading(false);
    }

    fetchNav();
  }, []);

  return { navItems, loading };
}
