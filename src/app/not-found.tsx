import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      <p className="eyebrow mb-3">404 — page not found</p>
      <h1 className="font-display text-4xl font-medium sm:text-5xl">This room is empty</h1>
      <p className="mt-4 max-w-md leading-7 text-muted-foreground">
        The page you&apos;re looking for was moved, renamed, or never existed. Let&apos;s get you back to
        something beautiful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-sage">
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
        <Link href="/shop" className="btn-outline">
          <Search className="h-4 w-4" aria-hidden="true" />
          Browse decor finds
        </Link>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <Link href="/categories" className="hover:text-sage-deep">Categories</Link>
        <Link href="/blog" className="hover:text-sage-deep">Blog</Link>
        <Link href="/about" className="hover:text-sage-deep">About</Link>
        <Link href="/contact" className="hover:text-sage-deep">Contact</Link>
      </div>
    </div>
  );
}
