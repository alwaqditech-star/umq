"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Locale } from "@/stores/ui-store";

export function BlogPageClient({
  locale,
  posts,
}: {
  locale: Locale;
  posts: BlogPost[];
}) {
  const p = getDictionary(locale).pages;

  return (
    <>
      <PageHeader
        kicker={p.blogKicker}
        title={p.blogTitle}
        description={p.blogDesc}
      />
      <div className="container-umq py-14 sm:py-20">
        {posts.length === 0 ? (
          <p className="text-center text-foreground-muted">
            {locale === "ar"
              ? "لا توجد مقالات منشورة بعد."
              : "No published articles yet."}
          </p>
        ) : (
          <StaggerList className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const coverSrc = resolveMediaUrl(post.coverImageUrl);
              return (
                <StaggerItem key={post.id}>
                  <Card
                    hover
                    elevated
                    className="group h-full overflow-hidden p-0"
                  >
                    <Link href={localePath(locale, `/blog/${post.slug}`)}>
                      <div className="relative aspect-[16/10] bg-accent/10">
                        {coverSrc ? (
                          <Image
                            src={coverSrc}
                            alt={localized(locale, post, "titleAr", "titleEn")}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width:768px) 100vw, 33vw"
                          />
                        ) : null}
                      </div>
                      <div className="p-6">
                        <Badge variant="accent">{post.category}</Badge>
                        <h2 className="mt-3 text-xl font-semibold line-clamp-2 group-hover:text-accent">
                          {localized(locale, post, "titleAr", "titleEn")}
                        </h2>
                        <p className="mt-2 text-sm text-foreground-muted line-clamp-3">
                          {localized(locale, post, "excerptAr", "excerptEn")}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-foreground-muted">
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {post.author}
                          </span>
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
        )}
      </div>
    </>
  );
}
