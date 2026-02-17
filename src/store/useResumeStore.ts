import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type {
  Block,
  BlockType,
  EntryLink,
  ResumeData,
  ResumeSection,
  SectionType,
  SubEntry,
  EntryBullet,
} from "../types/resume";
import {
  nextOrder,
  reorder,
  moveItem,
} from "../utils/arrayHelpers";
import {
  createBlock,
  defaultBlocksForSection,
  defaultTitle,
} from "../utils/resumeFactories";
import {
  mapSection,
  mapBlock,
  mapEntryBlock,
} from "./helpers";
import {
  createEmptyState,
  createSampleData,
} from "../data/initialState";
import {
  isOldSchema,
  migrateOldToNew,
} from "../utils/migration";

/* ── Re-exports for convenience ───────────────────── */

export type { Block, BlockType, ResumeSection, SectionType } from "../types/resume";
export { SECTION_PRESETS } from "../data/constants";
export type { ContactIcon } from "../types/resume";

/* ── Store Interface ───────────────────────────────── */

export interface ResumeStoreState extends ResumeData {
  // Section actions
  addSection: (type: SectionType, title?: string) => void;
  removeSection: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  updateSectionSubtitle: (sectionId: string, subtitle: string) => void;
  reorderSection: (sectionId: string, direction: -1 | 1) => void;
  moveSection: (oldIndex: number, newIndex: number) => void;

  // Block actions
  addBlock: (sectionId: string, blockType: BlockType) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  updateBlock: (sectionId: string, blockId: string, patch: Partial<Block>) => void;
  reorderBlock: (sectionId: string, blockId: string, direction: -1 | 1) => void;
  moveBlock: (sectionId: string, oldIndex: number, newIndex: number) => void;

  // Entry block sub-actions
  addEntryBullet: (sectionId: string, blockId: string) => void;
  updateEntryBullet: (sectionId: string, blockId: string, bulletId: string, value: string) => void;
  updateEntryBulletIndent: (sectionId: string, blockId: string, bulletId: string, indent: number) => void;
  removeEntryBullet: (sectionId: string, blockId: string, bulletId: string) => void;
  addEntryLink: (sectionId: string, blockId: string) => void;
  updateEntryLink: (sectionId: string, blockId: string, linkId: string, patch: Partial<EntryLink>) => void;
  removeEntryLink: (sectionId: string, blockId: string, linkId: string) => void;

  // Sub-entry actions
  addSubEntry: (sectionId: string, blockId: string) => void;
  updateSubEntry: (sectionId: string, blockId: string, subId: string, patch: Partial<SubEntry>) => void;
  removeSubEntry: (sectionId: string, blockId: string, subId: string) => void;
  addSubEntryBullet: (sectionId: string, blockId: string, subId: string) => void;
  updateSubEntryBullet: (sectionId: string, blockId: string, subId: string, bulletId: string, value: string) => void;
  removeSubEntryBullet: (sectionId: string, blockId: string, subId: string, bulletId: string) => void;

  // Template
  setSelectedTemplate: (t: string) => void;
  isTemplateMenuOpen: boolean;
  setTemplateMenuOpen: (open: boolean) => void;

  // Bulk
  loadSampleData: () => void;
  clearAllData: () => void;
}

/* ── Store ─────────────────────────────────────────── */

