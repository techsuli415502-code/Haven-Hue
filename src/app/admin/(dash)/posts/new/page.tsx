import { PostForm, emptyPost } from "@/components/admin/post-form";

export const metadata = { title: "New Post" };

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New Blog Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write in Markdown with headings, lists, links and images. Preview before publishing.
        </p>
      </header>
      <PostForm mode="new" initial={{ ...emptyPost }} />
    </div>
  );
}
