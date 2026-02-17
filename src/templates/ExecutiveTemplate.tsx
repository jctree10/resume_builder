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

/* ── Sidebar section types ────────────────────────── */

const SIDEBAR_TYPES = new Set<SectionType>([
  "header",
  "soft-skills",
  "languages",
  "skills",
  "open-source",
]);

/* ── Sidebar block renderers ──────────────────────── */

function renderSidebarBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case "text": {
      const b = block as TextBlock;
      return b.value ? (
        <p key={block.id} className="exec-sidebar-text">
          {b.value}
        </p>
      ) : null;
    }

    case "richtext": {
      const b = block as RichTextBlock;
      return b.value ? (
        <div
          key={block.id}
          className="exec-sidebar-text"
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
        <div key={block.id} className="exec-contact-item">
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
        <li
          key={block.id}
          className="exec-sidebar-bullet"
          style={{ marginLeft: b.indent * 12 }}
        >
          {b.value}
        </li>
      ) : null;
    }

    case "keyvalue": {
      const b = block as KeyValueBlock;
      return (
        <div key={block.id} className="exec-sidebar-kv">
          <span className="exec-sidebar-kv-label">{b.label}:</span>{" "}
          <span className="exec-sidebar-kv-value">{b.value}</span>
        </div>
      );
    }

    case "entry": {
      const entry = block as EntryBlock;
      return (
        <div key={block.id} className="exec-sidebar-entry">
          <div className="exec-sidebar-entry-title">{entry.title}</div>
          {entry.subtitle && (
            <div className="exec-sidebar-entry-sub">{entry.subtitle}</div>
          )}
          {entry.bullets.length > 0 && (
            <ul className="exec-sidebar-bullets">
              {entry.bullets.map((b) => (
                <li key={b.id}>{b.value}</li>
              ))}
            </ul>
          )}
          {entry.links.length > 0 && (
            <div className="exec-sidebar-links">
              {entry.links.map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noreferrer">
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
        <div key={block.id} className="exec-sidebar-text">
          {visibleItems.map((item, idx) => (
            <span key={item.id}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#000", textDecoration: "underline" }}
                >
                  {item.label}
                </a>
              ) : (
                item.label
              )}
              {idx < visibleItems.length - 1 && (
                <span style={{ color: "#888" }}>{dl.separator}</span>
              )}
            </span>
          ))}
        </div>
      );
    }

    case "separator":
      return <hr key={block.id} className="exec-sidebar-sep" />;
  }
}

/* ── Main column block renderers ──────────────────── */

function renderMainBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case "text": {
      const b = block as TextBlock;
      return b.value ? (
        <p key={block.id} className="exec-text">
          {b.value}
        </p>
      ) : null;
    }

    case "richtext": {
      const b = block as RichTextBlock;
      return b.value ? (
        <div
          key={block.id}
          className="exec-text"
          dangerouslySetInnerHTML={{ __html: b.value }}
        />
      ) : null;
    }

    case "link": {
      const b = block as LinkBlock;
      return (
        <a
          key={block.id}
          className="exec-link"
          href={b.url}
          target="_blank"
          rel="noreferrer"
        >
          {b.label}
        </a>
      );
    }

    case "bullet": {
      const b = block as BulletBlock;
      return b.value ? (
        <li
          key={block.id}
          className="exec-bullet"
          style={{ marginLeft: b.indent * 16 }}
        >
          {b.value}
        </li>
      ) : null;
    }

    case "keyvalue": {
      const b = block as KeyValueBlock;
      return (
        <div key={block.id} className="exec-kv">
          <span className="exec-kv-label">{b.label}:</span>{" "}
          <span className="exec-kv-value">{b.value}</span>
        </div>
      );
    }

    case "entry": {
      const entry = block as EntryBlock;
      return (
        <div key={block.id} className="exec-entry">
          <div className="exec-entry-header">
            <span className="exec-entry-title">{entry.title}</span>
            {entry.date && (
              <span className="exec-entry-date">{entry.date}</span>
            )}
          </div>
          {entry.subtitle && (
            <div className="exec-entry-subtitle">{entry.subtitle}</div>
          )}
          {entry.description && (
            <div
              className="exec-text exec-entry-desc"
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          )}
          {entry.subEntries.map((se) => (
            <div key={se.id} className="exec-sub-entry">
              <div className="exec-sub-title">{se.title}</div>
              {se.bullets.length > 0 && (
                <ul className="exec-bullets">
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
            <ul className="exec-bullets">
              {entry.bullets.map((b) => (
                <li key={b.id} style={{ marginLeft: b.indent * 16 }}>
                  {b.value}
                </li>
              ))}
            </ul>
          )}
          {entry.links.length > 0 && (
            <div className="exec-entry-links">
              {entry.links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="exec-entry-link"
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
        <div key={block.id} className="exec-text">
          {visibleItems.map((item, idx) => (
            <span key={item.id}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="exec-entry-link"
                >
                  {item.label}
                </a>
              ) : (
                item.label
              )}
              {idx < visibleItems.length - 1 && (
                <span style={{ color: "#888" }}>{dl.separator}</span>
              )}
            </span>
          ))}
        </div>
      );
    }

    case "separator":
      return <hr key={block.id} className="exec-sep" />;
  }
}

/* ── Section rendering helpers ────────────────────── */

function SidebarSection({ section }: { section: ResumeSection }) {
  const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);

  if (section.type === "header") {
    const linkBlocks = sortedBlocks.filter((b) => b.type === "link");
    return (
      <>
        {linkBlocks.length > 0 && (
          <div className="exec-sidebar-section">
            <h2 className="exec-sidebar-heading">My Contacts</h2>
            <div className="exec-contact-list">
              {linkBlocks.map((b) => renderSidebarBlock(b))}
            </div>
          </div>
        )}
      </>
    );
  }

  if (sortedBlocks.length === 0) return null;

  const allBullets = sortedBlocks.every((b) => b.type === "bullet");

  return (
    <div className="exec-sidebar-section">
      <h2 className="exec-sidebar-heading">{section.title}</h2>
      {allBullets ? (
        <ul className="exec-sidebar-bullets">
          {sortedBlocks.map((b) => renderSidebarBlock(b))}
        </ul>
      ) : (
        sortedBlocks.map((b) => renderSidebarBlock(b))
      )}
    </div>
  );
}

function MainSection({ section }: { section: ResumeSection }) {
  const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);
  if (sortedBlocks.length === 0) return null;

  const allBullets = sortedBlocks.every((b) => b.type === "bullet");

  return (
    <div className="exec-main-section">
      <h2 className="exec-main-heading">{section.title}</h2>
      {allBullets ? (
        <ul className="exec-bullets">
          {sortedBlocks.map((b) => renderMainBlock(b))}
        </ul>
      ) : (
        sortedBlocks.map((b) => renderMainBlock(b))
      )}
    </div>
  );
}

/* ── Executive Template ───────────────────────────── */

export default function ExecutiveTemplate() {
  const { sections } = useResumeStore();
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const headerSection = sortedSections.find((s) => s.type === "header");

  const subtitleText = headerSection?.subtitle || null;

  const sidebarSections = sortedSections.filter(
    (s) => SIDEBAR_TYPES.has(s.type) && s.type !== "header",
  );
  const mainSections = sortedSections.filter(
    (s) => !SIDEBAR_TYPES.has(s.type) && s.type !== "header",
  );

  return (
    <div className="exec-cv">
      {/* ── Sidebar (light) ─────────────── */}
      <aside className="exec-sidebar">
        {/* Name + Role */}
        {headerSection?.title && (
          <div className="exec-name-block">
            <h1 className="exec-name">{headerSection.title}</h1>
            {subtitleText && <p className="exec-role">{subtitleText}</p>}
          </div>
        )}

        {/* Contacts from header */}
        {headerSection && <SidebarSection section={headerSection} />}

        {/* Other sidebar sections */}
        {sidebarSections.map((s) => (
          <SidebarSection key={s.id} section={s} />
        ))}
      </aside>

      {/* ── Main column ─────────────────── */}
      <main className="exec-main">
        {mainSections.map((s) => (
          <MainSection key={s.id} section={s} />
        ))}
      </main>
    </div>
  );
}
