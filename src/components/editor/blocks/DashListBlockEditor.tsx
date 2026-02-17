import { v4 as uuid } from "uuid";
import { Plus, Trash2 } from "lucide-react";
import type { Block, DashListBlock } from "../../../types/resume";
import { useResumeStore } from "../../../store/useResumeStore";

export function DashListBlockEditor({
  sectionId,
  block,
}: {
  sectionId: string;
  block: DashListBlock;
}) {
  const store = useResumeStore();

  const updateItems = (items: DashListBlock["items"]) =>
    store.updateBlock(sectionId, block.id, { items } as Partial<Block>);

  const addItem = () =>
    updateItems([...block.items, { id: uuid(), label: "", url: "" }]);

  const removeItem = (itemId: string) =>
    updateItems(block.items.filter((i) => i.id !== itemId));

  const updateItem = (
    itemId: string,
    patch: Partial<DashListBlock["items"][0]>,
  ) =>
    updateItems(
      block.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
    );

  return (
    <div className="ed-dashlist-editor">
      <div className="ed-field-row">
        <label className="ed-label" htmlFor={`sep-${block.id}`}>
          Separator
        </label>
        <input
          id={`sep-${block.id}`}
          className="ed-input"
          style={{ width: 100 }}
          placeholder=" — "
          value={block.separator}
          onChange={(e) =>
            store.updateBlock(sectionId, block.id, {
              separator: e.target.value,
            } as Partial<Block>)
          }
        />
      </div>

      {block.items.map((item, idx) => (
        <div key={item.id} className="ed-dashlist-item">
          <span className="ed-dashlist-num">{idx + 1}</span>
          <input
            className="ed-input"
            placeholder="Label"
            value={item.label}
            onChange={(e) => updateItem(item.id, { label: e.target.value })}
          />
          <input
            className="ed-input"
            placeholder="URL (optional)"
            value={item.url || ""}
            onChange={(e) => updateItem(item.id, { url: e.target.value })}
          />
          <button
            type="button"
            className="ed-icon-btn"
            title="Remove item"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="ed-add-btn"
        onClick={addItem}
        style={{ marginTop: 4, fontSize: "0.75rem" }}
      >
        <Plus size={12} /> Add item
      </button>

      {/* Preview */}
      <div className="ed-dashlist-preview">
        {block.items
          .filter((i) => i.label)
          .map((item, idx, arr) => (
            <span key={item.id}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                item.label
              )}
              {idx < arr.length - 1 && (
                <span className="ed-dashlist-sep">{block.separator}</span>
              )}
            </span>
          ))}
      </div>
    </div>
  );
}
