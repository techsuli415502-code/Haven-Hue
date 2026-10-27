import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage the collections products are organized into.
        </p>
      </header>
      <CategoriesManager />
    </div>
  );
}
