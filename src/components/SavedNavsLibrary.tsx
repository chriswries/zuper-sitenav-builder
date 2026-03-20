import { useState } from "react";
import { Save, FolderOpen, Trash2, Download } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import InlineInput from "./InlineInput";
import type { NavItemWithSections } from "@/types/nav";
import type { SavedNav } from "@/hooks/useSavedNavs";

interface SavedNavsLibraryProps {
  navItems: NavItemWithSections[];
  savedNavs: SavedNav[];
  activeNavId: string | null;
  activeNavName: string | null;
  onSave: (name: string, snapshot: NavItemWithSections[]) => Promise<void>;
  onUpdate: (id: string, snapshot: NavItemWithSections[]) => Promise<void>;
  onLoad: (id: string, snapshot: NavItemWithSections[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
  onExport?: () => void;
}

const SavedNavsLibrary = ({
  navItems, savedNavs, activeNavId, activeNavName,
  onSave, onUpdate, onLoad, onDelete, onRename, onExport,
}: SavedNavsLibraryProps) => {
  const [saveOpen, setSaveOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleOpenSave = () => {
    const d = new Date();
    setSaveName(`Nav — ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    setSaveOpen(true);
  };

  const handleSaveNew = async () => {
    if (!saveName.trim()) return;
    await onSave(saveName.trim().slice(0, 100), navItems);
    setSaveOpen(false);
  };

  const handleUpdate = async () => {
    if (!activeNavId) return;
    await onUpdate(activeNavId, navItems);
    setSaveOpen(false);
  };

  const handleLoad = async (nav: SavedNav) => {
    await onLoad(nav.id, nav.snapshot);
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
      {/* Active nav indicator + buttons */}
      <div className="flex items-center gap-3">
        {activeNavName && (
          <span className="text-xs" style={{ color: "#7A6B5A" }}>
            Editing: <strong style={{ color: "#2D1E0E" }}>{activeNavName}</strong>
          </span>
        )}
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
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A" }}
          >
            <Download size={16} /> Export HTML
          </button>
        )}
      </div>

      {/* Save dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent style={{ background: "#FDF6ED", maxWidth: 440, border: "none" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#2D1E0E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Save to Library
            </DialogTitle>
            <DialogDescription style={{ color: "#7A6B5A" }}>
              {activeNavId
                ? "Update the current saved nav or save as a new entry."
                : "Save the current navigation as a named snapshot."}
            </DialogDescription>
          </DialogHeader>

          {/* Update existing option */}
          {activeNavId && activeNavName && (
            <button
              onClick={handleUpdate}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: "rgba(255,107,26,0.08)",
                border: "1px solid rgba(255,107,26,0.2)",
                cursor: "pointer",
                color: "#2D1E0E",
              }}
            >
              Update "{activeNavName}"
            </button>
          )}

          {/* Divider when both options present */}
          {activeNavId && (
            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
              <span className="text-xs" style={{ color: "#7A6B5A" }}>or save as new</span>
              <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
            </div>
          )}

          <input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            maxLength={100}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "#F5F0E8", border: "1px solid rgba(255,107,26,0.15)",
              color: "#2D1E0E", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSaveNew()}
            autoFocus={!activeNavId}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setSaveOpen(false)}
              className="text-sm px-3 py-1.5 rounded-lg"
              style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", color: "#7A6B5A" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNew}
              disabled={!saveName.trim()}
              className="text-sm px-4 py-1.5 rounded-lg font-semibold disabled:opacity-40"
              style={{ background: "#FF6B1A", color: "#fff", border: "none", cursor: "pointer" }}
            >
              Save as New
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
              Click Open to load a saved navigation.
            </DialogDescription>
          </DialogHeader>

          {savedNavs.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: "#7A6B5A" }}>
              No saved navigations yet.
            </p>
          ) : (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {savedNavs.map((nav) => {
                const isActive = nav.id === activeNavId;
                return (
                  <div
                    key={nav.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: isActive ? "rgba(255,107,26,0.08)" : "#F5F0E8",
                      borderLeft: isActive ? "3px solid #FF6B1A" : "3px solid transparent",
                    }}
                  >
                    <InlineInput
                      value={nav.name}
                      onSave={(v) => onRename(nav.id, v)}
                      className="flex-1 font-semibold text-sm"
                    />
                    <span className="text-xs whitespace-nowrap" style={{ color: "#7A6B5A" }}>
                      {fmtDate(nav.updated_at)}
                    </span>

                    {/* Open — immediate, no confirmation */}
                    <button
                      onClick={() => handleLoad(nav)}
                      className="text-xs font-semibold px-2 py-1 rounded hover:opacity-80 transition-opacity"
                      style={{ background: "#FF6B1A", color: "#fff", border: "none", cursor: "pointer" }}
                    >
                      Open
                    </button>

                    {/* Delete with confirmation */}
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
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavedNavsLibrary;
