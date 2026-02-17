import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

export function CollapsibleSection({
  title,
  id,
  children,
  defaultOpen = true,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: { type: "section", id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
  };

  return (
    <section
      className="ed-section"
      id={`section-${id}`}
      ref={setNodeRef}
      style={style}
    >
      <div
        className="ed-section-header"
        style={{ display: "flex", alignItems: "center" }}
      >
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            marginRight: 8,
            display: "flex",
            alignItems: "center",
            color: "#888",
          }}
        >
          <GripVertical size={16} />
        </span>
        <button
          type="button"
          className="ed-section-toggle"
          onClick={() => setOpen(!open)}
          style={{ flex: 1 }}
        >
          <span className="ed-section-title">{title}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {open && <div className="ed-section-body">{children}</div>}
    </section>
  );
}
