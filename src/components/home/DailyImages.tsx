"use client";

import { useEffect, useState } from "react";
import { getCollection } from "@/lib/storage";
import { getWishlist } from "@/lib/wishlist-storage";

export function DailyImages() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const collection = getCollection().filter((i) => i.image).map((i) => i.image);
    const wishlist = getWishlist().filter((i) => i.image).map((i) => i.image);
    const all = [...collection, ...wishlist];
    // 取前 5 张
    setImages(all.slice(0, 5));
  }, []);

  if (images.length === 0) {
    return (
      <section className="w-full max-w-3xl my-10 flex items-center justify-center min-h-[160px]">
        <p className="text-[13px] tracking-wide text-gray-400">每日随机图片</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl my-10 px-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[180px]">
        {images.map((src, i) => {
          // 让第 1 张和第 3 张更大一点
          const isLarge = i === 0 || i === 2;
          return (
            <div
              key={i}
              className={`
                overflow-hidden rounded
                ${isLarge ? "row-span-2" : "row-span-1"}
                ${i === 0 ? "col-span-2 md:col-span-1" : ""}
              `}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}