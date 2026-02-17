import { useParams } from "react-router-dom";
import ClassicTemplate from "../templates/ClassicTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";

import ClassicDoubleColumnTemplate from "../templates/ClassicDoubleColumnTemplate";

const TEMPLATES: Record<string, React.ComponentType> = {
  classic: ClassicTemplate,
  "classic-double": ClassicDoubleColumnTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
};

export default function TemplatePage() {
  const { templateId } = useParams<{ templateId: string }>();
  const Template = TEMPLATES[templateId ?? "classic"] ?? ClassicTemplate;

  return <Template />;
}
