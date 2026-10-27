import { withAdmin, ok, fail, zodMessage } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { readJson } from "@/lib/api";
import { postSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

/** List posts for the admin table (includes drafts, supports search + status filter). */
export async function GET(req: Request) {
  return withAdmin(req, async () => {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";

    const where = {
      ...(q ? { title: { contains: q } } : {}),
      ...(status === "PUBLISHED" || status === "DRAFT" ? { status } : {}),
    };

    const posts = await db.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return ok({ posts });
  });
}

/** Create a blog post. */
export async function POST(req: Request) {
  return withAdmin(req, async () => {
    const body = await readJson(req);
    if (!body) return fail(400, "Invalid request body.");

    const parsed = postSchema.safeParse(body);
    if (!parsed.success) return fail(400, zodMessage(parsed));
    const data = parsed.data;

    const slug = data.slug?.trim() ? await uniqueSlug("post", data.slug) : await uniqueSlug("post", data.title);

    const post = await db.post.create({
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
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return ok({ post });
  });
}
