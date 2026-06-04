"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Share2, User } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/motion/fade-up";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Locale } from "@/stores/ui-store";

export function BlogDetailClient({
  locale,
  post,
  related,
}: {
  locale: Locale;
  post: BlogPost;
  related: BlogPost[];
}) {
  const title = localized(locale, post, "titleAr", "titleEn");
  const coverSrc = resolveMediaUrl(post.coverImageUrl);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: shareUrl });
    } else if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <article>
      {coverSrc && (
        <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-[420px]">
          <Image
            src={coverSrc}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
      )}

      <div className="container-umq py-12 sm:py-16">
        <FadeUp className="mx-auto max-w-3xl">
          <Link
            href={localePath(locale, "/blog")}
            className="text-sm font-medium text-accent hover:underline"
          >
            {locale === "ar" ? "← المدونة" : "← Blog"}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{post.category}</Badge>
            {(post.tags ?? []).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-accent" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent" />
              {post.readingTime} min
            </span>
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-accent" />
                {post.publishedAt.slice(0, 10)}
              </span>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Share2 className="h-4 w-4" />
              {locale === "ar" ? "مشاركة" : "Share"}
            </button>
          </div>
          <div
            className="prose-umq mt-10"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />
        </FadeUp>

        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="text-2xl font-bold">
              {locale === "ar" ? "مقالات ذات صلة" : "Related articles"}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card hover elevated className="h-full">
                    <Link href={localePath(locale, `/blog/${item.slug}`)}>
                      <p className="text-xs text-accent">{item.category}</p>
                      <h3 className="mt-2 font-semibold hover:text-accent line-clamp-2">
                        {localized(locale, item, "titleAr", "titleEn")}
                      </h3>
                      <p className="mt-2 text-xs text-foreground-muted">
                        {item.readingTime} min
                      </p>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
