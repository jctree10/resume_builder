import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Link2,
} from "lucide-react";
import { useResumeStore } from "../store/useResumeStore";
import type {
  Block,
  LinkBlock,
  KeyValueBlock,
  EntryBlock,
  TextBlock,
  RichTextBlock,
  BulletBlock,
  DashListBlock,
  ResumeSection,
  SectionType,
} from "../types/resume";

/* ── Icon map ─────────────────────────────────────── */

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size: number; strokeWidth: number }>
> = {
  mappin: MapPin,
  phone: Phone,
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  globe: Globe,
  "external-link": ExternalLink,
  link2: Link2,
};

/* ── Sidebar vs Main routing ──────────────────────── */

const SIDEBAR_TYPES = new Set<SectionType>([
  "header",
  "skills",
  "education",
  "languages",
  "soft-skills",
  "certifications",
]);

/* ── Block Renderers (Modern style) ───────────────── */

function renderBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case "text": {
      const b = block as TextBlock;
      return b.value ? (
        <p key={block.id} className="modern-text">
          {b.value}
        </p>
      ) : null;
    }

    case "richtext": {
      const b = block as RichTextBlock;
      return b.value ? (
        <div
          key={block.id}
          className="modern-text"
          dangerouslySetInnerHTML={{ __html: b.value }}
        />
      ) : null;
    }

    case "link": {
      const b = block as LinkBlock;
      const iconKey = b.icon ?? "globe";
      const Icon = ICON_MAP[iconKey];
      const showIcon = iconKey !== "none" && Icon;
      return (
        <div key={block.id} className="modern-contact-item">
          {showIcon && <Icon size={13} strokeWidth={1.5} />}
          {b.url ? (
            <a
              href={b.url}
              target={b.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {b.label}
            </a>
          ) : (
            <span>{b.label}</span>
          )}
        </div>
      );
    }

    case "bullet": {
      const b = block as BulletBlock;
      return b.value ? (
        <li key={block.id} style={{ marginLeft: b.indent * 16 }}>
          {b.value}
        </li>
      ) : null;
    }

    case "keyvalue": {
      const b = block as KeyValueBlock;
      return (
        <div key={block.id} className="modern-skill-group">
          <span className="modern-skill-label">{b.label}</span>
          <span className="modern-skill-value">{b.value}</span>
        </div>
      );
    }

    case "entry": {
      const entry = block as EntryBlock;
      return (
        <div key={block.id} className="modern-entry">
          <div className="modern-entry-header">
            <span className="modern-entry-role">{entry.title}</span>
            <span className="modern-entry-date">{entry.date}</span>
          </div>
          {entry.subtitle && (
            <div className="modern-entry-company">{entry.subtitle}</div>
          )}
          {entry.description && (
            <div
              className="modern-text"
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          )}
          {entry.subEntries.map((se) => (
            <div key={se.id} className="modern-sub-entry">
              <div className="modern-sub-title">{se.title}</div>
              {se.bullets.length > 0 && (
                <ul className="modern-bullets">
                  {se.bullets.map((b) => (
                    <li key={b.id} style={{ marginLeft: b.indent * 16 }}>
                      {b.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {entry.bullets.length > 0 && (
            <ul className="modern-bullets">
              {entry.bullets.map((b) => (
                <li key={b.id} style={{ marginLeft: b.indent * 16 }}>
                  {b.value}
                </li>
              ))}
            </ul>
          )}
          {entry.links.length > 0 && (
            <div className="modern-entry-links">
              {entry.links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="modern-entry-link"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }

    case "dashlist": {
      const dl = block as DashListBlock;
      const visibleItems = dl.items.filter((i) => i.label);
      return (
        <div key={block.id} className="modern-dashlist">
          {visibleItems.map((item, idx) => (
            <span key={item.id}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                item.label
              )}
              {idx < visibleItems.length - 1 && (
                <span className="modern-dashlist-sep">{dl.separator}</span>
              )}
            </span>
          ))}
        </div>
      );
    }

    case "separator":
      return <hr key={block.id} className="modern-separator" />;
  }
}

/* ── Section Renderers ────────────────────────────── */

function renderSidebarSection(section: ResumeSection): React.ReactNode {
  const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);

  if (section.type === "header") {
    const linkBlocks = sortedBlocks.filter((b) => b.type === "link");
    return (
      <div key={section.id}>
        {section.title && <h1 className="modern-name">{section.title}</h1>}
        {linkBlocks.length > 0 && (
          <div className="modern-section">
            <h2 className="modern-section-title">Contact</h2>
            <div className="modern-contact-list">
              {linkBlocks.map((b) => renderBlock(b))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (sortedBlocks.length === 0) return null;

  // Education entries get special sidebar styling
  if (section.type === "education") {
    const entries = sortedBlocks.filter(
      (b) => b.type === "entry",
    ) as EntryBlock[];
    const otherBlocks = sortedBlocks.filter((b) => b.type !== "entry");

    return (
      <div key={section.id} className="modern-section">
        <h2 className="modern-section-title">{section.title}</h2>
        {entries.map((edu) => (
          <div key={edu.id} className="modern-edu-entry">
            <div className="modern-edu-title">{edu.title}</div>
            <div className="modern-edu-inst">{edu.subtitle}</div>
            <div className="modern-edu-date">{edu.date}</div>
            {edu.bullets.map((b) => (
              <div key={b.id} className="modern-edu-detail">
                {b.value}
              </div>
            ))}
          </div>
        ))}
        {otherBlocks.map((b) => renderBlock(b))}
      </div>
    );
  }

  // Default sidebar section
  const allBullets = sortedBlocks.every((b) => b.type === "bullet");

  return (
    <div key={section.id} className="modern-section">
      <h2 className="modern-section-title">{section.title}</h2>
      {allBullets ? (
        <ul className="modern-bullets">
          {sortedBlocks.map((b) => renderBlock(b))}
        </ul>
      ) : (
        sortedBlocks.map((b) => renderBlock(b))
      )}
    </div>
  );
}

function renderMainSection(section: ResumeSection): React.ReactNode {
  const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);
  if (sortedBlocks.length === 0) return null;

  const allBullets = sortedBlocks.every((b) => b.type === "bullet");

  return (
    <div key={section.id} className="modern-main-section">
      <h2 className="modern-main-title">{section.title}</h2>
      {allBullets ? (
        <ul className="modern-bullets">
          {sortedBlocks.map((b) => renderBlock(b))}
        </ul>
      ) : (
        sortedBlocks.map((b) => renderBlock(b))
      )}
    </div>
  );
}

/* ── Modern Template ──────────────────────────────── */

export default function ModernTemplate() {
  const { sections } = useResumeStore();
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Find the about section for the subtitle in header
  const aboutSection = sortedSections.find((s) => s.type === "about");
  const headerSection = sortedSections.find((s) => s.type === "header");

  // Split into sidebar and main
  const sidebarSections = sortedSections.filter((s) =>
    SIDEBAR_TYPES.has(s.type),
  );
  const mainSections = sortedSections.filter((s) => !SIDEBAR_TYPES.has(s.type));

  return (
    <div className="modern-cv">
      {/* ── Sidebar ─────────────────────── */}
      <aside className="modern-sidebar">
        {/* Render header first, then about subtitle, then other sidebar sections */}
        {headerSection && (
          <>
            {headerSection.title && (
              <h1 className="modern-name">{headerSection.title}</h1>
            )}
            {aboutSection?.title && aboutSection.title !== "About Me" && (
              <p className="modern-subtitle">{aboutSection.title}</p>
            )}
          </>
        )}

        {/* Contact from header blocks */}
        {headerSection && headerSection.blocks.length > 0 && (
          <div className="modern-section">
            <h2 className="modern-section-title">Contact</h2>
            <div className="modern-contact-list">
              {[...headerSection.blocks]
                .sort((a, b) => a.order - b.order)
                .filter((b) => b.type === "link")
                .map((b) => renderBlock(b))}
            </div>
          </div>
        )}

        {/* Other sidebar sections (skip header since we rendered it) */}
        {sidebarSections
          .filter((s) => s.type !== "header")
          .map((s) => renderSidebarSection(s))}
      </aside>

      {/* ── Main Column ────────────────── */}
      <main className="modern-main">
        {mainSections.map((s) => renderMainSection(s))}
      </main>
    </div>
  );
}
