export type CollectionItem = {
  id: string;
  name: string;
  category: string;
  image: string;
  brand?: string;
  price?: string;
  purchaseDate?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

const KEY = "my-wardrobe-collection";

export function getCollection(): CollectionItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCollection(items: CollectionItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addCollectionItem(item: Omit<CollectionItem, "id" | "createdAt" | "updatedAt">) {
  const items = getCollection();
  const now = Date.now();
  const newItem: CollectionItem = { ...item, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  items.unshift(newItem);
  saveCollection(items);
  return newItem;
}

export function updateCollectionItem(id: string, updates: Partial<CollectionItem>) {
  const items = getCollection();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...updates, updatedAt: Date.now() };
  saveCollection(items);
}

export function deleteCollectionItem(id: string) {
  saveCollection(getCollection().filter((i) => i.id !== id));
}

export function getItemById(id: string) {
  return getCollection().find((i) => i.id === id);
}
