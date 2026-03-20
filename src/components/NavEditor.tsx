import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, ChevronRight, Plus } from "lucide-react";
import InlineInput from "./InlineInput";
import SectionEditor from "./SectionEditor";
import type { NavItemWithSections } from "@/types/nav";
import type { useNavEditor } from "@/hooks/useNavEditor";

interface NavEditorProps {
  navItems: NavItemWithSections[];
  editor: ReturnType<typeof useNavEditor>;
}

const NavEditor = ({ navItems, editor }: NavEditorProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-2xl p-6"
      style={{ background: "#F5F0E8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <h2 className="text-lg font-bold mb-4" style={{ color: "#2D1E0E" }}>
        Navigation Editor
      </h2>

      <div className="space-y-1">
        {navItems.map((item, idx) => (
          <div key={item.id} className="rounded-xl overflow-hidden" style={{ background: "#FDF6ED" }}>
            {/* Nav item row */}
            <div className="flex items-center gap-2 px-3 py-2">
              {/* Reorder arrows */}
              <div className="flex flex-col">
                <button
                  disabled={idx === 0}
                  onClick={() => {
                    const prev = navItems[idx - 1];
                    editor.reorderNavItems(item.id, item.sort_order, prev.id, prev.sort_order);
                  }}
                  className="p-0.5 disabled:opacity-20 hover:text-[#FF6B1A] transition-colors"
                  style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: "#7A6B5A" }}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  disabled={idx === navItems.length - 1}
                  onClick={() => {
                    const next = navItems[idx + 1];
                    editor.reorderNavItems(item.id, item.sort_order, next.id, next.sort_order);
                  }}
                  className="p-0.5 disabled:opacity-20 hover:text-[#FF6B1A] transition-colors"
                  style={{ background: "none", border: "none", cursor: idx === navItems.length - 1 ? "default" : "pointer", color: "#7A6B5A" }}
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Label */}
              <InlineInput
                value={item.label}
                onSave={(v) => editor.updateNavItem(item.id, { label: v })}
                className="flex-1 font-semibold"
              />

              {/* URL */}
              <InlineInput
                value={item.url || ""}
                onSave={(v) => editor.updateNavItem(item.id, { url: v || null })}
                placeholder="URL (optional)"
                className="w-48 text-xs"
              />

              {/* CTA toggle */}
              <label className="flex items-center gap-1 text-xs cursor-pointer select-none" style={{ color: "#7A6B5A" }}>
                <input
                  type="checkbox"
                  checked={item.is_cta}
                  onChange={(e) => editor.updateNavItem(item.id, { is_cta: e.target.checked })}
                  className="accent-[#FF6B1A]"
                />
                CTA
              </label>

              {/* Layout toggle */}
              {!item.is_cta && (
                <div className="flex items-center rounded-md overflow-hidden border" style={{ borderColor: 'rgba(255,107,26,0.2)' }}>
                  {(['horizontal', 'vertical'] as const).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => editor.updateNavItem(item.id, { mega_menu_layout: layout })}
                      className="text-[10px] font-semibold px-2 py-0.5 transition-colors"
                      style={{
                        background: item.mega_menu_layout === layout ? '#FF6B1A' : 'transparent',
                        color: item.mega_menu_layout === layout ? '#fff' : '#7A6B5A',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {layout === 'horizontal' ? 'H' : 'V'}
                    </button>
                  ))}
                </div>
              )}

              {/* Expand mega menu */}
              {!item.is_cta && (
                <button
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-1 text-xs font-medium hover:text-[#FF6B1A] transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#7A6B5A" }}
                >
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${expandedItems.has(item.id) ? "rotate-90" : ""}`}
                  />
                  Mega Menu
                </button>
              )}

              {/* Delete */}
              {confirmDelete === item.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      editor.deleteNavItem(item.id);
                      setConfirmDelete(null);
                    }}
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ background: "#FF6B1A", color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", color: "#7A6B5A" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(item.id)}
                  className="p-1 hover:text-red-500 transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#7A6B5A" }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Mega menu sections editor */}
            {!item.is_cta && expandedItems.has(item.id) && (
              <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: "rgba(255,107,26,0.1)" }}>
                <SectionEditor
                  sections={item.sections}
                  navItemId={item.id}
                  editor={editor}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add nav item */}
      <button
        onClick={editor.addNavItem}
        className="mt-3 flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A" }}
      >
        <Plus size={16} /> Add Nav Item
      </button>
    </div>
  );
};

export default NavEditor;
