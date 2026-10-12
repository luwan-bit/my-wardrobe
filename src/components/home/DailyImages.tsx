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
      setImages(shuffled.slice(0, 5));
    };
    load();
  }, []);

  if (images.length === 0) return <div className="text-muted text-center py-12">暂无图片</div>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-12">
      <div className="grid grid-cols-2 gap-3 md:gap-5">
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`${i === 0 ? "col-span-2" : ""} ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
          >
            <img
              src={img.image_url}
              alt={img.name}
              className="w-full object-cover rounded-sm"
              style={{ aspectRatio: i === 0 ? "4/3" : "1/1" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}