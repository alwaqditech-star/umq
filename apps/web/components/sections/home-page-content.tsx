"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { ServicesPreview } from "@/components/sections/services-preview";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import type { Project, Service, Testimonial } from "@/lib/api/types";
import type { Locale } from "@/stores/ui-store";

export function HomePageContent({
  locale,
  services,
  projects,
  testimonials,
}: {
  locale: Locale;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
}) {
  return (
    <>
      <HeroSection locale={locale} />
      <ServicesPreview locale={locale} services={services} />
      <ProjectsPreview locale={locale} projects={projects} />
      <TestimonialsSection locale={locale} testimonials={testimonials} />
    </>
  );
}
