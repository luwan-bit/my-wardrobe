"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ImageItem = { id: string; image_url: string; name: string };

const POOL = 8;

export function DailyImages() {
  const [pool, setPool] = useState<ImageItem[]>([]);
  const [allItems, setAllItems] = useState<ImageItem[]>([]);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  const shuffle = (arr: ImageItem[], n: number) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  };

  useEffect(() => {
    const load = async () => {
      const { data: col } = await supabase.from("collections").select("id, image_url, name");
      const { data: wish } = await supabase.from("wishlist").select("id, image_url, name");
      const all = [...(col || []), ...(wish || [])].filter((i) => i.image_url);
      setAllItems(all);
      setPool(shuffle(all, POOL));
      setReady(true);
    };
    load();
  }, []);

  const handleRefresh = () => {
    setPool(shuffle(allItems, POOL));
  };

  const track = useMemo(() => {
    if (pool.length === 0) return [];
    // Duplicate for seamless loop
    return [...pool, ...pool];
  }, [pool]);

  if (!ready) {
    return (
      <div className="w-full mb-10">
        <div className="h-52 md:h-64 bg-surface-hover animate-pulse" />
      </div>
    );
  }

  if (pool.length === 0) {
    return <div className="text-muted text-center py-12 mb-8">暂无图片</div>;
  }

  return (
    <div className="w-full mb-10">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="marquee-track flex w-max gap-4 md:gap-5 animate-marquee py-1">
          {track.map((img, idx) => (
            <figure
              key={`${img.id}-${idx}`}
              className="relative shrink-0 w-[72vw] max-w-[420px] md:w-[380px] aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-surface-hover"
            >
              <img
                src={img.image_url}
                alt={img.name}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <figcaption className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent">
                <span className="text-small text-white/90 truncate block tracking-wide">{img.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {allItems.length > POOL && (
        <button type="button" onClick={handleRefresh} className="btn-chrome mt-5 mx-auto block text-xs tracking-wide">
          换一批
        </button>
      )}
    </div>
  );
}