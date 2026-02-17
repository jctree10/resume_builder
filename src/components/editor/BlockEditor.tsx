import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type { Block } from "../../types/resume";
import { useResumeStore } from "../../store/useResumeStore";

import { TextBlockEditor } from "./blocks/TextBlockEditor";
import { RichTextBlockEditor } from "./blocks/RichTextBlockEditor";
import { LinkBlockEditor } from "./blocks/LinkBlockEditor";
import { BulletBlockEditor } from "./blocks/BulletBlockEditor";
import { KeyValueBlockEditor } from "./blocks/KeyValueBlockEditor";
import { DashListBlockEditor } from "./blocks/DashListBlockEditor";
import { EntryBlockEditor } from "./blocks/EntryBlockEditor";

export function BlockEditor({
  sectionId,
  block,
  // isFirst, isLast used?
}: {
  sectionId: string;
  block: Block;
  isFirst: boolean;
  isLast: boolean;
}) {
  const store = useResumeStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { type: "block", id: block.id, sectionId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return <TextBlockEditor sectionId={sectionId} block={block} />;
      case "richtext":
        return <RichTextBlockEditor sectionId={sectionId} block={block} />;
      case "link":
        return <LinkBlockEditor sectionId={sectionId} block={block} />;
      case "bullet":
        return <BulletBlockEditor sectionId={sectionId} block={block} />;
      case "keyvalue":
        return <KeyValueBlockEditor sectionId={sectionId} block={block} />;
      case "dashlist":
        return <DashListBlockEditor sectionId={sectionId} block={block} />;
      case "entry":
        return <EntryBlockEditor sectionId={sectionId} block={block} />;
      case "separator":
        return <div className="ed-separator-line" />;
      default:
        return null; // Should not happen
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ed-block-wrapper ${isDragging ? "is-dragging" : ""}`}
    >
      <div className="ed-block-handle" {...attributes} {...listeners}>
        <GripVertical size={14} />
      </div>
      <div className="ed-block-content">{renderBlockContent()}</div>
      <button
        type="button"
        className="ed-block-remove"
        onClick={() => store.removeBlock(sectionId, block.id)}
        title="Remove block"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
