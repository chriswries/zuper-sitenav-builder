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

export function useSavedNavs(refetch: () => void, setPauseRealtime: (p: boolean) => void) {
  const [savedNavs, setSavedNavs] = useState<SavedNav[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNavId, setActiveNavId] = useState<string | null>(null);
  const { user } = useAuth();

  const activeNavName = activeNavId
    ? savedNavs.find((n) => n.id === activeNavId)?.name ?? null
    : null;

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
    const { data } = await supabase.from("saved_navs").insert({
      name,
      snapshot: JSON.parse(JSON.stringify(snapshot)),
      created_by: user?.id ?? null,
    } as any).select("id").single();
    const newId = data?.id ?? null;
    if (newId) setActiveNavId(newId);
    await fetchSavedNavs();
    toast({ title: "Saved to library", duration: 1500 });
  }, [user, fetchSavedNavs]);

  const updateNav = useCallback(async (id: string, snapshot: NavItemWithSections[]) => {
    const navName = savedNavs.find((n) => n.id === id)?.name ?? "navigation";
    await supabase.from("saved_navs").update({
      snapshot: JSON.parse(JSON.stringify(snapshot)),
    } as any).eq("id", id);
    await fetchSavedNavs();
    toast({ title: `Updated: ${navName}`, duration: 1500 });
  }, [fetchSavedNavs, savedNavs]);

  const deleteNav = useCallback(async (id: string) => {
    await supabase.from("saved_navs").delete().eq("id", id);
    if (activeNavId === id) setActiveNavId(null);
    await fetchSavedNavs();
    toast({ title: "Deleted", duration: 1500 });
  }, [fetchSavedNavs, activeNavId]);

  const renameNav = useCallback(async (id: string, name: string) => {
    await supabase.from("saved_navs").update({ name } as any).eq("id", id);
    await fetchSavedNavs();
    toast({ title: "Saved", duration: 1500 });
  }, [fetchSavedNavs]);

  const loadNav = useCallback(async (id: string, snapshot: NavItemWithSections[]) => {
    setPauseRealtime(true);
    try {
      await supabase.rpc("load_nav_snapshot", {
        snapshot: JSON.parse(JSON.stringify(snapshot)),
      });
    } finally {
      setPauseRealtime(false);
    }

    await refetch();
    setActiveNavId(id);
    toast({ title: "Navigation loaded", duration: 1500 });
  }, [refetch, setPauseRealtime]);

  return {
    savedNavs, loading, saveNav, updateNav, deleteNav, renameNav, loadNav,
    activeNavId, activeNavName, setActiveNavId,
  };
}
