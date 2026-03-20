import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { NavItemWithSections } from "@/types/nav";

export interface SavedNav {
  id: string;
  name: string;
  snapshot: NavItemWithSections[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useSavedNavs(refetch: () => void) {
  const [savedNavs, setSavedNavs] = useState<SavedNav[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSavedNavs = useCallback(async () => {
    const { data } = await supabase
      .from("saved_navs")
      .select("*")
      .order("updated_at", { ascending: false });
    setSavedNavs((data as unknown as SavedNav[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSavedNavs();
    const channel = supabase
      .channel("saved-navs-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "saved_navs" }, () => fetchSavedNavs())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchSavedNavs]);

  const saveNav = useCallback(async (name: string, snapshot: NavItemWithSections[]) => {
    await supabase.from("saved_navs").insert({
      name,
      snapshot: JSON.parse(JSON.stringify(snapshot)),
      created_by: user?.id ?? null,
    } as any);
    await fetchSavedNavs();
    toast({ title: "Saved to library", duration: 1500 });
  }, [user, fetchSavedNavs]);

  const deleteNav = useCallback(async (id: string) => {
    await supabase.from("saved_navs").delete().eq("id", id);
    await fetchSavedNavs();
    toast({ title: "Deleted", duration: 1500 });
  }, [fetchSavedNavs]);

  const renameNav = useCallback(async (id: string, name: string) => {
    await supabase.from("saved_navs").update({ name } as any).eq("id", id);
    await fetchSavedNavs();
    toast({ title: "Saved", duration: 1500 });
  }, [fetchSavedNavs]);

  const loadNav = useCallback(async (snapshot: NavItemWithSections[]) => {
    // Delete all existing data in order
    await supabase.from("mega_menu_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("mega_menu_sections").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("nav_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Insert from snapshot with new UUIDs
    for (const item of snapshot) {
      const { data: newItem } = await supabase
        .from("nav_items")
        .insert({
          label: item.label,
          url: item.url,
          sort_order: item.sort_order,
          is_cta: item.is_cta,
          mega_menu_layout: item.mega_menu_layout || 'horizontal',
        })
        .select("id")
        .single();

      if (!newItem) continue;

      for (const section of item.sections) {
        const { data: newSection } = await supabase
          .from("mega_menu_sections")
          .insert({
            nav_item_id: newItem.id,
            title: section.title,
            sort_order: section.sort_order,
          })
          .select("id")
          .single();

        if (!newSection || !section.links?.length) continue;

        await supabase.from("mega_menu_links").insert(
          section.links.map((link) => ({
            section_id: newSection.id,
            label: link.label,
            url: link.url,
            description: link.description,
            sort_order: link.sort_order,
          }))
        );
      }
    }

    refetch();
    toast({ title: "Navigation loaded", duration: 1500 });
  }, [refetch]);

  return { savedNavs, loading, saveNav, deleteNav, renameNav, loadNav };
}
