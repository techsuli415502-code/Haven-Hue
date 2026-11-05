import { db } from "@/lib/db";
import { ProductForm, emptyProduct, DeleteProductButton } from "@/components/admin/product-form";
import { parseList } from "@/lib/data";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  // The database may not be connected yet (demo mode) — render the form with
  // an empty category list instead of crashing.
  let categories: Awaited<ReturnType<typeof db.category.findMany>> = [];
  try {
    categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    // Database not connected — the form still renders (saving will fail).
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Add New Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below. You can save as a draft and preview it before publishing.
        </p>
      </header>
      <ProductForm mode="new" initial={{ ...emptyProduct }} />
    </div>
  );
}
