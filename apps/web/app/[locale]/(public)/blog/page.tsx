import { api } from "@/lib/api";
import { BlogPageClient } from "./blog-client";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const posts = await api.blog.getAll();
  return <BlogPageClient locale={localeParam as Locale} posts={posts} />;
}
