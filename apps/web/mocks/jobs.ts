import type { Application, Job } from "@/lib/api/types";

export const mockJobs: Job[] = [
  {
    id: "1",
    slug: "senior-fullstack",
    titleAr: "مهندس Full Stack أول",
    titleEn: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "الرياض",
    type: "Full-time",
    descriptionAr: "بناء منتجات Next.js و NestJS بجودة مؤسسية.",
    descriptionEn: "Build enterprise-grade Next.js and NestJS products.",
  },
  {
    id: "2",
    slug: "ux-designer",
    titleAr: "مصمم تجربة مستخدم",
    titleEn: "UX Designer",
    department: "Design",
    location: "الرياض / عن بُعد",
    type: "Full-time",
    descriptionAr: "تصميم واجهات SaaS بمستوى عالمي.",
    descriptionEn: "Design world-class SaaS experiences.",
  },
  {
    id: "3",
    slug: "devops-engineer",
    titleAr: "مهندس DevOps",
    titleEn: "DevOps Engineer",
    department: "Platform",
    location: "جدة",
    type: "Full-time",
    descriptionAr: "أتمتة CI/CD وبنية سحابية.",
    descriptionEn: "CI/CD automation and cloud infrastructure.",
  },
];

export const mockApplications: Application[] = [
  {
    id: "1",
    jobId: "1",
    applicantName: "أحمد الزهراني",
    email: "ahmed@example.com",
    status: "new",
    appliedAt: "2026-03-05",
  },
  {
    id: "2",
    jobId: "1",
    applicantName: "Nora Al-Faisal",
    email: "nora@example.com",
    status: "reviewing",
    appliedAt: "2026-03-04",
  },
  {
    id: "3",
    jobId: "2",
    applicantName: "ريم الحسن",
    email: "reem@example.com",
    status: "shortlisted",
    appliedAt: "2026-03-02",
  },
];
