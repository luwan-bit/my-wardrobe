import { PageHeader } from "@/components/ui/PageHeader";
import { CategoryList } from "@/components/ui/CategoryList";

export default function WishlistPage() {
  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <PageHeader backHref="/" backLabel="返回首页" title="WISHLIST" subtitle="愿望清单" />
        <CategoryList variant="wishlist" />
      </div>
    </main>
  );
}