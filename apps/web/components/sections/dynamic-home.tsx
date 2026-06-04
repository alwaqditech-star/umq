"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { ServicesPreview } from "@/components/sections/services-preview";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { BlogPreviewSection } from "@/components/sections/blog-preview";
import { PartnersSection } from "@/components/sections/partners-section";
import { TeamSection } from "@/components/sections/team-section";
import { StatisticsSection } from "@/components/sections/statistics-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { useSiteConfig } from "@/providers/site-config-provider";
import type { BlogPost, Project, Service, Testimonial } from "@/lib/api/types";
import type { Locale } from "@/stores/ui-store";

export function DynamicHomeHero({
  locale,
  heroContent,
}: {
  locale: Locale;
  heroContent?: Record<string, string> | null;
}) {
  const { enabledKeys } = useSiteConfig();
  if (!enabledKeys.has("hero")) return null;
  return <HeroSection locale={locale} content={heroContent} />;
}

export function DynamicHomeBody({
  locale,
  services,
  projects,
  testimonials,
  posts,
  partners,
  team,
}: {
  locale: Locale;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  posts: BlogPost[];
  partners: { id: string; nameAr: string; nameEn: string; url: string }[];
  team: {
    id: string;
    nameAr: string;
    nameEn: string;
    roleAr: string;
    roleEn: string;
    bioAr: string;
    bioEn: string;
  }[];
}) {
  const { enabledKeys } = useSiteConfig();
  const show = (key: string) => enabledKeys.has(key);

  return (
    <>
      {show("services") && (
        <ServicesPreview locale={locale} services={services} />
      )}
      {show("projects") && (
        <ProjectsPreview locale={locale} projects={projects} />
      )}
      {show("statistics") && <StatisticsSection locale={locale} />}
      {show("blog") && <BlogPreviewSection locale={locale} posts={posts} />}
      {show("testimonials") && (
        <TestimonialsSection locale={locale} testimonials={testimonials} />
      )}
      {show("partners") && (
        <PartnersSection locale={locale} partners={partners} />
      )}
      {show("team") && <TeamSection locale={locale} members={team} />}
      {show("contact_cta") && <ContactCtaSection locale={locale} />}
    </>
  );
}
