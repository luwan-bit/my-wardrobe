"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/constants";

export default function InsightsPage() {
  const [stats, setStats] = useState({
    totalCollection: 0,
    totalWishlist: 0,
    byCategory: [] as { id: string; name: string; slug: string; count: number }[],
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
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: counts[c.id] || 0,
      }));
      setStats({
        totalCollection: col?.length || 0,
        totalWishlist: wish?.length || 0,
        byCategory,
      });
    };
    load();
  }, []);

  const maxCount = Math.max(1, ...stats.byCategory.map((c) => c.count));

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12 page-fade">
        <PageHeader backHref="/" backLabel="返回首页" title="INSIGHTS" subtitle="数据洞察" />

        <div className="grid grid-cols-2 gap-4 mb-12">
          <Link
            href="/collection"
            className="border border-border bg-surface p-6 rounded-sm hover:bg-surface-hover transition-colors duration-150 active:opacity-80"
          >
            <p className="text-caption text-muted tracking-wide uppercase">收藏总数</p>
            <p className="font-serif text-5xl md:text-6xl leading-none mt-3 tabular-nums tracking-tight">
              {stats.totalCollection}
            </p>
          </Link>
          <Link
            href="/wishlist"
            className="border border-border bg-surface p-6 rounded-sm hover:bg-surface-hover transition-colors duration-150 active:opacity-80"
          >
            <p className="text-caption text-muted tracking-wide uppercase">愿望总数</p>
            <p className="font-serif text-5xl md:text-6xl leading-none mt-3 tabular-nums tracking-tight">
              {stats.totalWishlist}
            </p>
          </Link>
        </div>

        <h2 className="font-serif text-lg mb-5 tracking-wide">分类分布</h2>
        <div className="space-y-1">
          {stats.byCategory.map((c) => {
            const pct = Math.round((c.count / maxCount) * 100);
            return (
              <Link
                key={c.id}
                href={`/collection/${c.slug}`}
                className="flex items-center gap-3 md:gap-4 border-b border-border py-3.5 hover:bg-surface-hover px-1 -mx-1 transition-colors duration-150 active:opacity-70"
              >
                <span className="text-body flex-1 min-w-0 truncate">{c.name}</span>
                <div
                  className="w-16 sm:w-24 md:w-32 h-[2px] bg-border relative shrink-0 overflow-hidden"
                  aria-hidden
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-foreground/75"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span
                  className={`font-serif text-2xl tabular-nums w-10 text-right shrink-0 ${
                    c.count === 0 ? "text-muted-light" : "text-foreground"
                  }`}
                >
                  {c.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
