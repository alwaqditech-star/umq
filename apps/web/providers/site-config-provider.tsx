"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CONTACT,
  DEFAULT_HOME_SECTIONS,
  parseContactFromPublicSettings,
  type ContactInfoSettings,
  type HomeSectionConfig,
} from "@/lib/site-config.defaults";

type SiteConfigValue = {
  sections: HomeSectionConfig[];
  enabledKeys: Set<string>;
  contact: ContactInfoSettings;
};

const SiteConfigContext = createContext<SiteConfigValue | null>(null);

export function SiteConfigProvider({
  sections: initialSections,
  contact: initialContact,
  hydrateFromApi = false,
  children,
}: {
  sections: HomeSectionConfig[];
  contact: ContactInfoSettings;
  /** Fetch latest sections/settings in the background (non-blocking). */
  hydrateFromApi?: boolean;
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState(initialSections);
  const [contact, setContact] = useState(initialContact);

  useEffect(() => {
    if (!hydrateFromApi) return;

    let cancelled = false;

    async function load() {
      try {
        const [sectionsRes, settingsRes] = await Promise.all([
          fetch("/api/v1/home-sections", { credentials: "include" }),
          fetch("/api/v1/settings/public", { credentials: "include" }),
        ]);
        if (cancelled) return;

        if (sectionsRes.ok) {
          const rows = (await sectionsRes.json()) as HomeSectionConfig[];
          if (Array.isArray(rows) && rows.length > 0) {
            setSections(rows);
          }
        }
        if (settingsRes.ok) {
          const data = (await settingsRes.json()) as Record<string, unknown>;
          setContact(parseContactFromPublicSettings(data));
        }
      } catch {
        /* keep defaults */
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [hydrateFromApi]);

  const value = useMemo(
    () => ({
      sections,
      enabledKeys: new Set(sections.map((s) => s.key)),
      contact,
    }),
    [sections, contact],
  );

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    return {
      sections: DEFAULT_HOME_SECTIONS,
      enabledKeys: new Set(DEFAULT_HOME_SECTIONS.map((s) => s.key)),
      contact: DEFAULT_CONTACT,
    };
  }
  return ctx;
}

export function useSectionEnabled(key: string) {
  const { enabledKeys } = useSiteConfig();
  return enabledKeys.has(key);
}
