import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm, emptyProduct, DeleteProductButton } from "@/components/admin/product-form";
import { parseList } from "@/lib/data";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  if (!categories) notFound();

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
