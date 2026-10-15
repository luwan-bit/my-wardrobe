"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
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
                {item.image_url && <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover" />}
                <div className="p-3">
                  <Link href={`/wishlist/item/${item.id}`} className="text-body hover:underline">{item.name}</Link>
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
          className="block w-full bg-[#8A8A8A] text-white py-3.5 text-center text-body rounded hover:bg-[#7A7A7A] transition-colors"
        >
          + 添加愿望
        </Link>
      </div>
    </main>
  );
}