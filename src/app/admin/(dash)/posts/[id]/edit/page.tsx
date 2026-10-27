import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostForm } from "@/components/admin/post-form";
import { parseList } from "@/lib/data";

export const metadata = { title: "Edit Post" };

type Params = Promise<{ id: string }>;

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Editing <span className="font-medium text-foreground">{post.title}</span> ·{" "}
          <span className={post.status === "PUBLISHED" ? "text-sage-deep" : "text-terracotta"}>
            {post.status === "PUBLISHED" ? "Published" : "Draft"}
          </span>
        </p>
      </header>

      <PostForm
        mode="edit"
        postId={post.id}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          featuredImage: post.featuredImage ?? "",
          imageAlt: post.imageAlt ?? "",
          pinterestImage: post.pinterestImage ?? "",
          category: post.category,
          tags: parseList(post.tags).join(", "),
          author: post.author ?? "Editorial Team",
          status: post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
        }}
      />
    </div>
  );
}
