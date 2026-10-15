"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const exportData = async () => {
    const { data: collections } = await supabase.from("collections").select("*");
    const { data: wishlist } = await supabase.from("wishlist").select("*");
    const blob = new Blob([JSON.stringify({ collections, wishlist }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-wardrobe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12 page-fade">
        <PageHeader backHref="/" backLabel="返回首页" title="SETTINGS" subtitle="设置" />

        <div className="border border-border bg-surface p-5 rounded-sm flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">深色模式</p>
            <p className="text-caption text-muted mt-1">黑白配色切换</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={dark}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              dark ? "bg-primary" : "bg-chrome"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                dark ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <button type="button" onClick={exportData} className="btn-secondary w-full">
          导出数据备份（JSON）
        </button>
      </div>
    </main>
  );
}