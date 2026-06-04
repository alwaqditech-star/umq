import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentStatus, Locale } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private mapPost(post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date | null;
    readingTime: number | null;
    category: { nameAr: string } | null;
    author: { firstName: string; lastName: string } | null;
  }) {
    const authorName = post.author
      ? `${post.author.firstName} ${post.author.lastName}`.trim()
      : "UMQ";
    return {
      id: post.id,
      slug: post.slug,
      titleAr: post.title,
      titleEn: post.title,
      excerptAr: post.excerpt ?? "",
      excerptEn: post.excerpt ?? "",
      category: post.category?.nameAr ?? "",
      author: authorName,
      publishedAt: post.publishedAt?.toISOString() ?? new Date().toISOString(),
      readingTime: post.readingTime ?? 5,
    };
  }

  async findPublished(locale?: string) {
    const items = await this.prisma.blogPost.findMany({
      where: {
        deletedAt: null,
        status: ContentStatus.PUBLISHED,
        ...(locale === "en" ? { locale: Locale.EN } : { locale: Locale.AR }),
      },
      include: { category: true, author: true },
      orderBy: { publishedAt: "desc" },
    });
    return items.map((p) => this.mapPost(p));
  }

  async findPublishedBySlug(slug: string, locale?: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: ContentStatus.PUBLISHED,
        ...(locale === "en" ? { locale: Locale.EN } : { locale: Locale.AR }),
      },
      include: { category: true, author: true },
    });
    if (!post) throw new NotFoundException("Post not found");
    return this.mapPost(post);
  }

  async findAllAdmin() {
    const items = await this.prisma.blogPost.findMany({
      where: { deletedAt: null },
      include: { category: true, author: true },
      orderBy: { createdAt: "desc" },
    });
    return items.map((p) => this.mapPost(p));
  }
}
