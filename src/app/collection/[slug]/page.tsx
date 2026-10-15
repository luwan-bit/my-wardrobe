"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
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
        <PageHeader
          backHref="/collection"
          backLabel="返回分类"
          title={category.name}
          subtitle="收藏列表"
          right={<span>{items.length} 件</span>}
        />

        {items.length === 0 ? (
          <div className="border border-border bg-surface p-10 text-center rounded-md mb-6">
            <p className="text-muted mb-6">此分类暂无藏品。</p>
            <Link href={`/collection/${slug}/add`} className="btn-primary">
              + 添加藏品
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/collection/item/${item.id}`}
                  className="border border-border bg-surface rounded overflow-hidden hover:bg-surface-hover transition-colors"
                >
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover" />
                  )}
                  <div className="p-3">
                    <span className="text-body">{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href={`/collection/${slug}/add`} className="btn-primary w-full">
              + 添加藏品
            </Link>
          </>
        )}
      </div>
    </main>
  );
}