import { v4 as uuid } from "uuid";
import type { Block, BlockType, SectionType } from "../types/resume";

export function createBlock(type: BlockType, extraOrder?: number): Block {
  const base = { id: uuid(), order: extraOrder ?? 0 };
  switch (type) {
    case "text":
      return { ...base, type: "text", value: "" };
    case "richtext":
      return { ...base, type: "richtext", value: "" };
    case "link":
      return { ...base, type: "link", label: "", url: "", icon: "globe" };
    case "bullet":
      return { ...base, type: "bullet", value: "", indent: 0 };
    case "keyvalue":
      return { ...base, type: "keyvalue", label: "", value: "" };
    case "entry":
      return {
        ...base,
        type: "entry",
        title: "",
        subtitle: "",
        date: "",
        description: "",
        bullets: [],
        links: [],
        subEntries: [],
      };
    case "separator":
      return { ...base, type: "separator" };
    case "dashlist":
      return { ...base, type: "dashlist", items: [{ id: uuid(), label: "", url: "" }], separator: " — " };
  }
}

/** Default blocks that a section type starts with */
export function defaultBlocksForSection(type: SectionType): BlockType[] {
  switch (type) {
    case "header":
      return [];
    case "about":
      return ["richtext"];
    case "skills":
      return ["keyvalue"];
    case "experience":
    case "projects":
    case "education":
    case "certifications":
    case "open-source":
      return ["entry"];
    case "languages":
    case "soft-skills":
      return ["bullet"];
    case "custom":
      return [];
    default:
      return [];
  }
}

/** Default title for a section type */
export function defaultTitle(type: SectionType): string {
  const titles: Record<SectionType, string> = {
    header: "Header",
    about: "About Me",
    skills: "Technical Skills",
    experience: "Professional Experience",
    projects: "Projects",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
    "soft-skills": "Soft Skills",
    "open-source": "Open-Source Projects",
    custom: "Custom Section",
  };
  return titles[type] ?? "Section";
}
