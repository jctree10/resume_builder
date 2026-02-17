import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import type { ResumeSection } from "../../types/resume";
import { useResumeStore } from "../../store/useResumeStore";
import { BLOCK_TYPES } from "../../data/constants";

import { CollapsibleSection } from "./CollapsibleSection";
import { BlockEditor } from "./BlockEditor";

export function SectionEditor({
  section,
  isFirst,
  isLast,
}: {
  section: ResumeSection;
  isFirst: boolean;
  isLast: boolean;
}) {
  const store = useResumeStore();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // If section type is "header", show subtitle field? (From original code logic)
  // Actually, original code checks: if (section.type === "header") ...
  // But let's check what the store helper does.

  const sectionName = section.title || "Untitled Section";

  return (
    <CollapsibleSection title={sectionName} id={section.id}>
      <div className="ed-section-controls">
        <div className="ed-row">
          <input
            className="ed-input ed-section-title-input"
            value={section.title}
            onChange={(e) =>
              store.updateSectionTitle(section.id, e.target.value)
            }
            placeholder="Section Title"
          />
          <div className="ed-actions">
            <button
              type="button"
              className="ed-icon-btn"
              disabled={isFirst}
              onClick={() => store.reorderSection(section.id, -1)}
            >
              <ArrowUp size={16} />
            </button>
            <button
              type="button"
              className="ed-icon-btn"
              disabled={isLast}
              onClick={() => store.reorderSection(section.id, 1)}
            >
              <ArrowDown size={16} />
            </button>
            {!section.fixed && (
              <button
                type="button"
                className="ed-icon-btn ed-danger"
                onClick={() => {
                  if (
                    confirm(
                      `Delete section "${section.title}" and all its content?`,
                    )
                  ) {
                    store.removeSection(section.id);
                  }
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        {section.type === "header" && (
          <div className="ed-row" style={{ marginTop: 8 }}>
            <input
              className="ed-input"
              value={section.subtitle ?? ""}
              onChange={(e) =>
                store.updateSectionSubtitle(section.id, e.target.value)
              }
              placeholder="Subtitle / Role (displayed under name)"
            />
          </div>
        )}
      </div>

      <SortableContext
        items={section.blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="ed-blocks-list">
          {section.blocks.map((block, idx) => (
            <BlockEditor
              key={block.id}
              sectionId={section.id}
              block={block}
              isFirst={idx === 0}
              isLast={idx === section.blocks.length - 1}
            />
          ))}
        </div>
      </SortableContext>

      <div className="ed-add-block-area">
        {!isAddMenuOpen ? (
          <button
            type="button"
            className="ed-add-block-btn"
            onClick={() => setIsAddMenuOpen(true)}
          >
            <Plus size={14} /> Add Block
          </button>
        ) : (
          <div className="ed-add-block-menu">
            <div className="ed-add-block-grid">
              {BLOCK_TYPES.map((bt) => {
                const Icon = bt.icon;
                return (
                  <button
                    key={bt.value}
                    type="button"
                    className="ed-block-type-btn"
                    onClick={() => {
                      store.addBlock(section.id, bt.value);
                      setIsAddMenuOpen(false);
                    }}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{bt.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="ed-close-menu-btn"
              onClick={() => setIsAddMenuOpen(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
