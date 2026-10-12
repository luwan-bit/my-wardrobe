"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestPage() {
  const [status, setStatus] = useState("正在连接...");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("collections").select("id").limit(1).then(({ error }) => {
      if (error) {
        setStatus("连接失败：" + error.message);
      } else {
        setStatus("连接成功！Supabase 已通");
      }
    });
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-xl mb-4">Supabase 测试</h1>
      <p>{status}</p>
    </div>
  );
}