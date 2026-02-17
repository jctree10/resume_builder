import type { BulletBlock } from "../../../types/resume";
import { useResumeStore } from "../../../store/useResumeStore";

export function BulletBlockEditor({
  sectionId,
  block,
}: {
  sectionId: string;
  block: BulletBlock;
}) {
  const { updateBlock } = useResumeStore();
  return (
    <div className="ed-row">
      <span
        className="ed-bullet-marker"
        style={{ paddingLeft: block.indent * 16 }}
      >
        {block.indent > 0 ? "◦" : "•"}
      </span>
      <input
        className="ed-input"
        placeholder="Bullet point"
        value={block.value}
        onChange={(e) =>
          updateBlock(sectionId, block.id, { value: e.target.value })
        }
      />
      <button
        type="button"
        className="ed-icon-btn"
        title={block.indent > 0 ? "Outdent" : "Indent"}
        onClick={() =>
          updateBlock(sectionId, block.id, {
            indent: block.indent > 0 ? 0 : 1,
          } as Partial<BulletBlock>)
        }
      >
        {block.indent > 0 ? "⇤" : "⇥"}
      </button>
    </div>
  );
}
