"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { FadeUp } from "@/components/motion/fade-up";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeshBackground } from "@/components/design/mesh-background";
import type { BlogPost } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Locale } from "@/stores/ui-store";

export function BlogPreviewSection({
  locale,
  posts,
}: {
  locale: Locale;
  posts: BlogPost[];
}) {
  const dict = getDictionary(locale);
  const featured = posts.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <MeshBackground variant="subtle" />
      <div className="container-umq relative">
        <FadeUp className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="section-kicker">
              {locale === "ar" ? "المعرفة" : "Insights"}
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              {dict.sections.latestPosts}
            </h2>
          </div>
          <Link href={localePath(locale, "/blog")}>
            <Button variant="ghost">{dict.cta.viewAll}</Button>
          </Link>
        </FadeUp>
        <StaggerList className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((post) => {
            const coverSrc = resolveMediaUrl(post.coverImageUrl);
            return (
              <StaggerItem key={post.id}>
                <Card
                  hover
                  elevated
                  className="group h-full overflow-hidden p-0"
                >
                  <Link href={localePath(locale, `/blog/${post.slug}`)}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-accent/10">
                      {coverSrc ? (
                        <Image
                          src={coverSrc}
                          alt={localized(locale, post, "titleAr", "titleEn")}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width:768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
                          UMQ
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-medium text-accent">
                        {post.category}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold line-clamp-2 group-hover:text-accent">
                        {localized(locale, post, "titleAr", "titleEn")}
                      </h3>
                      <p className="mt-2 text-sm text-foreground-muted line-clamp-2">
                        {localized(locale, post, "excerptAr", "excerptEn")}
                      </p>
                      <div className="mt-4 flex items-center gap-3 text-xs text-foreground-muted">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readingTime} min
                        </span>
                        {post.publishedAt && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {post.publishedAt.slice(0, 10)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </section>
  );
}
