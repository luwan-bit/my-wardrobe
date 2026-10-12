"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { CATEGORIES } from "@/lib/constants";
import { getWishlist, WishlistItem } from "@/lib/wishlist-storage";

export default function WishlistCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!category) return;
    const all = getWishlist().filter((i) => i.category === category.id);
    const order = { certain: 1, medium: 2, like: 3 };
    all.sort((a, b) => (order[a.level] || 9) - (order[b.level] || 9));
    setItems(all);
  }, [category]);

  if (!category) return <div className="p-8">分类不存在</div>;

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8">
          <BackButton href="/wishlist" label="返回分类" />
        </div>
        <h1 className="font-serif text-title mb-2">{category.name}</h1>
        <p className="text-caption text-muted mb-8">愿望列表</p>

        {items.length === 0 ? (
          <div className="border border-border p-8 text-center text-muted mb-6 rounded">此分类暂无愿望。</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="border border-border rounded overflow-hidden">
                {item.image && <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" />}
                <div className="p-3">
                  <p className="text-body">{item.name}</p>
                  <p className="text-caption text-muted mt-1">
                    {item.level === "certain" ? "确定" : item.level === "medium" ? "中等" : "好感"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/wishlist/${slug}/add`}
          className="block w-full border border-[#333333] text-[#333333] py-3.5 text-center text-body rounded hover:bg-gray-50"
        >
          + 添加愿望
        </Link>
      </div>
    </main>
  );
}