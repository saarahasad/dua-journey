import { notFound } from "next/navigation";
import Link from "next/link";
import {
  categories,
  getCategoryBySlug,
  getDuasByCategoryId,
  getSalahPositionCategories,
  getDuasInSalahWithoutPosition,
  getSalahPositionSlug,
} from "@/lib/data";
import { DuaCardWithStatus } from "@/components/DuaCardWithStatus";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryDuas = getDuasByCategoryId(category.id);
  const isSalah = category.id === "in-salah";
  const salahPositions = isSalah ? getSalahPositionCategories(category.id) : [];
  const duasWithoutPosition = isSalah ? getDuasInSalahWithoutPosition(category.id) : [];
  const hasSubPages = isSalah && (salahPositions.length > 0 || duasWithoutPosition.length > 0);

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-2 sm:px-4 lg:max-w-2xl">
        <div className="sticky top-0 z-10 shrink-0 bg-white pb-4 pt-4">
          <Link
            href="/"
            className="text-overlay mb-4 inline-block text-sage-600 hover:text-black"
          >
            ← Back
          </Link>
          <header className="text-center">
            <h1 className="text-overlay text-2xl font-semibold text-black">
              {category.title}
            </h1>
            <p className="text-overlay mt-2 text-sage-600">{category.description}</p>
          </header>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {categoryDuas.length === 0 ? (
            <p className="text-center text-sage-600">
              No duas in this category yet. Add them via duas.json.
            </p>
          ) : hasSubPages ? (
            <ul className="space-y-2">
              {salahPositions.map((position) => (
                <li key={position}>
                  <Link
                    href={`/category/${category.slug}/${getSalahPositionSlug(position)}`}
                    className="block rounded-xl border border-[#b25d82]/20 p-4 text-left text-black transition hover:border-[#b25d82]/40 hover:bg-[#b25d82]/5"
                  >
                    <span className="font-medium">{position}</span>
                  </Link>
                </li>
              ))}
              {duasWithoutPosition.length > 0 && (
                <li>
                  <Link
                    href={`/category/${category.slug}/other`}
                    className="block rounded-xl border border-[#b25d82]/20 p-4 text-left text-black transition hover:border-[#b25d82]/40 hover:bg-[#b25d82]/5"
                  >
                    <span className="font-medium">Other</span>
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            categoryDuas.map((dua, i) => (
              <DuaCardWithStatus key={dua.id} dua={dua} number={i + 1} />
            ))
          )}
        </div>
        </div>
      </div>
    </main>
  );
}
