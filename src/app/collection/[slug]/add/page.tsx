"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function AddItemPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const supabase = createClient();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!category) return <div className="p-8">分类不存在</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return alert("请填写名称并上传图片");
    setLoading(true);

    const ext = image.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("wardrobe-images").upload(fileName, image);

    if (uploadError) {
      alert("图片上传失败：" + uploadError.message);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("wardrobe-images").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("collections").insert({
      name,
      category: category.id,
      image_url: publicUrl,
      brand,
      price,
      notes,
    });

    setLoading(false);
    if (insertError) {
      alert("保存失败：" + insertError.message);
    } else {
      router.push(`/collection/${slug}`);
    }
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <PageHeader backHref={`/collection/${slug}`} backLabel="返回列表" title="ADD ITEM" subtitle="添加藏品" />

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="field-label">图片 *</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="field-label">名称 *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="field-input" required />
          </div>
          <div>
            <label className="field-label">品牌</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">购买价格</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">备注</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="field-input" rows={3} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "保存中..." : "保存"}
          </button>
        </form>
      </div>
    </main>
  );
}