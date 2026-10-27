import { ProductsTable } from "@/components/admin/products-table";

export const metadata = { title: "Products" };

type SearchParams = Promise<{ status?: string }>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, edit, publish and organize the decor finds shown on the public shop.
        </p>
      </header>
      <ProductsTable initialStatus={status} />
    </div>
  );
}
