import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import type { LinkBlock } from "../../../types/resume";
import { useResumeStore } from "../../../store/useResumeStore";
import { CONTACT_ICONS } from "../../../data/constants";

export function LinkBlockEditor({
  sectionId,
  block,
}: {
  sectionId: string;
  block: LinkBlock;
}) {
  const { updateBlock } = useResumeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentIconVal = block.icon || "globe";
  const currentOption = CONTACT_ICONS.find((c) => c.value === currentIconVal);
  const CurrentIcon = currentOption?.icon || Globe;

  return (
    <div className="ed-block-fields">
      <div style={{ position: "relative" }}>
        <button
          type="button"
          className="ed-input ed-input-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CurrentIcon size={14} />
            {currentOption?.label || "Select Icon"}
          </span>
          <ChevronDown size={14} style={{ opacity: 0.5 }} />
        </button>

        {isMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "4px",
              zIndex: 100,
              maxHeight: "200px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {CONTACT_ICONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = currentIconVal === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    updateBlock(sectionId, block.id, {
                      icon: opt.value,
                    } as Partial<LinkBlock>);
                    setIsMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    background: isSelected ? "#f0f0f0" : "transparent",
                    border: "none",
                    borderBottom: "1px solid #f5f5f5",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.82rem",
                    color: "#333",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9f9f9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isSelected
                      ? "#f0f0f0"
                      : "transparent")
                  }
                >
                  {Icon && <Icon size={14} />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <input
        className="ed-input"
        placeholder="Label (displayed text)"
        value={block.label}
        onChange={(e) =>
          updateBlock(sectionId, block.id, {
            label: e.target.value,
          } as Partial<LinkBlock>)
        }
      />
      <input
        className="ed-input"
        placeholder="URL (optional — leave empty for plain text)"
        value={block.url}
        onChange={(e) =>
          updateBlock(sectionId, block.id, {
            url: e.target.value,
          } as Partial<LinkBlock>)
        }
      />
    </div>
  );
}
