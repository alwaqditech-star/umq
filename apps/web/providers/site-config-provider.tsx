"use client";

import { createContext, useContext, useMemo } from "react";
import type { ContactInfoSettings, HomeSectionConfig } from "@/lib/site-config";

type SiteConfigValue = {
  sections: HomeSectionConfig[];
  enabledKeys: Set<string>;
  contact: ContactInfoSettings;
};

const SiteConfigContext = createContext<SiteConfigValue | null>(null);

export function SiteConfigProvider({
  sections,
  contact,
  children,
}: {
  sections: HomeSectionConfig[];
  contact: ContactInfoSettings;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      sections,
      enabledKeys: new Set(sections.map((s) => s.key)),
      contact,
    }),
    [sections, contact],
  );

  return (
    <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    return {
      sections: [] as HomeSectionConfig[],
      enabledKeys: new Set<string>(),
      contact: {
        email: "info@umq.sa",
        phone: "+966 11 000 0000",
        whatsapp: "+966500000000",
        addressAr: "",
        addressEn: "",
        hoursAr: "",
        hoursEn: "",
      } as ContactInfoSettings,
    };
  }
  return ctx;
}

export function useSectionEnabled(key: string) {
  const { enabledKeys } = useSiteConfig();
  return enabledKeys.has(key);
}
