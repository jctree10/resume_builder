import type { RichTextBlock } from "../../../types/resume";
import { useResumeStore } from "../../../store/useResumeStore";
import RichTextEditor from "../../RichTextEditor";

export function RichTextBlockEditor({
  sectionId,
  block,
}: {
  sectionId: string;
  block: RichTextBlock;
}) {
  const { updateBlock } = useResumeStore();
  return (
    <RichTextEditor
      value={block.value}
      onChange={(html) => updateBlock(sectionId, block.id, { value: html })}
    />
  );
}
