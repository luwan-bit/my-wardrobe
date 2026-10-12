"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
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

  if (!item) return <div className="p-8">物品不存在</div>;

  const category = CATEGORIES.find((c) => c.id === item.category);

  const handleDelete = async () => {
    await supabase.from("wishlist").delete().eq("id", id);
    router.push(category ? `/wishlist/${category.slug}` : "/wishlist");
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8">
          <BackButton href={category ? `/wishlist/${category.slug}` : "/wishlist"} label="返回列表" />
        </div>

        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full max-w-md aspect-square object-cover mb-6" />}
        <h1 className="font-serif text-title mb-2">{item.name}</h1>
        <p className="text-caption text-muted mb-6">{category?.name}</p>

        <div className="space-y-2 text-body mb-8">
          <p>想要程度：{item.level === "certain" ? "确定" : item.level === "medium" ? "中等" : "好感"}</p>
          {item.price && <p>参考价格：{item.price}</p>}
          {item.purpose && <p>入手用途：{item.purpose}</p>}
        </div>

        <div className="flex gap-4">
          <button onClick={() => setConfirm(true)} className="border border-red-500 text-red-600 px-6 py-2 text-sm rounded">
            删除
          </button>
        </div>

        {confirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 max-w-sm w-full mx-4 rounded">
              <p className="mb-4">确定删除「{item.name}」吗？</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(false)} className="flex-1 border py-2 rounded">取消</button>
                <button onClick={handleDelete} className="flex-1 bg-black text-white py-2 rounded">删除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}