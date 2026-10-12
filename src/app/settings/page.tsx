"use client";

import { useEffect, useState } from "react";
import { BackButton } from "@/components/ui/BackButton";
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
    const blob = new Blob(
      [JSON.stringify({ collections, wishlist }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-wardrobe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8"><BackButton href="/" /></div>
        <h1 className="font-serif text-title mb-2">SETTINGS</h1>
        <p className="text-caption text-muted mb-10">设置</p>

        <div className="border border-border p-5 rounded flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">深色主题</p>
            <p className="text-caption text-muted mt-1">黑白配色对调</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${dark ? "bg-[#333]" : "bg-[#8A8A8A]"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${dark ? "left-6" : "left-0.5"}`} />
          </button>
        </div>

        <button
          onClick={exportData}
          className="w-full border border-border py-3 rounded text-body hover:bg-gray-50"
        >
          导出数据备份（JSON）
        </button>
      </div>
    </main>
  );
}