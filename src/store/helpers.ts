import type { Block, EntryBlock, ResumeSection } from "../types/resume";

export function mapSection(
  sections: ResumeSection[],
  sectionId: string,
  fn: (s: ResumeSection) => ResumeSection,
): ResumeSection[] {
  return sections.map((s) => (s.id === sectionId ? fn(s) : s));
}

export function mapBlock(
  blocks: Block[],
  blockId: string,
  fn: (b: Block) => Block,
): Block[] {
  return blocks.map((b) => (b.id === blockId ? fn(b) : b));
}

export function mapEntryBlock(
  blocks: Block[],
  blockId: string,
  fn: (b: EntryBlock) => EntryBlock,
): Block[] {
  return blocks.map((b) =>
    b.id === blockId && b.type === "entry" ? fn(b as EntryBlock) : b,
  );
}
