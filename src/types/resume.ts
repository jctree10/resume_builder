/* ══════════════════════════════════════════════════════
   Dynamic Resume Type System
   ══════════════════════════════════════════════════════ */

/* ── Block types (building blocks) ────────────────── */

export type BlockType =
  | "text"
  | "richtext"
  | "link"
  | "bullet"
  | "keyvalue"
  | "entry"
  | "dashlist"
  | "separator";

export interface BlockBase {
  id: string;
  type: BlockType;
  order: number;
}

export type ContactIcon =
  | "mappin"
  | "phone"
  | "mail"
  | "linkedin"
  | "github"
  | "globe";

export interface TextBlock extends BlockBase {
  type: "text";
  value: string;
}

export interface RichTextBlock extends BlockBase {
  type: "richtext";
  value: string;
}

export interface LinkBlock extends BlockBase {
  type: "link";
  label: string;
  url: string;
  icon?: ContactIcon | string; // icon identifier
}

export interface BulletBlock extends BlockBase {
  type: "bullet";
  value: string;
  indent: number; // 0 = top-level, 1 = sub-bullet, etc.
}

export interface KeyValueBlock extends BlockBase {
  type: "keyvalue";
  label: string;
  value: string;
}

export interface EntryBullet {
  id: string;
  value: string;
  indent: number; // 0 = normal, 1 = sub-bullet
}

export interface EntryLink {
  id: string;
  label: string;
  url: string;
}

export interface SubEntry {
  id: string;
  title: string;
  bullets: EntryBullet[];
}

export interface EntryBlock extends BlockBase {
  type: "entry";
  title: string;
  subtitle: string;
  date: string;
  description: string;
  bullets: EntryBullet[];
  links: EntryLink[];
  subEntries: SubEntry[];
}

export interface SeparatorBlock extends BlockBase {
  type: "separator";
}

export interface DashListItem {
  id: string;
  label: string;
  url?: string; // if present, rendered as a link
}

export interface DashListBlock extends BlockBase {
  type: "dashlist";
  items: DashListItem[];
  separator: string; // e.g. " — ", " | ", " · "
}

export type Block =
  | TextBlock
  | RichTextBlock
  | LinkBlock
  | BulletBlock
  | KeyValueBlock
  | EntryBlock
  | DashListBlock
  | SeparatorBlock;

/* ── Section types ────────────────────────────────── */

export type SectionType =
  | "header"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "languages"
  | "soft-skills"
  | "open-source"
  | "custom";

// SECTION_PRESETS moved to src/data/constants.ts

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;  // used by header for the line under the name
  order: number;
  blocks: Block[];
  fixed?: boolean; // true → cannot be reordered or deleted
}

/* ── Top-level state ──────────────────────────────── */

export interface ResumeData {
  sections: ResumeSection[];
  selectedTemplate: string;
}
