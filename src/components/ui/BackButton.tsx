import Link from "next/link";

export function BackButton({ href, label = "返回" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2" aria-label={label}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11.5 3.5L6 9L11.5 14.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
