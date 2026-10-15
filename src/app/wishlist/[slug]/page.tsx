"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type WishlistItem = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  level: string;
};

export default function WishlistCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!category) return;
    supabase
      .from("wishlist")
      .select("id, name, image_url, category, level")
      .eq("category", category.id)
      .then(({ data }) => {
        if (data) {
          const order: Record<string, number> = { certain: 1, medium: 2, like: 3 };
          data.sort((a, b) => (order[a.level] || 9) - (order[b.level] || 9));
          setItems(data);
        }
      });
  }, [category]);

  if (!category) return <div className="p-8">分类不存在</div>;

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <PageHeader
          backHref="/wishlist"
          backLabel="返回分类"
          title={category.name}
          subtitle="愿望列表"
          right={<span>{items.length} 件</span>}
        />

        {items.length === 0 ? (
          <div className="border border-border bg-surface p-10 text-center rounded-md mb-6">
            <p className="text-muted mb-6">此分类暂无愿望。</p>
            <Link href={`/wishlist/${slug}/add`} className="btn-primary">
              + 添加愿望
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/wishlist/item/${item.id}`}
                  className="border border-border bg-surface rounded overflow-hidden hover:bg-surface-hover transition-colors"
                >
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover" />
                  )}
                  <div className="p-3">
                    <span className="text-body block">{item.name}</span>
                    <p className="text-caption text-muted mt-1">
                      {item.level === "certain" ? "确定" : item.level === "medium" ? "中等" : "好感"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href={`/wishlist/${slug}/add`} className="btn-primary w-full">
              + 添加愿望
            </Link>
          </>
        )}
      </div>
    </main>
  );
}