export const useResumeStore = create<ResumeStoreState>()(
  persist(
    (set) => ({
      /* ── Initial data ───────────────── */
      ...createEmptyState(),

      /* ── Template ───────────────────── */
      setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
      isTemplateMenuOpen: false,
      setTemplateMenuOpen: (open) => set({ isTemplateMenuOpen: open }),

      /* ── Section actions ────────────── */
      addSection: (type, title) =>
        set((s) => {
          const newSection: ResumeSection = {
            id: uuid(),
            type,
            title: title || defaultTitle(type),
            order: nextOrder(s.sections),
            blocks: defaultBlocksForSection(type).map((bt, i) =>
              createBlock(bt, i),
            ),
          };
          return { sections: [...s.sections, newSection] };
        }),

      removeSection: (sectionId) =>
        set((s) => ({
          sections: s.sections.filter(
            (sec) => sec.id !== sectionId || sec.fixed,
          ),
        })),

      updateSectionTitle: (sectionId, title) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            title,
          })),
        })),

      updateSectionSubtitle: (sectionId, subtitle) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            subtitle,
          })),
        })),

      reorderSection: (sectionId, direction) =>
        set((s) => ({
          sections: reorder(s.sections, sectionId, direction, (sec) => sec.id),
        })),

      moveSection: (oldIndex, newIndex) =>
        set((s) => ({
          sections: moveItem(s.sections, oldIndex, newIndex),
        })),

      /* ── Block actions ──────────────── */
      addBlock: (sectionId, blockType) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: [
              ...sec.blocks,
              createBlock(blockType, nextOrder(sec.blocks)),
            ],
          })),
        })),

      removeBlock: (sectionId, blockId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: sec.blocks.filter((b) => b.id !== blockId),
          })),
        })),

      updateBlock: (sectionId, blockId, patch) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapBlock(sec.blocks, blockId, (b) => ({
              ...b,
              ...(patch as Record<string, unknown>),
            } as Block)),
          })),
        })),

      reorderBlock: (sectionId, blockId, direction) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: reorder(sec.blocks, blockId, direction, (b) => b.id),
          })),
        })),

      moveBlock: (sectionId, oldIndex, newIndex) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: moveItem(sec.blocks, oldIndex, newIndex),
          })),
        })),

      /* ── Entry bullet actions ───────── */
      addEntryBullet: (sectionId, blockId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              bullets: [
                ...b.bullets,
                { id: uuid(), value: "", indent: 0 } as EntryBullet,
              ],
            })),
          })),
        })),

      updateEntryBullet: (sectionId, blockId, bulletId, value) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              bullets: b.bullets.map((bul) =>
                bul.id === bulletId ? { ...bul, value } : bul,
              ),
            })),
          })),
        })),

      updateEntryBulletIndent: (sectionId, blockId, bulletId, indent) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              bullets: b.bullets.map((bul) =>
                bul.id === bulletId ? { ...bul, indent } : bul,
              ),
            })),
          })),
        })),

      removeEntryBullet: (sectionId, blockId, bulletId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              bullets: b.bullets.filter((bul) => bul.id !== bulletId),
            })),
          })),
        })),

      /* ── Entry link actions ─────────── */
      addEntryLink: (sectionId, blockId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              links: [
                ...b.links,
                { id: uuid(), label: "", url: "" } as EntryLink,
              ],
            })),
          })),
        })),

      updateEntryLink: (sectionId, blockId, linkId, patch) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              links: b.links.map((l) =>
                l.id === linkId ? { ...l, ...patch } : l,
              ),
            })),
          })),
        })),

      removeEntryLink: (sectionId, blockId, linkId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              links: b.links.filter((l) => l.id !== linkId),
            })),
          })),
        })),

      /* ── Sub-entry actions ──────────── */
      addSubEntry: (sectionId, blockId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              subEntries: [
                ...b.subEntries,
                { id: uuid(), title: "", bullets: [] } as SubEntry,
              ],
            })),
          })),
        })),

      updateSubEntry: (sectionId, blockId, subId, patch) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              subEntries: b.subEntries.map((se) =>
                se.id === subId ? { ...se, ...patch } : se,
              ),
            })),
          })),
        })),

      removeSubEntry: (sectionId, blockId, subId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              subEntries: b.subEntries.filter((se) => se.id !== subId),
            })),
          })),
        })),

      addSubEntryBullet: (sectionId, blockId, subId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              subEntries: b.subEntries.map((se) =>
                se.id === subId
                  ? {
                      ...se,
                      bullets: [
                        ...se.bullets,
                        { id: uuid(), value: "", indent: 0 } as EntryBullet,
                      ],
                    }
                  : se,
              ),
            })),
          })),
        })),

      updateSubEntryBullet: (sectionId, blockId, subId, bulletId, value) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              subEntries: b.subEntries.map((se) =>
                se.id === subId
                  ? {
                      ...se,
                      bullets: se.bullets.map((bul) =>
                        bul.id === bulletId ? { ...bul, value } : bul,
                      ),
                    }
                  : se,
              ),
            })),
          })),
        })),

      removeSubEntryBullet: (sectionId, blockId, subId, bulletId) =>
        set((s) => ({
          sections: mapSection(s.sections, sectionId, (sec) => ({
            ...sec,
            blocks: mapEntryBlock(sec.blocks, blockId, (b) => ({
              ...b,
              subEntries: b.subEntries.map((se) =>
                se.id === subId
                  ? {
                      ...se,
                      bullets: se.bullets.filter((bul) => bul.id !== bulletId),
                    }
                  : se,
              ),
            })),
          })),
        })),

      /* ── Bulk ───────────────────────── */
      loadSampleData: () => set(createSampleData()),
      clearAllData: () => set(createEmptyState()),
    }),
    {
      name: "resume-builder-storage",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Detect old schema and migrate
        const raw = localStorage.getItem("resume-builder-storage");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const data = parsed?.state ?? parsed;
            if (isOldSchema(data)) {
              const migrated = migrateOldToNew(data);
              useResumeStore.setState(migrated);
            }
          } catch {
            // ignore parse errors
          }
        }
      },
    },
  ),
);

/* ── Cross-tab sync via BroadcastChannel ─────────── */

const CHANNEL_NAME = "resume-sync";
const channel = new BroadcastChannel(CHANNEL_NAME);
let _isSyncing = false;

useResumeStore.subscribe((state) => {
  if (_isSyncing) return;
  const { sections, selectedTemplate } = state;
  channel.postMessage({ sections, selectedTemplate });
});

channel.onmessage = (event) => {
  _isSyncing = true;
  useResumeStore.setState(event.data);
  _isSyncing = false;
};
