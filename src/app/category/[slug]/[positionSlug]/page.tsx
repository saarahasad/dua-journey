import { notFound } from "next/navigation";
import Link from "next/link";
import {
  categories,
  duas,
  getCategoryBySlug,
  getSalahPositionCategories,
  getSalahPositionBySlug,
  getSalahPositionSlug,
  getDuasByCategoryIdAndSalahPosition,
  getDuasInSalahWithoutPosition,
} from "@/lib/data";
import { DuaCardWithStatus } from "@/components/DuaCardWithStatus";

export function generateStaticParams() {
  const inSalah = categories.find((c) => c.id === "in-salah");
  if (!inSalah) return [];
  // Build position slugs directly from duas so static export has every linked page
  const positionSlugs = new Set<string>();
  for (const d of duas) {
    if (d.categoryId !== "in-salah") continue;
    if (d.salahPositionCategories) {
      for (const pos of d.salahPositionCategories) {
        positionSlugs.add(getSalahPositionSlug(pos));
      }
    }
  }
  const params: { slug: string; positionSlug: string }[] = [...positionSlugs].map(
    (positionSlug) => ({ slug: inSalah.slug, positionSlug })
  );
  const hasOther = duas.some(
    (d) =>
      d.categoryId === "in-salah" &&
      (!d.salahPositionCategories || d.salahPositionCategories.length === 0)
  );
  if (hasOther) params.push({ slug: inSalah.slug, positionSlug: "other" });
  return params;
}

interface PageProps {
  params: Promise<{ slug: string; positionSlug: string }>;
}

export default async function SalahPositionPage({ params }: PageProps) {
  const { slug, positionSlug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category || category.id !== "in-salah") notFound();

  const positionName = getSalahPositionBySlug(category.id, positionSlug);
  if (!positionName) notFound();

  const duas =
    positionName === "Other"
      ? getDuasInSalahWithoutPosition(category.id)
      : getDuasByCategoryIdAndSalahPosition(category.id, positionName);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md px-4 py-8">
        <Link
          href={`/category/${category.slug}`}
          className="text-overlay mb-6 inline-block text-sage-600 hover:text-black"
        >
          ← Back to {category.title}
        </Link>
        <header className="mb-8 text-center">
          <h1 className="text-overlay text-2xl font-semibold text-black">
            {positionName}
          </h1>
          <p className="text-overlay mt-2 text-sage-600">
            {positionName === "Other" ? "Other duas in salah." : `Duas recited ${positionName.toLowerCase()}.`}
          </p>
        </header>
        <div className="space-y-4">
          {duas.length === 0 ? (
            <p className="card-overlay p-6 text-center text-sage-600">
              No duas in this position yet.
            </p>
          ) : (
            duas.map((dua) => <DuaCardWithStatus key={dua.id} dua={dua} />)
          )}
        </div>
      </div>
    </main>
  );
}
