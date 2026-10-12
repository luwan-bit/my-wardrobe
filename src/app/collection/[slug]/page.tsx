"use client";
export const runtime = 'edge';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type CollectionItem = {
  id: string;
  name: string;
  image_url: string;
  category: string;
};

export default function CollectionCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!category) return;
    supabase
      .from("collections")
      .select("id, name, image_url, category")
      .eq("category", category.id)
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }, [category]);

  if (!category) return <div className="p-8">分类不存在</div>;

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8">
          <BackButton href="/collection" label="返回分类" />
        </div>
        <h1 className="font-serif text-title mb-2">{category.name}</h1>
        <p className="text-caption text-muted mb-8">收藏列表</p>

        {items.length === 0 ? (
          <div className="border border-border p-8 text-center text-muted mb-6 rounded">此分类暂无藏品。</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="border border-border rounded overflow-hidden">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover" />
                )}
                <div className="p-3">
                  <Link href={`/collection/item/${item.id}`} className="text-body hover:underline">{item.name}</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/collection/${slug}/add`}
          className="block w-full bg-[#8A8A8A] text-white py-3.5 text-center text-body rounded hover:bg-[#7A7A7A] transition-colors"
        >
          + 添加藏品
        </Link>
      </div>
    </main>
  );
}