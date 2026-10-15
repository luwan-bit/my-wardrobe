"use client";

import Link from "next/link";

const MODULES = [
  { label: "MY COLLECTION", cn: "我的收藏", path: "/collection", mark: "01" },
  { label: "WISHLIST", cn: "愿望清单", path: "/wishlist", mark: "02" },
  { label: "INSIGHTS", cn: "数据洞察", path: "/insights", mark: "03" },
  { label: "SETTINGS", cn: "设置", path: "/settings", mark: "04" },
];

export function CircularNav() {
  return (
    <nav className="w-full max-w-lg mx-auto" aria-label="Main sections">
      <ul className="flex flex-col border-t border-border">
        {MODULES.map((mod) => (
          <li key={mod.path} className="border-b border-border">
            <Link
              href={mod.path}
              className="group flex items-baseline justify-between gap-4 py-4 px-1 transition-opacity duration-150 active:opacity-70"
            >
              <span className="flex items-baseline gap-3 min-w-0">
                <span className="text-[10px] tracking-[0.14em] text-muted-light tabular-nums shrink-0">
                  {mod.mark}
                </span>
                <span className="font-serif text-sm md:text-base tracking-[0.1em] uppercase group-hover:opacity-70 transition-opacity">
                  {mod.label}
                </span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-caption text-muted">{mod.cn}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-muted-light group-hover:text-foreground transition-colors"
                  aria-hidden
                >
                  <path
                    d="M6 3.5L10.5 8L6 12.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
