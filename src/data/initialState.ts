import { v4 as uuid } from "uuid";
import type {
  Block,
  BulletBlock,
  EntryBlock,
  KeyValueBlock,
  LinkBlock,
  ResumeData,
} from "../types/resume";

export function createEmptyState(): ResumeData {
    return {
      sections: [
        {
          id: uuid(),
          type: "header",
          title: "Header",
          order: 0,
          blocks: [],
          fixed: true,
        },
      ],
      selectedTemplate: "classic",
    };
  }
  
export function createSampleData(): ResumeData {
    const headerBlocks: Block[] = [
      { id: uuid(), type: "link", order: 0, label: "New York, NY", url: "", icon: "mappin" },
      { id: uuid(), type: "link", order: 1, label: "+1 (555) 123-4567", url: "tel:+15551234567", icon: "phone" },
      { id: uuid(), type: "link", order: 2, label: "john.doe@example.com", url: "mailto:john.doe@example.com", icon: "mail" },
      { id: uuid(), type: "link", order: 3, label: "linkedin.com/in/johndoe", url: "https://linkedin.com", icon: "linkedin" },
      { id: uuid(), type: "link", order: 4, label: "github.com/johndoe", url: "https://github.com", icon: "github" },
      { id: uuid(), type: "link", order: 5, label: "johndoe.dev", url: "https://example.com", icon: "globe" },
    ] as LinkBlock[];
  
    const aboutBlocks: Block[] = [
      {
        id: uuid(), type: "richtext", order: 0,
        value: "Passionate Senior Frontend Engineer with over 6 years of experience in building high-performance, accessible, and responsive web applications. Expert in the React ecosystem and modern CSS architectures, with a keen eye for UI/UX design details. proven track record of leading frontend teams, optimizing page load times by up to 40%, and establishing robust design systems that scale across enterprise products.",
      },
    ];
  
    const skillBlocks: Block[] = [
      { id: uuid(), type: "keyvalue", order: 0, label: "Core Web", value: "JavaScript (ES6+), TypeScript, HTML5, CSS3/SCSS" },
      { id: uuid(), type: "keyvalue", order: 1, label: "Frameworks", value: "React, Next.js, Vue.js, Svelte, Tailwind CSS, Framer Motion" },
      { id: uuid(), type: "keyvalue", order: 2, label: "State Management", value: "Redux Toolkit, Zustand, React Query, Context API" },
      { id: uuid(), type: "keyvalue", order: 3, label: "Testing", value: "Jest, React Testing Library, Cypress, Playwright" },
      { id: uuid(), type: "keyvalue", order: 4, label: "Build Tools", value: "Webpack, Vite, TurboRepo, Babel" },
      { id: uuid(), type: "keyvalue", order: 5, label: "Design Tools", value: "Figma, Adobe XD, Sketch, Storybook" },
      { id: uuid(), type: "keyvalue", order: 6, label: "Backend Basics", value: "Node.js, Express, GraphQL, Firebase" },
    ] as KeyValueBlock[];
  
    const experienceBlocks: Block[] = [
      {
        id: uuid(), type: "entry", order: 0,
        title: "Senior Frontend Engineer",
        subtitle: "TechNova Solutions",
        date: "Jan 2023 — Present",
        description: "Leading the frontend development of a SaaS platform served to over 50,000 active users. Focused on scalability, performance, and developer experience.",
        bullets: [
          { id: uuid(), value: "Architected a micro-frontend architecture using Webpack Module Federation, reducing build times by 60% and enabling independent deployments for cross-functional teams.", indent: 0 },
          { id: uuid(), value: "Spearheaded the migration of a legacy Monolith codebase to Next.js, resulting in a 40% improvement in Core Web Vitals and SEO rankings.", indent: 0 },
          { id: uuid(), value: "Developed and maintained an internal UI component library (Design System) used across 4 different products, ensuring visual consistency and accessibility compliance (WCAG 2.1).", indent: 0 },
          { id: uuid(), value: "Mentored 3 junior developers, conducting code reviews and organizing weekly knowledge-sharing sessions.", indent: 0 },
        ],
        links: [],
        subEntries: [],
      } as EntryBlock,
      {
        id: uuid(), type: "entry", order: 1,
        title: "Frontend Developer",
        subtitle: "Creative Pulse Agency",
        date: "Jun 2020 — Dec 2022",
        description: "Collaborated with designers and backend engineers to deliver pixel-perfect websites and web apps for high-profile clients.",
        bullets: [
          { id: uuid(), value: "Built interactive marketing campaigns for Fortune 500 clients using React, GSAP, and Three.js, winning 2 Awwwards.", indent: 0 },
          { id: uuid(), value: "Optimized critical rendering paths to achieve sub-second content paint times on mobile devices.", indent: 0 },
          { id: uuid(), value: "Integrated headless CMS solutions (Contentful, Strapi) to empower marketing teams with dynamic content control.", indent: 0 },
          { id: uuid(), value: "Implemented robust CI/CD pipelines using GitHub Actions to automate testing and deployment to Vercel/Netlify.", indent: 0 },
        ],
        links: [],
        subEntries: [],
      } as EntryBlock,
      {
        id: uuid(), type: "entry", order: 2,
        title: "Junior Web Developer",
        subtitle: "StartUp Inc.",
        date: "May 2018 — May 2020",
        description: "",
        bullets: [
          { id: uuid(), value: "Developed responsive landing pages and email templates ensuring cross-browser compatibility across IE11+, Chrome, and Safari.", indent: 0 },
          { id: uuid(), value: "Collaborated on the development of a customer dashboard using Vue.js and Firebase.", indent: 0 },
          { id: uuid(), value: "Participated in agile sprints, daily stand-ups, and retrospective meetings.", indent: 0 },
        ],
        links: [],
        subEntries: [],
      } as EntryBlock,
    ];
  
    const projectBlocks: Block[] = [
      {
        id: uuid(), type: "entry", order: 0,
        title: "E-Commerce Dashboard",
        subtitle: "React, Tremor, Tailwind CSS",
        date: "2024",
        description: "A comprehensive analytics dashboard for online retailers.",
        bullets: [
          { id: uuid(), value: "Visualized complex sales data using Recharts and Tremor components.", indent: 0 },
          { id: uuid(), value: "Implemented dark mode and responsive layouts for mobile management.", indent: 0 },
        ],
        links: [
          { id: uuid(), label: "Live Demo", url: "https://example.com" },
          { id: uuid(), label: "Source Code", url: "https://github.com" },
        ],
        subEntries: [],
      } as EntryBlock,
      {
        id: uuid(), type: "entry", order: 1,
        title: "TaskMaster Productivity App",
        subtitle: "Next.js, Prisma, tRPC",
        date: "2023",
        description: "A full-stack productivity tool inspired by Trello and Notion.",
        bullets: [
          { id: uuid(), value: "Built a drag-and-drop kanban board using dnd-kit.", indent: 0 },
          { id: uuid(), value: "Features real-time updates via WebSockets and offline support.", indent: 0 },
        ],
        links: [
          { id: uuid(), label: "View Project", url: "https://example.com" },
        ],
        subEntries: [],
      } as EntryBlock,
    ];
  
    const educationBlocks: Block[] = [
      {
        id: uuid(), type: "entry", order: 0,
        title: "Bachelor of Science in Computer Science",
        subtitle: "Massachusetts Institute of Technology",
        date: "2014 — 2018",
        description: "Focus on Human-Computer Interaction and Web Technologies.",
        bullets: [],
        links: [],
        subEntries: [],
      } as EntryBlock,
    ];
  
    const certificationBlocks: Block[] = [
      { id: uuid(), type: "bullet", order: 0, value: "Meta Frontend Developer Professional Certificate", indent: 0 },
      { id: uuid(), type: "bullet", order: 1, value: "AWS Certified Cloud Practitioner", indent: 0 },
      { id: uuid(), type: "bullet", order: 2, value: "Google UX Design Professional Certificate", indent: 0 },
    ] as BulletBlock[];
  
    const languageBlocks: Block[] = [
      { id: uuid(), type: "bullet", order: 0, value: "English: Native", indent: 0 },
      { id: uuid(), type: "bullet", order: 1, value: "Spanish: Professional Working Proficiency", indent: 0 },
      { id: uuid(), type: "bullet", order: 2, value: "French: Conversational", indent: 0 },
    ] as BulletBlock[];
  
    const softSkillBlocks: Block[] = [
      { id: uuid(), type: "bullet", order: 0, value: "Technical Leadership", indent: 0 },
      { id: uuid(), type: "bullet", order: 1, value: "Mentorship", indent: 0 },
      { id: uuid(), type: "bullet", order: 2, value: "Agile/Scrum", indent: 0 },
      { id: uuid(), type: "bullet", order: 3, value: "Cross-functional Collaboration", indent: 0 },
    ] as BulletBlock[];
  
    return {
      selectedTemplate: "classic-double",
      sections: [
        {
          id: uuid(),
          type: "header",
          title: "John Doe",
          subtitle: "Senior Frontend Engineer | UI/UX Specialist",
          order: 0,
          blocks: headerBlocks,
          fixed: true,
        },
        {
          id: uuid(),
          type: "about",
          title: "Professional Summary",
          order: 1,
          blocks: aboutBlocks,
        },
        {
          id: uuid(),
          type: "experience",
          title: "Experience",
          order: 2,
          blocks: experienceBlocks,
        },
        {
          id: uuid(),
          type: "skills",
          title: "Technical Skills",
          order: 3,
          blocks: skillBlocks,
        },
        {
          id: uuid(),
          type: "projects",
          title: "Projects",
          order: 4,
          blocks: projectBlocks,
        },
        {
          id: uuid(),
          type: "education",
          title: "Education",
          order: 5,
          blocks: educationBlocks,
        },
        {
          id: uuid(),
          type: "certifications",
          title: "Certifications",
          order: 6,
          blocks: certificationBlocks,
        },
        {
          id: uuid(),
          type: "languages",
          title: "Languages",
          order: 7,
          blocks: languageBlocks,
        },
        {
          id: uuid(),
          type: "soft-skills",
          title: "Soft Skills",
          order: 8,
          blocks: softSkillBlocks,
        },
      ],
    };
  }
