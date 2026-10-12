"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ImageItem = { id: string; image_url: string; name: string };

export function DailyImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [allItems, setAllItems] = useState<ImageItem[]>([]);
  const supabase = createClient();

  const shuffle = (arr: ImageItem[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 4);
  };

  useEffect(() => {
    const load = async () => {
      const { data: col } = await supabase.from("collections").select("id, image_url, name");
      const { data: wish } = await supabase.from("wishlist").select("id, image_url, name");
      const all = [...(col || []), ...(wish || [])].filter((i) => i.image_url);
      setAllItems(all);
      setImages(shuffle(all));
    };
    load();
  }, []);

  const handleRefresh = () => {
    setImages(shuffle(allItems));
  };

  if (images.length === 0) return <div className="text-muted text-center py-12">暂无图片</div>;

  return (
    <div className="w-full max-w-2xl mx-auto px-5 mb-12">
      <div className="space-y-6">
        {images.map((img) => (
          <div key={img.id} className="w-full">
            <img src={img.image_url} alt={img.name} className="w-full h-auto object-contain" />
          </div>
        ))}
      </div>
      <button
        onClick={handleRefresh}
        className="mt-6 mx-auto block border border-[#8A8A8A] text-[#333] px-6 py-2 text-sm rounded hover:bg-gray-50"
      >
        换一批
      </button>
    </div>
  );
}