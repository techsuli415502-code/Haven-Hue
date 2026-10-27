import { Breadcrumbs } from "./breadcrumbs";

/** Shared layout for policy/legal pages. */
export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-10 lg:py-14">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-medium sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <p className="mt-4 leading-7 text-muted-foreground">{intro}</p>
      </header>
      <div className="max-w-3xl">{children}</div>
    </div>
  );
}

/** Simple section heading + body blocks for legal pages. */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-medium">{title}</h2>
      <div className="space-y-3 leading-7 text-foreground/85">{children}</div>
    </section>
  );
}
