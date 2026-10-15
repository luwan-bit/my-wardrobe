"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ImageItem = { id: string; image_url: string; name: string };

const POOL = 8;
/** Pixels per second for continuous auto-scroll */
const AUTO_SPEED = 28;

export function DailyImages() {
  const [pool, setPool] = useState<ImageItem[]>([]);
  const [allItems, setAllItems] = useState<ImageItem[]>([]);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastXRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const shuffle = (arr: ImageItem[], n: number) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  };

  useEffect(() => {
    const load = async () => {
      const { data: col } = await supabase.from("collections").select("id, image_url, name");
      const { data: wish } = await supabase.from("wishlist").select("id, image_url, name");
      const all = [...(col || []), ...(wish || [])].filter((i) => i.image_url);
      setAllItems(all);
      setPool(shuffle(all, POOL));
      setReady(true);
    };
    load();
  }, []);

  const handleRefresh = () => {
    setPool(shuffle(allItems, POOL));
    offsetRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = "translate3d(0,0,0)";
    }
  };

  const track = useMemo(() => {
    if (pool.length === 0) return [];
    // Duplicate for seamless loop
    return [...pool, ...pool];
  }, [pool]);

  const measureHalf = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // Track is duplicated 50/50; half width is one full set
    halfWidthRef.current = el.scrollWidth / 2;
  }, []);

  const wrapOffset = useCallback((raw: number) => {
    const half = halfWidthRef.current;
    if (half <= 0) return raw;
    // Keep offset in (-half, 0] for leftward scroll convention
    let o = raw;
    while (o <= -half) o += half;
    while (o > 0) o -= half;
    return o;
  }, []);

  const applyTransform = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
  }, []);

  // Measure when pool / layout changes
  useEffect(() => {
    if (!ready || pool.length === 0) return;
    measureHalf();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measureHalf());
    ro.observe(el);
    // Images loading can change width
    const imgs = el.querySelectorAll("img");
    const onLoad = () => measureHalf();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onLoad);
    });
    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", onLoad));
    };
  }, [ready, pool, track, measureHalf]);

  // Continuous auto-scroll via rAF; pause only while dragging
  useEffect(() => {
    if (!ready || pool.length === 0) return;

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(64, ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!draggingRef.current && halfWidthRef.current > 0) {
        offsetRef.current = wrapOffset(offsetRef.current - AUTO_SPEED * dt);
        applyTransform();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [ready, pool.length, wrapOffset, applyTransform]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Primary button / touch / pen only
    if (e.button !== 0 && e.pointerType === "mouse") return;
    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    lastXRef.current = e.clientX;
    lastTsRef.current = null; // avoid jump after resume
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    if (dx === 0) return;
    offsetRef.current = wrapOffset(offsetRef.current + dx);
    applyTransform();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    lastTsRef.current = null; // resume smoothly from current offset
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  if (!ready) {
    return (
      <div className="w-full mb-10">
        <div className="h-52 md:h-64 bg-surface-hover animate-pulse" />
      </div>
    );
  }

  if (pool.length === 0) {
    return <div className="text-muted text-center py-12 mb-8 text-caption">还没有图片，去收藏或愿望里添几件吧</div>;
  }

  return (
    <div className="w-full mb-10">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20 z-10 marquee-fade-l" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20 z-10 marquee-fade-r" />

        <div
          ref={trackRef}
          className="marquee-track flex w-max gap-6 md:gap-8 py-1 will-change-transform select-none"
          style={{ touchAction: "pan-y", cursor: "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {track.map((img, idx) => (
            <figure
              key={`${img.id}-${idx}`}
              className="relative shrink-0 w-[72vw] max-w-[420px] md:w-[380px] aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-surface-hover border border-border/60"
            >
              <img
                src={img.image_url}
                alt={img.name}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                draggable={false}
              />
              <figcaption className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                <span className="text-small text-white/90 truncate block tracking-wide">{img.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {allItems.length > POOL && (
        <div className="mt-4 px-6 flex justify-end">
          <button type="button" onClick={handleRefresh} className="link-quiet underline-offset-4 hover:underline active:opacity-70">
            换一批
          </button>
        </div>
      )}
    </div>
  );
}
