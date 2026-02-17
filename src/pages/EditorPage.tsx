import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import {
  ExternalLink,
  ChevronDown,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  Eraser,
  GripVertical,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useResumeStore } from "../store/useResumeStore";
import { TEMPLATE_OPTIONS } from "../data/constants";
import type { LinkBlock } from "../types/resume";
import { AddSectionPanel } from "../components/editor/AddSectionPanel";
import { SectionEditor } from "../components/editor/SectionEditor";
import {
  blockToDocx,
  docxDivider,
  docxSectionHeading,
  FONT,
  FONT_SANS,
} from "../utils/docx";

// ... imports

interface DragItemData {
  id: string;
  type: "section" | "block";
  block?: { type: string };
  sectionId?: string;
}

export default function EditorPage() {
  const store = useResumeStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<DragItemData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveItem(event.active.data.current as DragItemData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const activeData = active.data.current;

      if (activeData?.type === "section") {
        const oldIndex = store.sections.findIndex((s) => s.id === active.id);
        const newIndex = store.sections.findIndex((s) => s.id === over.id);
        if (oldIndex >= 0 && newIndex >= 0) {
          store.moveSection(oldIndex, newIndex);
        }
      } else if (activeData?.type === "block") {
        const sectionId = activeData.sectionId;
        const section = store.sections.find((s) => s.id === sectionId);
        if (section) {
          const oldIndex = section.blocks.findIndex((b) => b.id === active.id);
          const newIndex = section.blocks.findIndex((b) => b.id === over.id);
          if (oldIndex >= 0 && newIndex >= 0) {
            store.moveBlock(sectionId, oldIndex, newIndex);
          }
        }
      }
    }
  };
  const [exporting, setExporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sortedSections = [...store.sections].sort((a, b) => a.order - b.order);
  // Only non-fixed sections count for up/down checks
  const movableSections = sortedSections.filter((s) => !s.fixed);

  const openPreview = () => {
    window.open(`/template/${store.selectedTemplate}`, "_blank");
  };

  /* ── DOCX Export ─────────────────────── */
  const downloadDocx = async () => {
    setExporting(true);
    try {
      const children: Paragraph[] = [];
      const sorted = [...store.sections].sort((a, b) => a.order - b.order);

      for (const section of sorted) {
        const blocksSorted = [...section.blocks].sort(
          (a, b) => a.order - b.order,
        );

        if (section.type === "header") {
          // Name
          if (section.title) {
            children.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: section.title.toUpperCase(),
                    font: FONT,
                    size: 48,
                    bold: true,
                    characterSpacing: 40,
                  }),
                ],
              }),
            );
          }
          // Contacts
          const linkBlocks = blocksSorted.filter(
            (b) => b.type === "link",
          ) as LinkBlock[];
          if (linkBlocks.length > 0) {
            children.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: linkBlocks.flatMap((c, i) => {
                  const runs: TextRun[] = [];
                  if (i > 0)
                    runs.push(
                      new TextRun({
                        text: "  ·  ",
                        font: FONT_SANS,
                        size: 18,
                        color: "999999",
                      }),
                    );
                  runs.push(
                    new TextRun({
                      text: c.label,
                      font: FONT_SANS,
                      size: 18,
                      color: "333333",
                    }),
                  );
                  return runs;
                }),
              }),
            );
          }
        } else {
          // Regular section
          children.push(docxDivider(), docxSectionHeading(section.title));
          for (const block of blocksSorted) {
            children.push(...blockToDocx(block));
          }
        }
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: { top: 720, right: 720, bottom: 720, left: 720 },
              },
            },
            children,
          },
        ],
      });

      const headerSection = sorted.find((s) => s.type === "header");
      const fileName = (headerSection?.title || "Resume").replace(/\s+/g, "_");
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${fileName}_Resume.docx`);
    } catch (err) {
      console.error("DOCX export failed:", err);
      alert("Failed to export. Check the console for details.");
    } finally {
      setExporting(false);
    }
  };

  /* ── JSON Export/Import ──────────────── */
  const exportJson = () => {
    const data = useResumeStore.getState();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    saveAs(
      blob,
      `resume-backup-${new Date().toISOString().split("T")[0]}.json`,
    );
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);
        if (data && data.sections) {
          if (
            confirm(
              "This will overwrite your current resume data. Are you sure?",
            )
          ) {
            useResumeStore.setState(data);
          }
        } else {
          alert("Invalid JSON file");
        }
      } catch (err) {
        console.error("Failed to parse JSON", err);
        alert("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
    // Reset input value so same file can be selected again
    event.target.value = "";
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="ed-layout">
        {/* ── Sidebar ───────────────────── */}
        <aside
          className={`ed-sidebar ${sidebarOpen ? "" : "ed-sidebar--collapsed"}`}
        >
          <div className="ed-sidebar-header">
            {sidebarOpen && <h1 className="ed-logo">Resume Builder</h1>}
            <button
              type="button"
              className="ed-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose size={16} />
              ) : (
                <PanelLeftOpen size={16} />
              )}
            </button>
          </div>

          {sidebarOpen && (
            <>
              <nav className="ed-nav">
                {sortedSections.map((s) => (
                  <a
                    key={s.id}
                    href={`#section-${s.id}`}
                    className="ed-nav-link"
                  >
                    {s.type === "header"
                      ? "👤 " + (s.title || "Header")
                      : s.title}
                  </a>
                ))}
              </nav>

              <div className="ed-sidebar-actions">
                <label className="ed-label" style={{ marginBottom: 6 }}>
                  Template
                </label>
                <div
                  className="ed-template-selector"
                  style={{ position: "relative" }}
                >
                  <button
                    type="button"
                    className="ed-input"
                    onClick={() =>
                      store.setTemplateMenuOpen(!store.isTemplateMenuOpen)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {(() => {
                        const t = TEMPLATE_OPTIONS.find(
                          (o) => o.value === store.selectedTemplate,
                        );
                        const Icon = t?.icon || FileText;
                        return (
                          <>
                            <Icon size={14} />
                            {t?.label || "Select Template"}
                          </>
                        );
                      })()}
                    </span>
                    <ChevronDown size={14} style={{ opacity: 0.5 }} />
                  </button>

                  {store.isTemplateMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "4px",
                        marginTop: "4px",
                        zIndex: 100,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {TEMPLATE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = store.selectedTemplate === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              store.setSelectedTemplate(opt.value);
                              store.setTemplateMenuOpen(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px 12px",
                              background: isSelected
                                ? "rgba(255,255,255,0.1)"
                                : "transparent",
                              color: isSelected ? "#fff" : "#ccc",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              fontSize: "0.85rem",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "rgba(255,255,255,0.05)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = isSelected
                                ? "rgba(255,255,255,0.1)"
                                : "transparent")
                            }
                          >
                            <Icon size={14} />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="ed-export-btn"
                  onClick={openPreview}
                >
                  <ExternalLink size={14} />
                  Open Preview
                </button>

                <button
                  type="button"
                  className="ed-export-btn"
                  onClick={downloadDocx}
                  disabled={exporting}
                >
                  <FileText size={14} />
                  {exporting ? "Generating…" : "Download .docx"}
                </button>

                <hr className="ed-sidebar-divider" />

                <label className="ed-label">Data Management</label>

                <button
                  type="button"
                  className="ed-export-btn"
                  onClick={exportJson}
                >
                  <Download size={14} />
                  Export JSON
                </button>

                <button
                  type="button"
                  className="ed-export-btn"
                  onClick={() =>
                    document.getElementById("import-json-input")?.click()
                  }
                >
                  <Upload size={14} />
                  Import JSON
                </button>
                <input
                  type="file"
                  id="import-json-input"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={importJson}
                />

                <hr className="ed-sidebar-divider" />

                <button
                  type="button"
                  className="ed-export-btn"
                  onClick={() => store.loadSampleData()}
                >
                  <Download size={14} />
                  Load Sample Data
                </button>

                <button
                  type="button"
                  className="ed-export-btn ed-export-btn--danger"
                  onClick={() => {
                    if (confirm("Clear all resume data?")) store.clearAllData();
                  }}
                >
                  <Eraser size={14} />
                  Clear All
                </button>
              </div>
            </>
          )}
        </aside>

        {/* ── Main content ─────────────── */}
        <main className="ed-main">
          <SortableContext
            items={sortedSections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                isFirst={section.fixed || movableSections[0]?.id === section.id}
                isLast={
                  section.fixed ||
                  movableSections[movableSections.length - 1]?.id === section.id
                }
              />
            ))}
          </SortableContext>

          <AddSectionPanel />
        </main>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          activeItem?.type === "section" ? (
            <div
              className="ed-section"
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                opacity: 0.9,
              }}
            >
              <div className="ed-section-header">
                <GripVertical
                  size={16}
                  style={{ marginRight: 8, color: "#888" }}
                />
                <span className="ed-section-title">
                  {store.sections.find((s) => s.id === activeId)?.title ||
                    "Section"}
                </span>
                <ChevronDown size={16} />
              </div>
            </div>
          ) : activeItem?.type === "block" ? (
            <div
              className="ed-block"
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                opacity: 0.9,
              }}
            >
              <div className="ed-block-toolbar">
                <span className="ed-block-type-badge">
                  <GripVertical size={12} />
                  {activeItem?.block?.type}
                </span>
              </div>
            </div>
          ) : null
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
