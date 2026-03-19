import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import InlineInput from "./InlineInput";
import LinkEditor from "./LinkEditor";
import type { MegaMenuSection, MegaMenuLink } from "@/types/nav";
import type { useNavEditor } from "@/hooks/useNavEditor";

interface SectionEditorProps {
  sections: (MegaMenuSection & { links: MegaMenuLink[] })[];
  navItemId: string;
  editor: ReturnType<typeof useNavEditor>;
}

const SectionEditor = ({ sections, navItemId, editor }: SectionEditorProps) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {sections.map((section, idx) => (
        <div key={section.id} className="rounded-lg p-3" style={{ background: "rgba(255,248,240,0.6)" }}>
          <div className="flex items-center gap-2 mb-2">
            {/* Reorder */}
            <div className="flex flex-col">
              <button
                disabled={idx === 0}
                onClick={() => {
                  const prev = sections[idx - 1];
                  editor.reorderSections(section.id, section.sort_order, prev.id, prev.sort_order);
                }}
                className="p-0.5 disabled:opacity-20 hover:text-[#FF6B1A] transition-colors"
                style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: "#7A6B5A" }}
              >
                <ChevronUp size={12} />
              </button>
              <button
                disabled={idx === sections.length - 1}
                onClick={() => {
                  const next = sections[idx + 1];
                  editor.reorderSections(section.id, section.sort_order, next.id, next.sort_order);
                }}
                className="p-0.5 disabled:opacity-20 hover:text-[#FF6B1A] transition-colors"
                style={{ background: "none", border: "none", cursor: idx === sections.length - 1 ? "default" : "pointer", color: "#7A6B5A" }}
              >
                <ChevronDown size={12} />
              </button>
            </div>

            <InlineInput
              value={section.title}
              onSave={(v) => editor.updateSection(section.id, { title: v })}
              className="flex-1 font-semibold text-xs"
            />

            {confirmDelete === section.id ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { editor.deleteSection(section.id); setConfirmDelete(null); }}
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ background: "#FF6B1A", color: "#fff", border: "none", cursor: "pointer" }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "none", border: "1px solid #ccc", cursor: "pointer", color: "#7A6B5A" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(section.id)}
                className="p-0.5 hover:text-red-500 transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#7A6B5A" }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>

          <LinkEditor links={section.links} sectionId={section.id} editor={editor} />
        </div>
      ))}

      {sections.length === 0 && (
        <p className="text-xs italic py-2" style={{ color: "#7A6B5A" }}>
          No sections yet. Add one to create a mega menu for this nav item.
        </p>
      )}

      <button
        onClick={() => editor.addSection(navItemId)}
        className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition-opacity"
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A" }}
      >
        <Plus size={14} /> Add Section
      </button>
    </div>
  );
};

export default SectionEditor;
