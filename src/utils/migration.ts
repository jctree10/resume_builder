import { v4 as uuid } from "uuid";
import type { Block, EntryLink, ResumeData, ResumeSection, SubEntry } from "../types/resume";

interface OldState {
  name?: string;
  summarySubtitle?: string;
  summary?: string;
  contacts?: { id: string; icon: string; label: string; url?: string }[];
  skills?: { id: string; label: string; value: string }[];
  experience?: {
    id: string;
    title: string;
    date: string;
    company: string;
    description?: string;
    subProjects: { id: string; title: string; bullets: string[] }[];
    bullets: string[];
  }[];
  projects?: {
    id: string;
    title: string;
    date: string;
    tech: string;
    bullets: string[];
  }[];
  education?: {
    id: string;
    title: string;
    date: string;
    institution: string;
    bullets: string[];
  }[];
  selectedTemplate?: string;
}

export function isOldSchema(data: unknown): data is OldState {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  // Old schema has `name` or `contacts` at root level, not `sections`
  return ("name" in d || "contacts" in d) && !("sections" in d);
}

export function migrateOldToNew(old: OldState): ResumeData {
  let orderCounter = 0;

  // Header section
  const headerBlocks: Block[] = (old.contacts ?? []).map((c, i) => ({
    id: c.id || uuid(),
    type: "link" as const,
    order: i,
    label: c.label,
    url: c.url ?? "",
    icon: c.icon || "globe",
  }));

  const sections: ResumeSection[] = [
    {
      id: uuid(),
      type: "header",
      title: old.name ?? "",
      order: orderCounter++,
      blocks: headerBlocks,
      fixed: true,
    },
  ];

  // About section
  if (old.summary || old.summarySubtitle) {
    const aboutBlocks: Block[] = [];
    if (old.summary) {
      aboutBlocks.push({
        id: uuid(),
        type: "richtext",
        order: 0,
        value: old.summary,
      });
    }
    sections.push({
      id: uuid(),
      type: "about",
      title: old.summarySubtitle || "About Me",
      order: orderCounter++,
      blocks: aboutBlocks,
    });
  }

  // Skills
  if (old.skills && old.skills.length > 0) {
    sections.push({
      id: uuid(),
      type: "skills",
      title: "Technical Skills",
      order: orderCounter++,
      blocks: old.skills.map((s, i) => ({
        id: s.id || uuid(),
        type: "keyvalue" as const,
        order: i,
        label: s.label,
        value: s.value,
      })),
    });
  }

  // Experience
  if (old.experience && old.experience.length > 0) {
    sections.push({
      id: uuid(),
      type: "experience",
      title: "Professional Experience",
      order: orderCounter++,
      blocks: old.experience.map((e, i) => ({
        id: e.id || uuid(),
        type: "entry" as const,
        order: i,
        title: e.title,
        subtitle: e.company,
        date: e.date,
        description: e.description ?? "",
        bullets: e.bullets.map((b) => ({
          id: uuid(),
          value: b,
          indent: 0,
        })),
        links: [] as EntryLink[],
        subEntries: e.subProjects.map((sp) => ({
          id: sp.id || uuid(),
          title: sp.title,
          bullets: sp.bullets.map((b) => ({
            id: uuid(),
            value: b,
            indent: 0,
          })),
        })),
      })),
    });
  }

  // Projects
  if (old.projects && old.projects.length > 0) {
    sections.push({
      id: uuid(),
      type: "projects",
      title: "Key Projects",
      order: orderCounter++,
      blocks: old.projects.map((p, i) => ({
        id: p.id || uuid(),
        type: "entry" as const,
        order: i,
        title: p.title,
        subtitle: p.tech,
        date: p.date,
        description: "",
        bullets: p.bullets.map((b) => ({
          id: uuid(),
          value: b,
          indent: 0,
        })),
        links: [] as EntryLink[],
        subEntries: [] as SubEntry[],
      })),
    });
  }

  // Education
  if (old.education && old.education.length > 0) {
    sections.push({
      id: uuid(),
      type: "education",
      title: "Education",
      order: orderCounter++,
      blocks: old.education.map((e, i) => ({
        id: e.id || uuid(),
        type: "entry" as const,
        order: i,
        title: e.title,
        subtitle: e.institution,
        date: e.date,
        description: "",
        bullets: e.bullets.map((b) => ({
          id: uuid(),
          value: b,
          indent: 0,
        })),
        links: [] as EntryLink[],
        subEntries: [] as SubEntry[],
      })),
    });
  }

  return {
    sections,
    selectedTemplate: old.selectedTemplate ?? "classic",
  };
}
