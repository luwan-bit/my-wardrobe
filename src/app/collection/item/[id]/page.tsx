"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { getItemById, deleteCollectionItem, CollectionItem } from "@/lib/storage";
import { CATEGORIES } from "@/lib/constants";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<CollectionItem | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setItem(getItemById(id) || null);
  }, [id]);

  if (!item) return <div className="p-8">物品不存在</div>;

  const category = CATEGORIES.find((c) => c.id === item.category);

  const handleDelete = () => {
    deleteCollectionItem(id);
    router.push(category ? `/collection/${category.slug}` : "/collection");
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8">
          <BackButton href={category ? `/collection/${category.slug}` : "/collection"} label="返回列表" />
        </div>

        {item.image && <img src={item.image} alt={item.name} className="w-full max-w-md aspect-square object-cover mb-6" />}
        <h1 className="font-serif text-title mb-2">{item.name}</h1>
        <p className="text-caption text-muted mb-6">{category?.name}</p>

        <div className="space-y-2 text-body mb-8">
          {item.brand && <p>品牌：{item.brand}</p>}
          {item.price && <p>价格：{item.price}</p>}
          {item.notes && <p>备注：{item.notes}</p>}
        </div>

        <div className="flex gap-4">
          <button onClick={() => setConfirm(true)} className="border border-red-500 text-red-600 px-6 py-2 text-sm">
            删除
          </button>
        </div>

        {confirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 max-w-sm w-full mx-4">
              <p className="mb-4">确定删除「{item.name}」吗？</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(false)} className="flex-1 border py-2">取消</button>
                <button onClick={handleDelete} className="flex-1 bg-black text-white py-2">删除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
