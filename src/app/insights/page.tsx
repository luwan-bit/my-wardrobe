"use client";

import { useEffect, useState } from "react";
import { BackButton } from "@/components/ui/BackButton";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

export default function InsightsPage() {
  const [stats, setStats] = useState({
    totalCollection: 0,
    totalWishlist: 0,
    byCategory: [] as { name: string; count: number }[],
  });
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: col } = await supabase.from("collections").select("category");
      const { data: wish } = await supabase.from("wishlist").select("id");
      const counts: Record<string, number> = {};
      (col || []).forEach((item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
      const byCategory = CATEGORIES.map((c) => ({
        name: c.name,
        count: counts[c.id] || 0,
      })).filter((c) => c.count > 0);
      setStats({
        totalCollection: col?.length || 0,
        totalWishlist: wish?.length || 0,
        byCategory,
      });
    };
    load();
  }, []);

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8"><BackButton href="/" /></div>
        <h1 className="font-serif text-title mb-2">INSIGHTS</h1>
        <p className="text-caption text-muted mb-10">个人洞察</p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="border border-border p-5 rounded">
            <p className="text-caption text-muted">收藏数量</p>
            <p className="text-3xl font-serif mt-1">{stats.totalCollection}</p>
          </div>
          <div className="border border-border p-5 rounded">
            <p className="text-caption text-muted">愿望数量</p>
            <p className="text-3xl font-serif mt-1">{stats.totalWishlist}</p>
          </div>
        </div>

        <h2 className="font-serif text-lg mb-4">分类分布</h2>
        {stats.byCategory.length === 0 ? (
          <div className="border border-border p-8 text-center text-muted rounded">暂无收藏</div>
        ) : (
          <div className="space-y-3">
            {stats.byCategory.map((c) => (
              <div key={c.name} className="flex justify-between border-b border-border pb-2">
                <span>{c.name}</span>
                <span className="text-muted">{c.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}