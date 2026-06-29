import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
  {
    id: "video-live-streaming-platform",
    title: "LivCast",
    period: {
      start: "2022",
      end: "2023",
    },
    skills: [
      "React",
      "React Native",
      "Node.js",
      "FFmpeg",
      "WebRTC",
      "AWS S3",
      "AWS Lambda",
      "Facebook API",
      "YouTube API",
    ],
    description:
      "As a Full-Stack Developer, I built a live streaming platform for web and mobile using React and React Native. It supports multi-streaming to Facebook, YouTube, and Twitch. I integrated FFmpeg for video processing, WebRTC for real-time communication, and various APIs for broadcasting and cloud storage.",
    logo: "/images/project/livcast/livcast_logo.webp",
    link: "",
    isExpanded: false,
    hasCaseStudy: true,
  },
  {
    id: "dexai",
    title: "DexAI",
    period: {
      start: "2025",
      end: "2025",
    },
    skills: [
      "Ai SDK",
      "Next.js",
      "Layout Parsing",
      "Multilingual Processing",
      "OCR",
      "Python",
      "JSON Processing",
      "Bounding Box Detection",
      "Image Processing",
    ],
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
    hasCaseStudy: true,
    description:
      "Intelligent Multilingual Document Understanding. Developed advanced AI systems for intelligent multilingual document understanding, addressing challenges in extracting and interpreting information from diverse document formats (DOC, PDF, PPT, JPEG, PNG, handwritten) with mixed scripts (English, Hindi, Arabic, etc.). The solution focuses on accurate layout-aware parsing, preserving visual hierarchy, semantic grouping, and embedded elements like tables, images, maps, and charts. Implemented models to generate structured JSON outputs, including natural language descriptions of complex elements and line-wise bounding box coordinates for text.",
  },
  {
    id: "uam",
    title: "User Access Management (UAM)",
    period: {
      start: "2024",
    },
    skills: ["Angular", "Angular Material", "PrimeNG", "RxJS", "TypeScript"],
    description:
      "Developed a scalable frontend-driven User Access Management (UAM) system using Angular to manage roles and permissions across complex financial hierarchies. Supports dynamic permission mapping, hierarchical access control, bulk user creation queues, and real-time status notifications.",
    link: "",
    isExpanded: false,
    hasCaseStudy: true,
  },
  {
    id: "wally-consumer-app",
    title: "Wally - Consumer App",
    period: {
      start: "2023",
      end: "2024",
    },
    skills: ["Next.js", "React", "Tailwind CSS", "Zustand", "Prisma", "PWA"],
    description:
      "As Lead Frontend Developer, I led the development of a dynamic consumer app using Next.js. I implemented server-side and client-side rendering, geo-location for personalized offers, a secure wallet, and event booking. The app features PWA support, dynamic theming, and a responsive design with Tailwind CSS. I also managed state with Zustand and used Prisma for database interactions.",
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
    hasCaseStudy: true,
  },
  {
    id: "legit-backend",
    title: "Legit (News Platform - Backend)",
    period: {
      start: "2024",
      end: "2024",
    },
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "jsonwebtoken",
      "bcrypt",
      "OpenAI SDK",
      "Docker",
      "node-cron",
    ],
    description:
      "Developed a robust Express.js REST API backend powered by MongoDB, supporting authentication, news delivery, and AI services. Implemented dual automated RSS ingestion pipelines with hourly schedules and integrated OpenAI GPT-3.5 Turbo for a conversational fact-checking chatbot.",
    link: "",
    isExpanded: false,
    hasCaseStudy: true,
  },
  {
    id: "pipli-retailer-portal",
    title: "Pipli - Retailer Portal",
    period: {
      start: "2022",
      end: "2023",
    },
    skills: [
      "Next.js",
      "React",
      "Redux",
      "Prime React",
      "AWS S3",
      "OAuth",
      "JWT",
    ],
    description:
      "Developed a responsive retailer portal using React and Next.js, enabling retailers to manage feedback, e-bills, and promotions. I implemented analytics, customized bill designs, and integrated authentication with OAuth/JWT for secure access.",
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
    hasCaseStudy: true,
  },
  {
    id: "webstories-backend",
    title: "WebStories - Backend",
    period: {
      start: "2022",
      end: "2023",
    },
    skills: [
      "Node.js",
      "TypeScript",
      "MongoDB",
      "Zod",
      "Azure Key Vault",
      "Express.js",
      "Vitest",
    ],
    description:
      "Developed a scalable backend for a multimedia story platform using Node.js and TypeScript. I designed a module-based architecture, implemented secure story management with URL-friendly links, and used Zod for robust validation. The system also includes cron jobs for content expiration and secure key management with Azure Key Vault.",
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
  },
  {
    id: "admin-portal",
    title: "Admin Portal",
    period: {
      start: "2021",
      end: "2022",
    },
    skills: ["React", "Redux", "Next.js", "Apex Charts", "AWS S3"],
    description:
      "Built a comprehensive admin portal with React and Next.js for product, report, and campaign management. I developed a user-friendly interface with data visualization using ApexCharts and integrated it with backend APIs for a seamless administrative experience.",
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
  },
  {
    id: "mpos-react-native",
    title: "MPos - Mobile Point of Sale",
    period: {
      start: "2021",
      end: "2022",
    },
    skills: ["React Native", "Redux", "Jest"],
    description:
      "Developed a mobile point-of-sale application using React Native. The app provides store billing and invoice management functionalities. I was responsible for building reusable components, integrating with backend services, and ensuring a smooth user experience on both iOS and Android.",
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
    hasCaseStudy: true,
  },
  {
    id: "file-converter-application",
    title: "File Converter Application",
    period: {
      start: "2020",
      end: "2021",
    },
    skills: ["React", "Redux", "Node.js", "Express.js", "AWS S3"],
    description:
      "Created a full-stack file converter application allowing users to upload, convert, and download files in various formats. The frontend was built with React and Redux, while the backend used Node.js and Express.js, with AWS S3 for file storage.",
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
  },
  {
    id: "pwa-wrapper-for-android",
    title: "PWA Wrapper for Android",
    period: {
      start: "2020",
      end: "2021",
    },
    skills: ["Android", "Jetpack Compose", "React", "PWA", "Geofencing"],
    description:
      "Developed an Android application serving as a PWA wrapper, using Jetpack Compose for the native UI. The app delivers location-based promotions by tracking user proximity to retail stores through geofencing, enhancing the user’s shopping experience with personalized content.",
    logo: "https://assets.chanhdai.com/images/project-logos/quaricdotcom.svg",
    link: "",
    isExpanded: false,
  },
];
