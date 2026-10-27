import { withAdmin, ok, fail, zodMessage, notFound } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { readJson } from "@/lib/api";
import { postSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

/** Get a single post (including drafts) for editing. */
export async function GET(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const post = await db.post.findUnique({ where: { id } });
    if (!post) return notFound("Post");
    return ok({ post });
  });
}

/** Update a blog post. */
export async function PUT(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.post.findUnique({ where: { id } });
    if (!existing) return notFound("Post");

    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = postSchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));
    const data = parsed.data;

    let slug = existing.slug;
    const desiredBase = data.slug?.trim() || data.title;
    if (desiredBase !== existing.title && desiredBase !== existing.slug) {
      slug = await uniqueSlug("post", desiredBase, id);
    }

    const publishedAt = data.status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : null;

    const post = await db.post.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage ?? null,
        imageAlt: data.imageAlt ?? null,
        pinterestImage: data.pinterestImage ?? null,
        category: data.category,
        tags: JSON.stringify(data.tags),
        author: data.author,
        status: data.status,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        publishedAt,
      },
    });

    return ok({ post });
  });
}

/** Delete a blog post permanently (the UI asks for confirmation first). */
export async function DELETE(req: Request, ctx: Ctx) {
  return withAdmin(req, async () => {
    const { id } = await ctx.params;
    const existing = await db.post.findUnique({ where: { id } });
    if (!existing) return notFound("Post");

    await db.post.delete({ where: { id } });
    return ok({ message: `Deleted "${existing.title}".` });
  });
}
