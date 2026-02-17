import { Plus } from "lucide-react";
import { useState } from "react";
import { SECTION_PRESETS } from "../../data/constants";
import { useResumeStore } from "../../store/useResumeStore";

export function AddSectionPanel() {
  const { addSection } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  if (!isOpen) {
    return (
      <button
        type="button"
        className="ed-add-section-btn-primary"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={18} /> Add New Section
      </button>
    );
  }

  const handleAdd = (type: (typeof SECTION_PRESETS)[0]["type"]) => {
    if (type === "custom") {
      if (!customTitle.trim()) return;
      addSection("custom", customTitle);
      setCustomTitle("");
    } else {
      addSection(type);
    }
    setIsOpen(false);
  };

  return (
    <div className="ed-add-section-panel">
      <div className="ed-panel-header">
        <span className="ed-panel-title">Add Section</span>
        <button
          type="button"
          className="ed-close-btn"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>
      <div className="ed-presets-grid">
        {SECTION_PRESETS.map((preset) => {
          if (preset.type === "custom") return null; // handle separately
          const Icon = preset.icon;
          return (
            <button
              key={preset.type}
              type="button"
              className="ed-preset-btn"
              onClick={() => handleAdd(preset.type)}
            >
              {Icon && <Icon size={16} />}
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
      <div className="ed-custom-row">
        <input
          className="ed-input"
          placeholder="Custom section title..."
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
        />
        <button
          type="button"
          className="ed-btn-primary"
          disabled={!customTitle.trim()}
          onClick={() => handleAdd("custom")}
        >
          Add Custom
        </button>
      </div>
    </div>
  );
}
