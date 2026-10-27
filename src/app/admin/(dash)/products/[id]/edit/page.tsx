import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm, DeleteProductButton } from "@/components/admin/product-form";
import { parseList } from "@/lib/data";

export const metadata = { title: "Edit Product" };

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Editing <span className="font-medium text-foreground">{product.title}</span> ·{" "}
            <span className={product.status === "PUBLISHED" ? "text-sage-deep" : "text-terracotta"}>
              {product.status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          </p>
        </div>
        <DeleteProductButton productId={product.id} productTitle={product.title} />
      </header>

      <ProductForm
        mode="edit"
        productId={product.id}
        initial={{
          title: product.title,
          slug: product.slug,
          shortDescription: product.shortDescription ?? "",
          description: product.description,
          images: parseList(product.images),
          pinterestImage: product.pinterestImage ?? "",
          imageAlt: product.imageAlt ?? "",
          categoryId: product.categoryId ?? "",
          subcategory: product.subcategory ?? "",
          amazonUrl: product.amazonUrl,
          asin: product.asin ?? "",
          price: product.price ?? "",
          features: parseList(product.features).join("\n"),
          pros: parseList(product.pros).join("\n"),
          cons: parseList(product.cons).join("\n"),
          featured: product.featured,
          status: product.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          seoTitle: product.seoTitle ?? "",
          seoDescription: product.seoDescription ?? "",
        }}
      />
    </div>
  );
}
