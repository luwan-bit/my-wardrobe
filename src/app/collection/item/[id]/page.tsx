"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type CollectionItem = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  brand?: string;
  price?: string;
  notes?: string;
};

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<CollectionItem | null>(null);
  const [confirm, setConfirm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("collections")
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
    await supabase.from("collections").delete().eq("id", id);
    router.push(category ? `/collection/${category.slug}` : "/collection");
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8">
          <BackButton href={category ? `/collection/${category.slug}` : "/collection"} label="返回列表" />
        </div>

        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full max-w-md aspect-square object-cover mb-6" />}
        <h1 className="font-serif text-title mb-2">{item.name}</h1>
        <p className="text-caption text-muted mb-6">{category?.name}</p>

        <div className="space-y-2 text-body mb-8">
          {item.brand && <p>品牌：{item.brand}</p>}
          {item.price && <p>价格：{item.price}</p>}
          {item.notes && <p>备注：