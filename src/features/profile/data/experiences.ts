import type { Experience } from "../types/experiences";

export const EXPERIENCES: Experience[] = [
  {
    id: "prometheantech",
    companyName: "PrometheanTech",
    companyLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0b7TKLFzQuLTR-E9GynPCwTbo6qhmHrN0QQ&s",
    positions: [
      {
        id: "prometheantech-fullstack",
        title: "Senior Full-stack Developer",
        employmentPeriod: {
          start: "11.2023",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- Architected and delivered mission-critical applications including user access management systems.
- Developed cross-platform mobile and web applications using React Native, Node.js, and Next.js.
- Designed and implemented scalable, secure backend solutions for enterprise-grade systems.
- Leveraged advanced JavaScript and Next.js to build innovative software products.
- Improved system performance by optimizing APIs and implementing robust caching mechanisms.`,
        skills: [
          "React Native",
          "Node.js",
          "Next.js",
          "Microservices",
          "REST APIs",
          "Docker",
          "Agile Development",
        ],
        isExpanded: true,
      },
      {
        id: "prometheantech-javascript",
        title: "JavaScript Developer",
        employmentPeriod: {
          start: "03.2022",
          end: "11.2023",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- Built responsive and dynamic web applications with React.js, delivering seamless and intuitive user experiences.
- Initiated cross-platform mobile app development using React Native, focusing on clean UI and smooth UX.
- Created early-stage mobile app prototypes, collaborating with design and backend teams to ensure seamless integration.
- Implemented core mobile features and optimized application performance for web and mobile platforms.`,
        skills: [
          "React.js",
          "React Native",
          "Node.js",
          "Redux",
          "REST APIs",
          "Responsive Design",
        ],
      },
    ],
    isCurrentEmployer: false,
  },
  {
    id: "sparks-foundation",
    companyName: "The Sparks Foundation",
    companyLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs0UJAUHGSoQUgHGCFtzvWOfccKCexymTXWg&s",
    positions: [
      {
        id: "sparks-foundation-intern",
        title: "Web Development Intern",
        employmentPeriod: {
          start: "01.2022",
          end: "02.2022",
        },
        employmentType: "Internship",
        icon: "education",
        description: `- Developed interactive web components and enhanced website functionality as part of the foundation’s initiatives.
- Gained hands-on experience in frontend technologies and collaborative development workflows.`,
        skills: ["HTML5", "CSS3", "JavaScript", "Git", "Collaboration"],
      },
    ],
  },
  {
    id: "yash-mahajan-education",
    companyName: "Education",
    positions: [
      {
        id: "education-git",
        title: "Gandhinagar Institute of Technology",
        employmentPeriod: {
          start: "12.2018",
          end: "05.2022",
        },
        icon: "education",
        description: `Bachelor of Engineering (BE) in Information Technology.`,
        skills: [
          "Data Structures",
          "Algorithms",
          "Software Engineering",
          "Teamwork",
        ],
      },
    ],
  },
];
