import { categories } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { ProgressLinkCard } from "@/components/ProgressLinkCard";
import { PersonalDuaDropdown } from "@/components/PersonalDuaDropdown";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md px-5 py-10">
        <header className="mb-5">
          <div className="hero-card">
            <p
              className="hero-arabic font-uthmanic text-center font-bold"
              dir="rtl"
              lang="ar"
            >
              وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ
            </p>
            <p className="hero-translation mt-6 text-center font-bold leading-relaxed">
              When My servants ask about Me, surely I am near.
            </p>
          </div>
        </header>
        <div className="space-y-3">
          <ProgressLinkCard />
          <PersonalDuaDropdown />
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
