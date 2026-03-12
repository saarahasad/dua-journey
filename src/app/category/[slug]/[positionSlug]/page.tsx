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
  const params: { slug: string; positionSlug: string }[] = Array.from(positionSlugs).map(
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
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-2 sm:px-4 lg:max-w-2xl">
        <div className="sticky top-0 z-10 shrink-0 bg-white pb-4 pt-4">
          <Link
            href={`/category/${category.slug}`}
            className="text-overlay mb-4 inline-block text-sage-600 hover:text-black"
          >
            ← Back to {category.title}
          </Link>
          <header className="text-center">
            <h1 className="text-overlay text-2xl font-semibold text-black">
              {positionName}
            </h1>
            <p className="text-overlay mt-2 text-sage-600">
              {positionName === "Other" ? "Other duas in salah." : `Duas recited ${positionName.toLowerCase()}.`}
            </p>
          </header>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="card-overlay p-4">
        <div className="space-y-4">
          {duas.length === 0 ? (
            <p className="text-center text-sage-600">
              No duas in this position yet.
            </p>
          ) : (
            duas.map((dua, i) => <DuaCardWithStatus key={dua.id} dua={dua} number={i + 1} />)
          )}
        </div>
        </div>
        </div>
      </div>
    </main>
  );
}
