import Link from "next/link";
import type { Category } from "@/lib/data";
import praiseIcon from "@/assets/icons/praise.png";
import salawatIcon from "@/assets/icons/salawat.png";
import knowledgeIcon from "@/assets/icons/knowledge.png";
import faithIcon from "@/assets/icons/faith.png";
import decreeIcon from "@/assets/icons/decree.png";
import parentsIcon from "@/assets/icons/parents.png";
import childrenIcon from "@/assets/icons/children.png";
import spouseIcon from "@/assets/icons/spouse.png";
import insalahIcon from "@/assets/icons/insalah.png";
import aftersalahIcon from "@/assets/icons/aftersalah.png";
import easeIcon from "@/assets/icons/ease.png";

/** Map category id to icon filename (no .png) */
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

const ICON_SRC: Record<string, string> = {
  praise: praiseIcon.src,
  salawat: salawatIcon.src,
  knowledge: knowledgeIcon.src,
  faith: faithIcon.src,
  decree: decreeIcon.src,
  parents: parentsIcon.src,
  children: childrenIcon.src,
  spouse: spouseIcon.src,
  insalah: insalahIcon.src,
  aftersalah: aftersalahIcon.src,
  ease: easeIcon.src,
};

export function CategoryCard({ category }: { category: Category }) {
  const iconFile = CATEGORY_ICON_FILE[category.id];
  const iconSrc = iconFile ? ICON_SRC[iconFile] : null;
  return (
    <Link href={`/category/${category.slug}`} className="tap-scale category-card">
      <span className="category-card-icon category-card-icon-img" aria-hidden>
        {iconSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconSrc}
            alt=""
            width={40}
            height={40}
            className="category-card-icon-img object-contain w-10 h-10"
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
