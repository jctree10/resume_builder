import type { KeyValueBlock } from "../../../types/resume";
import { useResumeStore } from "../../../store/useResumeStore";

export function KeyValueBlockEditor({
  sectionId,
  block,
}: {
  sectionId: string;
  block: KeyValueBlock;
}) {
  const { updateBlock } = useResumeStore();
  return (
    <div className="ed-row">
      <input
        className="ed-input"
        style={{ maxWidth: 180 }}
        placeholder="Label (e.g. Frontend)"
        value={block.label}
        onChange={(e) =>
          updateBlock(sectionId, block.id, {
            label: e.target.value,
          } as Partial<KeyValueBlock>)
        }
      />
      <input
        className="ed-input"
        placeholder="Value (comma separated)"
        value={block.value}
        onChange={(e) =>
          updateBlock(sectionId, block.id, {
            value: e.target.value,
          } as Partial<KeyValueBlock>)
        }
      />
    </div>
  );
}
