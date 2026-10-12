"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ImageItem = { id: string; image_url: string; name: string };

export function DailyImages() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: col } = await supabase.from("collections").select("id, image_url, name");
      const { data: wish } = await supabase.from("wishlist").select("id, image_url, name");
      const all = [...(col || []), ...(wish || [])].filter((i) => i.image_url);
      const today = new Date().toISOString().slice(0, 10);
      const seed = today.split("-").reduce((a, b) => a + parseInt(b), 0);
      const shuffled = all.sort((a, b) => ((a.id.charCodeAt(0) + seed) % 100) - ((b.id.charCodeAt(0) + seed) % 100));
      setImages(shuffled.slice(0, 4));
    };
    load();
  }, []);

  if (images.length === 0) return <div className="text-muted text-center py-12">暂无图片</div>;

  return (
    <div className="w-full max-w-2xl mx-auto px-5 mb-12 space-y-6">
      {images.map((img) => (
        <div key={img.id} className="w-full">
          <img
            src={img.image_url}
            alt={img.name}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
}