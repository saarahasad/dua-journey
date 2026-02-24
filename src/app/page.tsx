import Link from "next/link";
import { categories } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md px-4 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-overlay text-2xl font-semibold text-black">Dua Journey</h1>
          <p className="text-overlay mt-2 text-sage-600">
          Strengthen your connection with Allah through structured dua memorisation.          </p>
          <Link
            href="/progress"
            className="text-overlay mt-4 inline-block text-sm text-sage-600 underline decoration-dotted underline-offset-1 hover:text-sage-800"
          >
            My progress – memorised duas
          </Link>
        </header>
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
