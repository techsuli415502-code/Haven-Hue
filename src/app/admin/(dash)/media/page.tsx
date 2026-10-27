import { MediaManager } from "@/components/admin/media-manager";

export const metadata = { title: "Media Library" };

export default function AdminMediaPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and manage images used across products and blog posts.
        </p>
      </header>
      <MediaManager />
    </div>
  );
}
