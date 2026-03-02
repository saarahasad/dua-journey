import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/data";

/** Map category id to icon filename in public/icons/ (no .png) */
const CATEGORY_ICON_FILE: Record<string, string> = {
  praise: "praise",
  salawat: "salawat",
  knowledge: "knowledge",
  faith: "faith",
  contentment: "decree",
  parents: "parents",
  children: "children",
  spouse: "spouse",
  "in-salah": "insalah",
  "after-salah": "aftersalah",
  "ease-hardship": "ease",
};

export function CategoryCard({ category }: { category: Category }) {
  const iconFile = CATEGORY_ICON_FILE[category.id];
  return (
    <Link href={`/category/${category.slug}`} className="tap-scale category-card">
      <span className="category-card-icon category-card-icon-img" aria-hidden>
        {iconFile ? (
          <Image
            src={`/icons/${iconFile}.png`}
            alt=""
            width={40}
            height={40}
            className="object-contain"
          />
        ) : (
          <span className="h-2 w-2 rounded-full bg-slate-400" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="category-card-title">{category.title}</h2>
        <p className="category-card-desc">{category.description}</p>
      </div>
    </Link>
  );
}
