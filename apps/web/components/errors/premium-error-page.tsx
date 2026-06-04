"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { MeshBackground } from "@/components/design/mesh-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { localePath, isValidLocale } from "@/lib/i18n/routes";
import { localized } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";
import type { SearchResults } from "@/lib/api/types";

export function PremiumErrorPage({
  code,
  titleAr,
  titleEn,
  messageAr,
  messageEn,
  showSearch = false,
  actions,
}: {
  code: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  showSearch?: boolean;
  actions?: { href: string; labelAr: string; labelEn: string }[];
}) {
  const params = useParams();
  const locale: Locale =
    typeof params?.locale === "string" && isValidLocale(params.locale)
      ? params.locale
      : "ar";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultActions = [
    { href: "", labelAr: "الرئيسية", labelEn: "Home" },
    { href: "/services", labelAr: "الخدمات", labelEn: "Services" },
    { href: "/projects", labelAr: "المشاريع", labelEn: "Projects" },
    { href: "/blog", labelAr: "المدونة", labelEn: "Blog" },
    { href: "/contact", labelAr: "التواصل", labelEn: "Contact" },
  ];

  const links = actions ?? defaultActions;

  const runSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    try {
      const data = await api.search(query.trim(), locale);
      setResults(data);
    } catch {
      setResults({ services: [], projects: [], posts: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[70vh] overflow-hidden py-20">
      <MeshBackground variant="hero" />
      <div className="container-umq relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-8xl font-bold text-gradient opacity-90">{code}</p>
          <h1 className="mt-4 text-3xl font-bold">
            {locale === "ar" ? titleAr : titleEn}
          </h1>
          <p className="mt-4 text-lg text-foreground-muted">
            {locale === "ar" ? messageAr : messageEn}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {links.map((item) => (
              <Link key={item.href} href={localePath(locale, item.href)}>
                <Button variant="secondary" size="sm">
                  {locale === "ar" ? item.labelAr : item.labelEn}
                </Button>
              </Link>
            ))}
          </div>

          {showSearch && (
            <form
              onSubmit={runSearch}
              className="surface-premium mx-auto mt-12 max-w-lg rounded-2xl p-6 text-start"
            >
              <label className="flex items-center gap-2 text-sm font-medium">
                <Search className="h-4 w-4 text-accent" />
                {locale === "ar" ? "بحث في الموقع" : "Search the site"}
              </label>
              <div className="mt-3 flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={locale === "ar" ? "ابحث..." : "Search..."}
                  className="flex-1"
                />
                <Button type="submit" loading={loading}>
                  {locale === "ar" ? "بحث" : "Go"}
                </Button>
              </div>
              {results && (
                <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                  {results.posts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={localePath(locale, `/blog/${p.slug}`)}
                        className="hover:text-accent"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                  {results.projects.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={localePath(locale, `/projects/${p.slug}`)}
                        className="hover:text-accent"
                      >
                        {localized(locale, p, "titleAr", "titleEn")}
                      </Link>
                    </li>
                  ))}
                  {results.services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={localePath(locale, `/services`)}
                        className="hover:text-accent"
                      >
                        {localized(locale, s, "titleAr", "titleEn")}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
