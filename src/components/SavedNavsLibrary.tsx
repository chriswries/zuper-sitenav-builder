import { useState } from "react";
import { Save, FolderOpen, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import InlineInput from "./InlineInput";
import type { NavItemWithSections } from "@/types/nav";
import type { SavedNav } from "@/hooks/useSavedNavs";

interface SavedNavsLibraryProps {
  navItems: NavItemWithSections[];
  savedNavs: SavedNav[];
  onSave: (name: string, snapshot: NavItemWithSections[]) => Promise<void>;
  onLoad: (snapshot: NavItemWithSections[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
}

const SavedNavsLibrary = ({
  navItems, savedNavs, onSave, onLoad, onDelete, onRename,
}: SavedNavsLibraryProps) => {
  const [saveOpen, setSaveOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [confirmLoad, setConfirmLoad] = useState<SavedNav | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleOpenSave = () => {
    const d = new Date();
    setSaveName(`Nav — ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    setSaveOpen(true);
  };

  const handleSave = async () => {
    if (!saveName.trim()) return;
    await onSave(saveName.trim().slice(0, 100), navItems);
    setSaveOpen(false);
  };

  const handleLoad = async (nav: SavedNav) => {
    await onLoad(nav.snapshot);
    setConfirmLoad(null);
    setLibraryOpen(false);
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setConfirmDeleteId(null);
  };

  const fmtDate = (s: string) => new Date(s).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleOpenSave}
          className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A" }}
        >
          <Save size={16} /> Save to Library
        </button>
        <button
          onClick={() => setLibraryOpen(true)}
          className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A" }}
        >
          <FolderOpen size={16} /> Open from Library
        </button>
      </div>

      {/* Save dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent style={{ background: "#FDF6ED", maxWidth: 440, border: "none" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#2D1E0E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Save to Library
            </DialogTitle>
            <DialogDescription style={{ color: "#7A6B5A" }}>
              Save the current navigation as a named snapshot.
            </DialogDescription>
          </DialogHeader>
          <input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            maxLength={100}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "#F5F0E8", border: "1px solid rgba(255,107,26,0.15)",
              color: "#2D1E0E", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setSaveOpen(false)}
              className="text-sm px-3 py-1.5 rounded-lg"
              style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", color: "#7A6B5A" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="text-sm px-4 py-1.5 rounded-lg font-semibold disabled:opacity-40"
              style={{ background: "#FF6B1A", color: "#fff", border: "none", cursor: "pointer" }}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Library dialog */}
      <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
        <DialogContent style={{ background: "#FDF6ED", maxWidth: 600, border: "none" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#2D1E0E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Saved Navigations
            </DialogTitle>
            <DialogDescription style={{ color: "#7A6B5A" }}>
              Open a saved navigation to replace the current one.
            </DialogDescription>
          </DialogHeader>

          {savedNavs.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: "#7A6B5A" }}>
              No saved navigations yet.
            </p>
          ) : (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {savedNavs.map((nav) => (
                <div
                  key={nav.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "#F5F0E8" }}
                >
                  {/* Name (inline editable) */}
                  <InlineInput
                    value={nav.name}
                    onSave={(v) => onRename(nav.id, v)}
                    className="flex-1 font-semibold text-sm"
                  />
                  {/* Date */}
                  <span className="text-xs whitespace-nowrap" style={{ color: "#7A6B5A" }}>
                    {fmtDate(nav.updated_at)}
                  </span>

                  {/* Open */}
                  {confirmLoad?.id === nav.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleLoad(nav)}
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{ background: "#FF6B1A", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => setConfirmLoad(null)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", color: "#7A6B5A" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmLoad(nav)}
                      className="text-xs font-semibold px-2 py-1 rounded hover:opacity-80 transition-opacity"
                      style={{ background: "#FF6B1A", color: "#fff", border: "none", cursor: "pointer" }}
                    >
                      Open
                    </button>
                  )}

                  {/* Delete */}
                  {confirmDeleteId === nav.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(nav.id)}
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{ background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", color: "#7A6B5A" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(nav.id)}
                      className="p-1 hover:text-red-500 transition-colors"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#7A6B5A" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavedNavsLibrary;
