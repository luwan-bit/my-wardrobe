"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { CATEGORIES } from "@/lib/constants";
import { addWishlistItem } from "@/lib/wishlist-storage";

const LEVELS = [
  { id: "certain", label: "确定" },
  { id: "medium", label: "中等" },
  { id: "like", label: "好感" },
];

export default function AddWishPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const category = CATEGORIES.find((c) => c.slug === slug);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [level, setLevel] = useState("medium");
  const [price, setPrice] = useState("");
  const [purpose, setPurpose] = useState("");

  if (!category) return <div className="p-8">分类不存在</div>;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return alert("请填写名称并上传图片");
    addWishlistItem({
      name,
      category: category.id,
      image,
      level: level as any,
      price,
      purpose,
    });
    router.push(`/wishlist/${slug}`);
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8">
          <BackButton href={`/wishlist/${slug}`} label="返回列表" />
        </div>
        <h1 className="font-serif text-title mb-8">添加愿望</h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="block text-caption mb-1">图片 *</label>
            <input type="file" accept="image/*" onChange={handleImage} />
            {image && <img src={image} alt="" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>
          <div>
            <label className="block text-caption mb-1">名称 *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-caption mb-1">想要程度 *</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border border-border px-3 py-2 rounded">
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-caption mb-1">参考价格</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-caption mb-1">入手用途</label>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full border border-border px-3 py-2 rounded" rows={3} />
          </div>
          <button type="submit" className="w-full bg-[#333333] text-white py-3 text-sm rounded">
            保存
          </button>
        </form>
      </div>
    </main>
  );
}