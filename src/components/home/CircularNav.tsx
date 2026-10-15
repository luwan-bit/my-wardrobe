"use client";

import Link from "next/link";

const MODULES = [
  { label: "MY COLLECTION", cn: "我的收藏", path: "/collection" },
  { label: "WISHLIST", cn: "愿望清单", path: "/wishlist" },
  { label: "INSIGHTS", cn: "数据洞察", path: "/insights" },
  { label: "SETTINGS", cn: "设置", path: "/settings" },
];

export function CircularNav() {
  return (
    <nav className="w-full max-w-md mx-auto" aria-label="Main sections">
      <ul className="grid grid-cols-2 gap-3">
        {MODULES.map((mod) => (
          <li key={mod.path}>
            <Link
              href={mod.path}
              className="group flex flex-col items-start justify-between min-h-[96px] border border-border bg-surface px-4 py-4 rounded-md transition-colors hover:bg-surface-hover hover:border-foreground"
            >
              <span className="font-serif text-sm tracking-[0.08em] uppercase">{mod.label}</span>
              <span className="mt-3 flex w-full items-center justify-between">
                <span className="text-caption text-muted">{mod.cn}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-muted group-hover:text-foreground transition-colors"
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