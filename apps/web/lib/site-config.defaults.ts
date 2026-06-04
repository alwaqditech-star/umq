/**
 * Client-safe site config defaults (no server-only or node:crypto imports).
 */

export interface HomeSectionConfig {
  key: string;
  labelAr: string;
  labelEn: string;
  sortOrder: number;
}

export interface ContactInfoSettings {
  email: string;
  phone: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  hoursAr: string;
  hoursEn: string;
  mapEmbedUrl?: string;
}

const SECTION_DEFAULTS: Record<
  string,
  { labelAr: string; labelEn: string; sortOrder: number }
> = {
  hero: { labelAr: "الواجهة الرئيسية", labelEn: "Hero", sortOrder: 0 },
  services: { labelAr: "الخدمات", labelEn: "Services", sortOrder: 10 },
  projects: { labelAr: "المشاريع", labelEn: "Projects", sortOrder: 20 },
  blog: { labelAr: "المدونة", labelEn: "Blog", sortOrder: 30 },
  testimonials: {
    labelAr: "آراء العملاء",
    labelEn: "Testimonials",
    sortOrder: 40,
  },
  partners: { labelAr: "الشركاء", labelEn: "Partners", sortOrder: 50 },
  team: { labelAr: "الفريق", labelEn: "Team", sortOrder: 60 },
  statistics: { labelAr: "الإحصائيات", labelEn: "Statistics", sortOrder: 70 },
  faq: { labelAr: "الأسئلة الشائعة", labelEn: "FAQ", sortOrder: 80 },
  contact_cta: {
    labelAr: "دعوة للتواصل",
    labelEn: "Contact CTA",
    sortOrder: 90,
  },
};

const SECTION_KEYS = Object.keys(SECTION_DEFAULTS);

export const DEFAULT_HOME_SECTIONS: HomeSectionConfig[] = SECTION_KEYS.map(
  (key) => ({
    key,
    ...SECTION_DEFAULTS[key]!,
  }),
);

export const DEFAULT_CONTACT: ContactInfoSettings = {
  email: "info@umq.sa",
  phone: "+966 11 000 0000",
  whatsapp: "+966500000000",
  addressAr: "الرياض، المملكة العربية السعودية",
  addressEn: "Riyadh, Saudi Arabia",
  hoursAr: "الأحد – الخميس، 9 ص – 6 م",
  hoursEn: "Sun – Thu, 9 AM – 6 PM",
};

export function parseContactFromPublicSettings(
  data: Record<string, unknown>,
): ContactInfoSettings {
  const contact = (data["contact.info"] ?? {}) as Partial<ContactInfoSettings>;
  return {
    email: contact.email ?? DEFAULT_CONTACT.email,
    phone: contact.phone ?? DEFAULT_CONTACT.phone,
    whatsapp: contact.whatsapp ?? DEFAULT_CONTACT.whatsapp,
    addressAr: contact.addressAr ?? DEFAULT_CONTACT.addressAr,
    addressEn: contact.addressEn ?? DEFAULT_CONTACT.addressEn,
    hoursAr: contact.hoursAr ?? DEFAULT_CONTACT.hoursAr,
    hoursEn: contact.hoursEn ?? DEFAULT_CONTACT.hoursEn,
    mapEmbedUrl: contact.mapEmbedUrl,
  };
}
