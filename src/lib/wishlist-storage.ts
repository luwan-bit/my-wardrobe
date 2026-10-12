export type WishlistItem = {
  id: string;
  name: string;
  category: string;
  image: string;
  level: "certain" | "medium" | "like";
  price?: string;
  platform?: string;
  purpose?: string;
  createdAt: number;
};

const KEY = "my-wardrobe-wishlist";

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addWishlistItem(item: Omit<WishlistItem, "id" | "createdAt">) {
  const items = getWishlist();
  const newItem: WishlistItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  items.unshift(newItem);
  saveWishlist(items);
  return newItem;
}

export function deleteWishlistItem(id: string) {
  saveWishlist(getWishlist().filter((i) => i.id !== id));
}