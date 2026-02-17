import React from "react";
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
} from "../types/resume";

/* ── Icon map for link blocks ─────────────────────── */

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

/* ── Block Renderers ──────────────────────────────── */

function renderBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case "text": {
      const b = block as TextBlock;
      return b.value ? (
        <p className="cv-about" key={block.id}>
          {b.value}
        </p>
      ) : null;
    }

    case "richtext": {
      const b = block as RichTextBlock;
      return b.value ? (
        <div
          key={block.id}
          className="cv-about"
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
        <span key={block.id} className="cv-contact-item">
          {showIcon && <Icon size={14} strokeWidth={1.5} />}
          {b.url ? (
            <a
              href={b.url}
              target={b.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={!showIcon ? "cv-link-underline" : undefined}
            >
              {b.label}
            </a>
          ) : (
            b.label
          )}
        </span>
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
        <div key={block.id} className="cv-skill-row">
          <span className="cv-skill-label">{b.label}</span>
          <span className="cv-skill-value">{b.value}</span>
        </div>
      );
    }

    case "entry": {
      const entry = block as EntryBlock;
      return (
        <div key={block.id} className="cv-entry">
          <div className="cv-entry-header">
            <span className="cv-entry-title">{entry.title}</span>
            <span className="cv-entry-date">{entry.date}</span>
          </div>
          {entry.subtitle && (
            <div className="cv-entry-subtitle">{entry.subtitle}</div>
          )}
          {entry.description && (
            <div
              className="cv-entry-desc"
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          )}
          {entry.subEntries.map((se) => (
            <div key={se.id} className="cv-sub-entry">
              <span className="cv-sub-entry-title">{se.title}</span>
              {se.bullets.length > 0 && (
                <ul className="cv-entry-bullets">
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
            <ul className="cv-entry-bullets">
              {entry.bullets.map((b) => (
                <li key={b.id} style={{ marginLeft: b.indent * 16 }}>
                  {b.value}
                </li>
              ))}
            </ul>
          )}
          {entry.links.length > 0 && (
            <div className="cv-entry-links">
              {entry.links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="cv-entry-link"
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
        <div key={block.id} className="cv-dashlist">
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
                <span className="cv-dashlist-sep">{dl.separator}</span>
              )}
            </span>
          ))}
        </div>
      );
    }

    case "separator":
      return <hr key={block.id} className="cv-separator" />;
  }
}

/* ── Section Renderer ─────────────────────────────── */

function renderSection(section: ResumeSection): React.ReactNode {
  const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);

  if (section.type === "header") {
    // Header is rendered separately in the main component
    return null;
  }

  // Check if section has any content
  if (sortedBlocks.length === 0) return null;

  // For bullet-only sections, wrap in a list
  const allBullets = sortedBlocks.every((b) => b.type === "bullet");
  // For keyvalue sections, wrap in skills list
  const allKeyValues = sortedBlocks.every((b) => b.type === "keyvalue");

  return (
    <div key={section.id}>
      <h2 className="cv-section-title">{section.title}</h2>
      {allKeyValues ? (
        <div className="cv-skills-list">
          {sortedBlocks.map((b) => renderBlock(b))}
        </div>
      ) : allBullets ? (
        <ul className="cv-entry-bullets">
          {sortedBlocks.map((b) => renderBlock(b))}
        </ul>
      ) : (
        sortedBlocks.map((b) => renderBlock(b))
      )}
    </div>
  );
}

/* ── Classic Template ─────────────────────────────── */

export default function ClassicTemplate() {
  const { sections } = useResumeStore();
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const headerSection = sortedSections.find((s) => s.type === "header");

  // Subtitle text: stored on the header section
  const subtitleText = headerSection?.subtitle || null;

  return (
    <div className="cv-container" id="resume-content">
      {/* ── Name + Subtitle + Contacts ─── */}
      {headerSection && (
        <>
          {headerSection.title && (
            <h1 className="cv-name">{headerSection.title}</h1>
          )}
          {subtitleText && <p className="cv-subtitle">{subtitleText}</p>}
          {headerSection.blocks.length > 0 && (
            <div className="cv-contact">
              {[...headerSection.blocks]
                .sort((a, b) => a.order - b.order)
                .filter((b) => b.type === "link")
                .map((b) => renderBlock(b))}
            </div>
          )}
        </>
      )}

      {/* ── Body sections ─────────────── */}
      {sortedSections.map((section) => {
        if (section.type === "header") return null;

        // About section: use "Professional Summary" heading, skip subtitle
        if (section.type === "about") {
          const sortedBlocks = [...section.blocks].sort(
            (a, b) => a.order - b.order,
          );
          if (sortedBlocks.length === 0) return null;

          return (
            <div key={section.id}>
              <h2 className="cv-section-title">{section.title}</h2>
              {sortedBlocks.map((b) => renderBlock(b))}
            </div>
          );
        }

        return (
          <React.Fragment key={section.id}>
            {renderSection(section)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
