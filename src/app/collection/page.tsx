import { PageHeader } from "@/components/ui/PageHeader";
import { CategoryList } from "@/components/ui/CategoryList";

export default function CollectionPage() {
  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12 page-fade">
        <PageHeader backHref="/" backLabel="返回首页" title="MY COLLECTION" subtitle="我的收藏" />
        <CategoryList variant="collection" />
      </div>
    </main>
  );
}