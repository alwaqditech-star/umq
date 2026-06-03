import type { Locale } from "@/stores/ui-store";

const ar = {
  brand: "عُمْق",
  brandFull: "عُمْق لتقنية المعلومات",
  tagline: "حلول تقنية مؤسسية بعمق استراتيجي",
  nav: {
    home: "الرئيسية",
    about: "من نحن",
    services: "الخدمات",
    projects: "المشاريع",
    blog: "المدونة",
    careers: "الوظائف",
    contact: "تواصل معنا",
    admin: "لوحة التحكم",
    login: "تسجيل الدخول",
  },
  cta: {
    getStarted: "ابدأ مشروعك",
    learnMore: "اعرف المزيد",
    contactUs: "تواصل معنا",
    viewAll: "عرض الكل",
    apply: "قدّم الآن",
    readMore: "اقرأ المزيد",
  },
  sections: {
    services: "خدماتنا",
    projects: "مشاريعنا",
    testimonials: "آراء العملاء",
    latestPosts: "أحدث المقالات",
    openRoles: "الوظائف المتاحة",
  },
  footer: {
    rights: "جميع الحقوق محفوظة",
    privacy: "الخصوصية",
    terms: "الشروط",
  },
  admin: {
    dashboard: "نظرة عامة",
    users: "المستخدمون",
    roles: "الأدوار",
    services: "الخدمات",
    projects: "المشاريع",
    blog: "المدونة",
    jobs: "الوظائف",
    applications: "الطلبات",
    settings: "الإعدادات",
    logout: "خروج",
    welcome: "مرحباً بك",
    overview: "ملخص المنصة",
  },
  auth: {
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "ادخل إلى لوحة تحكم عُمْق",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    remember: "تذكرني",
    submit: "دخول",
  },
};

const en: typeof ar = {
  brand: "UMQ",
  brandFull: "UMQ Information Technology",
  tagline: "Enterprise technology with strategic depth",
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    projects: "Projects",
    blog: "Blog",
    careers: "Careers",
    contact: "Contact",
    admin: "Dashboard",
    login: "Sign in",
  },
  cta: {
    getStarted: "Start your project",
    learnMore: "Learn more",
    contactUs: "Contact us",
    viewAll: "View all",
    apply: "Apply now",
    readMore: "Read more",
  },
  sections: {
    services: "Our Services",
    projects: "Our Projects",
    testimonials: "Client Stories",
    latestPosts: "Latest Articles",
    openRoles: "Open Positions",
  },
  footer: {
    rights: "All rights reserved",
    privacy: "Privacy",
    terms: "Terms",
  },
  admin: {
    dashboard: "Overview",
    users: "Users",
    roles: "Roles",
    services: "Services",
    projects: "Projects",
    blog: "Blog",
    jobs: "Jobs",
    applications: "Applications",
    settings: "Settings",
    logout: "Log out",
    welcome: "Welcome back",
    overview: "Platform summary",
  },
  auth: {
    loginTitle: "Sign in",
    loginSubtitle: "Access the UMQ admin console",
    email: "Email",
    password: "Password",
    remember: "Remember me",
    submit: "Sign in",
  },
};

export type Dictionary = typeof ar;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "ar" ? ar : en;
}

export function localized(
  locale: Locale,
  item: object,
  keyAr: string,
  keyEn: string,
): string {
  const record = item as Record<string, string | number | undefined>;
  const value = locale === "ar" ? record[keyAr] : record[keyEn];
  return value != null ? String(value) : "";
}
