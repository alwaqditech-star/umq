"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";

export function BlogPageClient({
  locale,
  posts,
}: {
  locale: Locale;
  posts: BlogPost[];
}) {
  return (
    <div className="container-umq py-16">
      <FadeUp>
        <h1 className="text-4xl font-bold">{locale === "ar" ? "المدونة" : "Blog"}</h1>
      </FadeUp>
      <StaggerList className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <StaggerItem key={post.id}>
            <Card hover className="h-full">
              <Badge>{post.category}</Badge>
              <h2 className="mt-4 text-xl font-semibold">
                {localized(locale, post, "titleAr", "titleEn")}
              </h2>
              <p className="mt-2 text-sm text-foreground-muted">
                {localized(locale, post, "excerptAr", "excerptEn")}
              </p>
              <p className="mt-4 text-xs text-foreground-muted">
                {post.readingTime} min · {post.publishedAt}
              </p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
