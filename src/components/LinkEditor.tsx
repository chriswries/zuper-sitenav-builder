import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import InlineInput from "./InlineInput";
import type { MegaMenuLink } from "@/types/nav";
import type { useNavEditor } from "@/hooks/useNavEditor";

interface LinkEditorProps {
  links: MegaMenuLink[];
  sectionId: string;
  editor: ReturnType<typeof useNavEditor>;
}

const LinkEditor = ({ links, sectionId, editor }: LinkEditorProps) => {
  return (
    <div className="space-y-1 ml-6">
      {links.map((link, idx) => (
        <div key={link.id} className="flex items-center gap-1">
          <div className="flex flex-col">
            <button
              disabled={idx === 0}
              onClick={() => {
                const prev = links[idx - 1];
                editor.reorderLinks(link.id, link.sort_order, prev.id, prev.sort_order);
              }}
              className="p-0.5 disabled:opacity-20 hover:text-[#FF6B1A] transition-colors"
              style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: "#7A6B5A" }}
            >
              <ChevronUp size={10} />
            </button>
            <button
              disabled={idx === links.length - 1}
              onClick={() => {
                const next = links[idx + 1];
                editor.reorderLinks(link.id, link.sort_order, next.id, next.sort_order);
              }}
              className="p-0.5 disabled:opacity-20 hover:text-[#FF6B1A] transition-colors"
              style={{ background: "none", border: "none", cursor: idx === links.length - 1 ? "default" : "pointer", color: "#7A6B5A" }}
            >
              <ChevronDown size={10} />
            </button>
          </div>

          <InlineInput
            value={link.label}
            onSave={(v) => editor.updateLink(link.id, { label: v })}
            className="w-32 text-xs"
          />
          <InlineInput
            value={link.url}
            onSave={(v) => editor.updateLink(link.id, { url: v })}
            placeholder="URL"
            className="w-40 text-xs"
          />
          <InlineInput
            value={link.description || ""}
            onSave={(v) => editor.updateLink(link.id, { description: v || null })}
            placeholder="Description (optional)"
            className="w-40 text-xs"
          />

          <button
            onClick={() => editor.deleteLink(link.id)}
            className="p-0.5 hover:text-red-500 transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#7A6B5A" }}
          >
            <Trash2 size={10} />
          </button>
        </div>
      ))}

      <button
        onClick={() => editor.addLink(sectionId)}
        className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B1A" }}
      >
        <Plus size={12} /> Add Link
      </button>
    </div>
  );
};

export default LinkEditor;
