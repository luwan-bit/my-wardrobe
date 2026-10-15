"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [level, setLevel] = useState("medium");
  const [price, setPrice] = useState("");
  const [purpose, setPurpose] = useState("");
  const [saving, setSaving] = useState(false);

  if (!category) return <div className="p-8">分类不存在</div>;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageFile) return alert("请填写名称并上传图片");
    setSaving(true);

    const ext = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("wardrobe-images").upload(fileName, imageFile);
    if (uploadError) {
      alert("图片上传失败：" + uploadError.message);
      setSaving(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("wardrobe-images").getPublicUrl(fileName);

    const { error } = await supabase.from("wishlist").insert({
      name,
      category: category.id,
      image_url: urlData.publicUrl,
      level,
      price,
      purpose,
    });

    setSaving(false);
    if (error) {
      alert("保存失败：" + error.message);
      return;
    }
    router.push(`/wishlist/${slug}`);
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <PageHeader backHref={`/wishlist/${slug}`} backLabel="返回列表" title="ADD WISH" subtitle="添加愿望" />

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="field-label">图片 *</label>
            <input type="file" accept="image/*" onChange={handleImage} />
            {preview && <img src={preview} alt="" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>
          <div>
            <label className="field-label">名称 *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="field-input" required />
          </div>
          <div>
            <label className="field-label">想要程度 *</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="field-input">
              {LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">参考价格</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">入手用途</label>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} className="field-input" rows={3} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "保存中..." : "保存"}
          </button>
        </form>
      </div>
    </main>
  );
}