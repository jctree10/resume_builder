import type { TextBlock } from "../../../types/resume";
import { useResumeStore } from "../../../store/useResumeStore";

export function TextBlockEditor({
  sectionId,
  block,
}: {
  sectionId: string;
  block: TextBlock;
}) {
  const { updateBlock } = useResumeStore();
  return (
    <input
      className="ed-input"
      placeholder="Text content"
      value={block.value}
      onChange={(e) =>
        updateBlock(sectionId, block.id, { value: e.target.value })
      }
    />
  );
}
