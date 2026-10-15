"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mw-splash-seen";
const DURATION_MS = 3000;

export function SplashScreen() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;

    const timer = window.setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore quota / private mode
      }
    }, DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#ffffff" }}
      role="presentation"
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/apple-touch-icon.png"
        alt=""
        width={112}
        height={112}
        className="h-28 w-28 object-contain select-none"
        draggable={false}
      />
      <p className="mt-5 font-serif text-sm tracking-[0.15em] uppercase text-neutral-900">
        MY WARDROBE
      </p>
    </div>
  );
}