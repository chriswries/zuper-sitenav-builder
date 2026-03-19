import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useNavEditor(refetch: () => void) {
  const showSaved = useCallback(() => {
    toast({ title: "Saved", duration: 1500 });
  }, []);

  // --- Nav Items ---
  const addNavItem = useCallback(async () => {
    const { data: maxRow } = await supabase
      .from("nav_items")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();
    const nextSort = (maxRow?.sort_order ?? 0) + 1;
    await supabase.from("nav_items").insert({ label: "New Item", sort_order: nextSort });
    refetch();
    showSaved();
  }, [refetch, showSaved]);

  const updateNavItem = useCallback(
    async (id: string, updates: { label?: string; url?: string | null; is_cta?: boolean }) => {
      await supabase.from("nav_items").update(updates).eq("id", id);
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const deleteNavItem = useCallback(
    async (id: string) => {
      await supabase.from("nav_items").delete().eq("id", id);
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const reorderNavItems = useCallback(
    async (id1: string, sort1: number, id2: string, sort2: number) => {
      await Promise.all([
        supabase.from("nav_items").update({ sort_order: sort2 }).eq("id", id1),
        supabase.from("nav_items").update({ sort_order: sort1 }).eq("id", id2),
      ]);
      refetch();
    },
    [refetch]
  );

  // --- Sections ---
  const addSection = useCallback(
    async (navItemId: string) => {
      const { data: maxRow } = await supabase
        .from("mega_menu_sections")
        .select("sort_order")
        .eq("nav_item_id", navItemId)
        .order("sort_order", { ascending: false })
        .limit(1)
        .single();
      const nextSort = (maxRow?.sort_order ?? 0) + 1;
      await supabase
        .from("mega_menu_sections")
        .insert({ nav_item_id: navItemId, title: "New Section", sort_order: nextSort });
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const updateSection = useCallback(
    async (id: string, updates: { title?: string }) => {
      await supabase.from("mega_menu_sections").update(updates).eq("id", id);
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const deleteSection = useCallback(
    async (id: string) => {
      await supabase.from("mega_menu_sections").delete().eq("id", id);
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const reorderSections = useCallback(
    async (id1: string, sort1: number, id2: string, sort2: number) => {
      await Promise.all([
        supabase.from("mega_menu_sections").update({ sort_order: sort2 }).eq("id", id1),
        supabase.from("mega_menu_sections").update({ sort_order: sort1 }).eq("id", id2),
      ]);
      refetch();
    },
    [refetch]
  );

  // --- Links ---
  const addLink = useCallback(
    async (sectionId: string) => {
      const { data: maxRow } = await supabase
        .from("mega_menu_links")
        .select("sort_order")
        .eq("section_id", sectionId)
        .order("sort_order", { ascending: false })
        .limit(1)
        .single();
      const nextSort = (maxRow?.sort_order ?? 0) + 1;
      await supabase
        .from("mega_menu_links")
        .insert({ section_id: sectionId, label: "New Link", url: "#", sort_order: nextSort });
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const updateLink = useCallback(
    async (id: string, updates: { label?: string; url?: string; description?: string | null }) => {
      await supabase.from("mega_menu_links").update(updates).eq("id", id);
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const deleteLink = useCallback(
    async (id: string) => {
      await supabase.from("mega_menu_links").delete().eq("id", id);
      refetch();
      showSaved();
    },
    [refetch, showSaved]
  );

  const reorderLinks = useCallback(
    async (id1: string, sort1: number, id2: string, sort2: number) => {
      await Promise.all([
        supabase.from("mega_menu_links").update({ sort_order: sort2 }).eq("id", id1),
        supabase.from("mega_menu_links").update({ sort_order: sort1 }).eq("id", id2),
      ]);
      refetch();
    },
    [refetch]
  );

  return {
    addNavItem,
    updateNavItem,
    deleteNavItem,
    reorderNavItems,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  };
}
