import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { CATEGORIES } from "@/lib/constants";

export default function WishlistPage() {
  return (
    <main className="min-h-dvh">
      <div className="max-w-page mx-auto px-5 pt-6 pb-12">
        <div className="flex items-center mb-8"><BackButton href="/" /></div>
        <h1 className="font-serif text-title mb-2">WISHLIST</h1>
        <p className="text-caption text-muted mb-10">愿望清单</p>
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/wishlist/${c.slug}`}
              className="block border border-border p-5 rounded hover:bg-gray-50"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}