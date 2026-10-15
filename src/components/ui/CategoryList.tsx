"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type Variant = "collection" | "wishlist";

const VARIANT_META: Record<
  Variant,
  { basePath: string; badge: string; tone: string }
> = {
  collection: {
    basePath: "/collection",
    badge: "COL",
    tone: "bg-primary text-primary-fg hover:bg-primary-hover",
  },
  wishlist: {
    basePath: "/wishlist",
    badge: "WISH",
    tone: "border border-border bg-surface text-foreground hover:bg-surface-hover",
  },
};

export function CategoryList({ variant }: { variant: Variant }) {
  const meta = VARIANT_META[variant];
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
    <div className="flex flex-col gap-3">
      {CATEGORIES.map((cat, i) => {
        const count = counts[cat.id] ?? 0;
        return (
          <Link
            key={cat.id}
            href={`${meta.basePath}/${cat.slug}`}
            className={`group flex items-center justify-between px-5 py-5 rounded-md transition-colors ${meta.tone}`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <span
                className={`shrink-0 text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 rounded border ${
                  variant === "collection"
                    ? "border-white/30 text-white/80 dark:border-black/30 dark:text-black/70"
                    : "border-border text-muted"
                }`}
              >
                {meta.badge}
              </span>
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-caption opacity-70 tracking-wider">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body truncate">{cat.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {loaded ? (
                <span className="text-caption opacity-80 tabular-nums">{count}</span>
              ) : (
                <span className="text-caption opacity-40">·</span>
              )}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70">
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