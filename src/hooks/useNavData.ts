import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NavItem, MegaMenuSection, MegaMenuLink, NavItemWithSections } from "@/types/nav";

export function useNavData() {
  const [navItems, setNavItems] = useState<NavItemWithSections[]>([]);
  const [loading, setLoading] = useState(true);
  const pauseRealtimeRef = useRef(false);

  const fetchNav = useCallback(async () => {
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
  }, []);

  const setPauseRealtime = useCallback((paused: boolean) => {
    pauseRealtimeRef.current = paused;
  }, []);

  useEffect(() => {
    fetchNav();

    const handleChange = () => {
      if (!pauseRealtimeRef.current) {
        fetchNav();
      }
    };

    const channel = supabase
      .channel("nav-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "nav_items" }, handleChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "mega_menu_sections" }, handleChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "mega_menu_links" }, handleChange)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNav]);

  return { navItems, loading, refetch: fetchNav, setPauseRealtime };
}
