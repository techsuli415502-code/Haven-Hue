import { PostsTable } from "@/components/admin/posts-table";

export const metadata = { title: "Blog Posts" };

type SearchParams = Promise<{ status?: string }>;

export default async function AdminPostsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write styling guides and decor ideas — your main engine for Pinterest traffic.
        </p>
      </header>
      <PostsTable initialStatus={status} />
    </div>
  );
}
