"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type WishlistItem = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  level: string;
  price?: string;
  purpose?: string;
};

export default function WishlistItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<WishlistItem | null>(null);
  const [confirm, setConfirm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("wishlist")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setItem(data);
      });
  }, [id]);

  if (!item) return <div className="p-8 text-muted">物品不存在</div>;

  const category = CATEGORIES.find((c) => c.id === item.category);

  const handleDelete = async () => {
    await supabase.from("wishlist").delete().eq("id", id);
    router.push(category ? `/wishlist/${category.slug}` : "/wishlist");
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <PageHeader
          backHref={category ? `/wishlist/${category.slug}` : "/wishlist"}
          backLabel="返回列表"
          title={item.name}
          subtitle={category?.name}
        />

        {item.image_url && (
          <img src={item.image_url} alt={item.name} className="w-full max-w-md aspect-square object-cover mb-6 rounded-sm" />
        )}

        <div className="space-y-2 text-body mb-8">
          <p>想要程度：{item.level === "certain" ? "确定" : item.level === "medium" ? "中等" : "好感"}</p>
          {item.price && <p>参考价格：{item.price}</p>}
          {item.purpose && <p>入手用途：{item.purpose}</p>}
        </div>

        <button type="button" onClick={() => setConfirm(true)} className="btn-danger">
          删除
        </button>

        {confirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="modal-panel">
              <p className="mb-4">确定删除「{item.name}」吗？</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setConfirm(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="button" onClick={handleDelete} className="btn-primary flex-1">
                  删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}