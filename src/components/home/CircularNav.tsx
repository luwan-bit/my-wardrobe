"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const MODULES = [
  { label: "MY COLLECTION", path: "/collection" },
  { label: "WISHLIST", path: "/wishlist" },
  { label: "INSIGHTS", path: "/insights" },
  { label: "SETTINGS", path: "/settings" },
];

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSector(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} Z`;
}

export function CircularNav() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const rotation = -index * 90 - 45;
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 120;

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent mb-1"
        style={{ borderTopColor: isDark ? "#ffffff" : "#000000" }}
      />
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transition-transform duration-500 ease-out" style={{ transform: `rotate(${rotation}deg)` }}>
          {MODULES.map((mod, i) => {
            const isSelected = i === index;
            const start = i * 90;
            const mid = start + 45;
            const labelPos = polarToCartesian(cx, cy, r * 0.62, mid);
            return (
              <g key={mod.path} onClick={() => (isSelected ? router.push(mod.path) : setIndex(i))} className="cursor-pointer">
                <path
                  d={describeSector(cx, cy, r, start, start + 90)}
                  fill={isSelected ? "#111" : "transparent"}
                  stroke="#e5e5e5"
                  strokeWidth="2.5"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? "#fff" : "#6b6b6b"}
                  fontSize="11"
                  letterSpacing="0.05em"
                  transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                  className="pointer-events-none uppercase"
                >
                  {mod.label}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="28" fill="white" stroke="#e5e5e5" strokeWidth="2" />
        </svg>
      </div>
      <p className="mt-6 text-sm text-gray-700 dark:text-gray-300">{MODULES[index].label}</p>
      <p className="mt-1 text-xs text-gray-400">点击已选扇区进入</p>
    </div>
  );
}