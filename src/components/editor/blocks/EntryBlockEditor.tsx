import { Plus, Trash2 } from "lucide-react";
import type { EntryBlock } from "../../../types/resume";
import { useResumeStore } from "../../../store/useResumeStore";
import RichTextEditor from "../../RichTextEditor";

export function EntryBlockEditor({
  sectionId,
  block,
}: {
  sectionId: string;
  block: EntryBlock;
}) {
  const store = useResumeStore();

  return (
    <div className="ed-card ed-card-lg">
      {/* Title + Date */}
      <div className="ed-row">
        <input
          className="ed-input"
          placeholder="Title"
          value={block.title}
          onChange={(e) =>
            store.updateBlock(sectionId, block.id, {
              title: e.target.value,
            } as Partial<EntryBlock>)
          }
        />
      </div>
      <div className="ed-row">
        <input
          className="ed-input"
          placeholder="Subtitle (company, institution, tech…)"
          value={block.subtitle}
          onChange={(e) =>
            store.updateBlock(sectionId, block.id, {
              subtitle: e.target.value,
            } as Partial<EntryBlock>)
          }
        />
        <input
          className="ed-input ed-input-sm"
          placeholder="Date range"
          value={block.date}
          onChange={(e) =>
            store.updateBlock(sectionId, block.id, {
              date: e.target.value,
            } as Partial<EntryBlock>)
          }
        />
      </div>

      {/* Description */}
      <label className="ed-label">Description</label>
      <RichTextEditor
        value={block.description}
        onChange={(html) =>
          store.updateBlock(sectionId, block.id, {
            description: html,
          } as Partial<EntryBlock>)
        }
      />

      {/* Sub-Entries */}
      <div className="ed-sub-section">
        <span className="ed-label">Sub-Entries</span>
        {block.subEntries.map((se) => (
          <div key={se.id} className="ed-card ed-card-nested">
            <div className="ed-row">
              <input
                className="ed-input"
                placeholder="Sub-entry title"
                value={se.title}
                onChange={(e) =>
                  store.updateSubEntry(sectionId, block.id, se.id, {
                    title: e.target.value,
                  })
                }
              />
              <button
                type="button"
                className="ed-icon-btn ed-danger"
                onClick={() => store.removeSubEntry(sectionId, block.id, se.id)}
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
            {se.bullets.map((bul) => (
              <div key={bul.id} className="ed-row">
                <input
                  className="ed-input"
                  placeholder="Bullet point"
                  value={bul.value}
                  onChange={(e) =>
                    store.updateSubEntryBullet(
                      sectionId,
                      block.id,
                      se.id,
                      bul.id,
                      e.target.value,
                    )
                  }
                />
                <button
                  type="button"
                  className="ed-icon-btn ed-danger"
                  onClick={() =>
                    store.removeSubEntryBullet(
                      sectionId,
                      block.id,
                      se.id,
                      bul.id,
                    )
                  }
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ed-btn ed-btn-add ed-btn-sm"
              onClick={() =>
                store.addSubEntryBullet(sectionId, block.id, se.id)
              }
            >
              <Plus size={12} /> Bullet
            </button>
          </div>
        ))}
        <button
          type="button"
          className="ed-btn ed-btn-add ed-btn-sm"
          onClick={() => store.addSubEntry(sectionId, block.id)}
        >
          <Plus size={12} /> Sub-Entry
        </button>
      </div>
      {/* Main Entry Bullets */}
      <div className="ed-sub-section">
        <span className="ed-label">Bullets</span>
        {block.bullets.map((bul) => (
          <div key={bul.id} className="ed-row">
            <input
              className="ed-input"
              placeholder="Start typing..."
              value={bul.value}
              onChange={(e) =>
                store.updateEntryBullet(
                  sectionId,
                  block.id,
                  bul.id,
                  e.target.value,
                )
              }
            />
            <button
              type="button"
              className="ed-icon-btn"
              title={bul.indent > 0 ? "Outdent" : "Indent"}
              onClick={() =>
                store.updateEntryBulletIndent(
                  sectionId,
                  block.id,
                  bul.id,
                  bul.indent > 0 ? 0 : 1,
                )
              }
            >
              {bul.indent > 0 ? "⇤" : "⇥"}
            </button>
            <button
              type="button"
              className="ed-icon-btn ed-danger"
              onClick={() =>
                store.removeEntryBullet(sectionId, block.id, bul.id)
              }
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="ed-btn ed-btn-add ed-btn-sm"
          onClick={() => store.addEntryBullet(sectionId, block.id)}
        >
          <Plus size={12} /> Bullet
        </button>
      </div>

      {/* Links */}
      <div className="ed-sub-section">
        <span className="ed-label">Links (optional)</span>
        {block.links.map((link) => (
          <div key={link.id} className="ed-row">
            <input
              className="ed-input"
              placeholder="Label"
              value={link.label}
              onChange={(e) =>
                store.updateEntryLink(sectionId, block.id, link.id, {
                  label: e.target.value,
                })
              }
            />
            <input
              className="ed-input"
              placeholder="URL"
              value={link.url}
              onChange={(e) =>
                store.updateEntryLink(sectionId, block.id, link.id, {
                  url: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="ed-icon-btn ed-danger"
              onClick={() =>
                store.removeEntryLink(sectionId, block.id, link.id)
              }
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="ed-btn ed-btn-add ed-btn-sm"
          onClick={() => store.addEntryLink(sectionId, block.id)}
        >
          <Plus size={12} /> Link
        </button>
      </div>
    </div>
  );
}
