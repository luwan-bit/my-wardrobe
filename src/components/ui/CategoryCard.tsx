import Link from "next/link";

export function CategoryCard({ number, name, href }: { number: string; name: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between bg-primary text-primary-fg px-5 py-5 rounded-md hover:bg-primary-hover transition-colors"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-caption opacity-80 tracking-wider">{number}</span>
        <span className="text-body">{name}</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-80">
        <path
          d="M6 3.5L10.5 8L6 12.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}