"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type Variant = "collection" | "wishlist";

export function CategoryList({ variant }: { variant: Variant }) {
  const basePath = variant === "collection" ? "/collection" : "/wishlist";
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const table = variant === "collection" ? "collections" : "wishlist";
    supabase
      .from(table)
      .select("category")
      .then(({ data }) => {
        const next: Record<string, number> = {};
        (data || []).forEach((row: { category: string }) => {
          next[row.category] = (next[row.category] || 0) + 1;
        });
        setCounts(next);
        setLoaded(true);
      });
  }, [variant]);

  return (
    <div className="flex flex-col">
      {CATEGORIES.map((cat, i) => {
        const count = counts[cat.id] ?? 0;
        const isWish = variant === "wishlist";
        return (
          <Link
            key={cat.id}
            href={`${basePath}/${cat.slug}`}
            className={`group flex items-center justify-between gap-4 py-4 px-3 -mx-1 transition-colors duration-150 active:opacity-70 ${
              isWish
                ? "border border-dashed border-border bg-transparent mb-2 last:mb-0 hover:bg-surface-hover"
                : "border-b border-border hover:bg-surface-hover/60 border-l-2 border-l-foreground/80 pl-[calc(0.75rem-2px)]"
            }`}
          >
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="shrink-0 text-[10px] tracking-[0.14em] text-muted-light tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              {isWish ? (
                <span
                  className="shrink-0 w-3.5 h-3.5 border border-border rounded-sm"
                  aria-hidden
                />
              ) : null}
              <span className="text-body truncate">{cat.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {loaded ? (
                <span className="font-serif text-lg tabular-nums text-muted group-hover:text-foreground transition-colors">
                  {count}
                </span>
              ) : (
                <span className="text-caption text-muted-light">·</span>
              )}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-muted-light group-hover:text-foreground transition-colors" aria-hidden>
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
