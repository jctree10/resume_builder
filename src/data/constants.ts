import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Link2,
  FileText,
  AlignLeft,
  Link,
  List,
  Columns,
  TableProperties,
  Database,
  Minus,
  User,
  Cpu,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Languages,
  MessageCircle,
  Code2,
  PlusCircle,
} from "lucide-react";
import type { BlockType, SectionType } from "../types/resume";

export const CONTACT_ICONS: {
  value: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { value: "mappin", label: "Address", icon: MapPin },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "mail", label: "Email", icon: Mail },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "github", label: "GitHub", icon: Github },
  { value: "globe", label: "Website", icon: Globe },
  { value: "external-link", label: "External Link", icon: ExternalLink },
  { value: "link2", label: "Link (chain)", icon: Link2 },
  { value: "none", label: "No icon (text only)", icon: Minus },
];

export const BLOCK_TYPES: {
  value: BlockType;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { value: "text", label: "Text", icon: AlignLeft },
  { value: "richtext", label: "Rich Text", icon: FileText },
  { value: "link", label: "Link", icon: Link },
  { value: "bullet", label: "Bullet Point", icon: List },
  { value: "keyvalue", label: "Key-Value", icon: Columns },
  { value: "entry", label: "Entry", icon: TableProperties },
  { value: "dashlist", label: "Dash List", icon: Database }, // Using Database as placeholder for "list"
  { value: "separator", label: "Separator", icon: Minus },
];

export const SECTION_PRESETS: {
  type: SectionType;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { type: "about", label: "About Me", icon: User },
  { type: "skills", label: "Technical Skills", icon: Cpu },
  { type: "experience", label: "Professional Experience", icon: Briefcase },
  { type: "projects", label: "Projects", icon: FolderGit2 },
  { type: "education", label: "Education", icon: GraduationCap },
  { type: "certifications", label: "Certifications", icon: Award },
  { type: "languages", label: "Languages", icon: Languages },
  { type: "soft-skills", label: "Soft Skills", icon: MessageCircle },
  { type: "open-source", label: "Open-Source Projects", icon: Code2 },
  { type: "custom", label: "Custom Section…", icon: PlusCircle },
];

export const TEMPLATE_OPTIONS = [
  { value: "classic", label: "Classic", icon: AlignLeft },
  { value: "classic-double", label: "Classic Double Column", icon: Columns },
  { value: "modern", label: "Modern", icon: TableProperties }, // Using TableProperties for modern layout
  { value: "executive", label: "Executive", icon: Briefcase },
];
