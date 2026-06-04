import Link from "next/link";
import { api } from "@/lib/api";
import { FadeUp } from "@/components/motion/fade-up";
import { Badge } from "@/components/ui/badge";
import { localized } from "@/lib/i18n/dictionaries";
import { isValidLocale, localePath } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  let project;
  try {
    project = await api.projects.getBySlug!(slug);
  } catch {
    notFound();
  }

  return (
    <article className="container-umq py-16">
      <FadeUp>
        <Link
          href={localePath(locale, "/projects")}
          className="text-sm text-accent hover:underline"
        >
          {locale === "ar" ? "← المشاريع" : "← Projects"}
        </Link>
        {project.category && <Badge className="mt-6">{project.category}</Badge>}
        <h1 className="mt-4 text-4xl font-bold">
          {localized(locale, project, "titleAr", "titleEn")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-foreground-muted">
          {localized(locale, project, "summaryAr", "summaryEn")}
        </p>
        {project.clientName && (
          <p className="mt-2 text-sm text-foreground-muted">
            {locale === "ar" ? "العميل:" : "Client:"} {project.clientName}
          </p>
        )}
        {project.technologies?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        )}
        {(project.contentAr || project.contentEn) && (
          <div
            className="prose prose-neutral mt-10 max-w-3xl dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html:
                locale === "ar"
                  ? (project.contentAr ?? "")
                  : (project.contentEn ?? project.contentAr ?? ""),
            }}
          />
        )}
      </FadeUp>
    </article>
  );
}
