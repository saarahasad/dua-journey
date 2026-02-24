import { notFound } from "next/navigation";
import Link from "next/link";
import {
  categories,
  getCategoryBySlug,
  getDuasByCategoryId,
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

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md px-4 py-8">
        <Link
          href="/"
          className="text-overlay mb-6 inline-block text-sage-600 hover:text-black"
        >
          ← Back
        </Link>
        <header className="mb-8 text-center">
          <h1 className="text-overlay text-2xl font-semibold text-black">
            {category.title}
          </h1>
          <p className="text-overlay mt-2 text-sage-600">{category.description}</p>
        </header>
        <div className="space-y-4">
          {categoryDuas.length === 0 ? (
            <p className="card-overlay p-6 text-center text-sage-600">
              No duas in this category yet. Add them via duas.json.
            </p>
          ) : (
            categoryDuas.map((dua) => (
              <DuaCardWithStatus key={dua.id} dua={dua} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
