import Link from "next/link";
import type { Category } from "@/lib/data";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="tap-scale card-overlay block p-5 transition-all duration-300 ease-in-out hover:shadow-[0_8px_32px_rgba(107,134,98,0.08)] active:scale-[0.99]"
    >
      <h2 className="text-lg font-semibold text-black">{category.title}</h2>
      <p className="mt-1 text-sm text-sage-600">{category.description}</p>
    </Link>
  );
}
