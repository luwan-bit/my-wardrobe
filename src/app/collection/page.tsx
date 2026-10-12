import { BackButton } from "@/components/ui/BackButton";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { CATEGORIES } from "@/lib/constants";

export default function CollectionPage() {
  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8">
          <BackButton href="/" label="返回首页" />
        </div>
        <h1 className="font-serif text-title mb-2">MY COLLECTION</h1>
        <p className="text-caption text-muted mb-10">我的收藏</p>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} number={String(i + 1).padStart(2, "0")} name={cat.name} href={`/collection/${cat.slug}`} />
          ))}
        </div>
      </div>
    </main>
  );
}
