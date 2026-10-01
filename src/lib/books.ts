import { useCallback, useEffect, useState } from "react";

export type Book = {
  id: string;
  title: string;
  author: string;
  startDate: string;
  finishDate: string;
  rating: number;
  tags: string[];
  notes: string;
  spine: number;
};

const STORAGE_KEY = "bookworms-nook.books.v1";

const SEED: Book[] = [
  {
    id: "seed-1",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    startDate: "2026-01-04",
    finishDate: "2026-01-19",
    rating: 5,
    tags: ["Gothic", "Classic", "Romance"],
    notes: "Reader, it ruined me.",
    spine: 0,
  },
  {
    id: "seed-2",
    title: "The Secret History",
    author: "Donna Tartt",
    startDate: "2026-02-02",
    finishDate: "2026-02-21",
    rating: 5,
    tags: ["Dark Academia", "Mystery"],
    notes: "Beauty is terror.",
    spine: 1,
  },
  {
    id: "seed-3",
    title: "Frankenstein",
    author: "Mary Shelley",
    startDate: "2026-03-08",
    finishDate: "2026-03-16",
    rating: 4,
    tags: ["Gothic", "Classic", "Horror"],
    notes: "",
    spine: 2,
  },
  {
    id: "seed-4",
    title: "Piranesi",
    author: "Susanna Clarke",
    startDate: "2026-04-01",
    finishDate: "2026-04-06",
    rating: 4,
    tags: ["Fantasy", "Dark Academia"],
    notes: "The House is beautiful.",
    spine: 3,
  },
];

function read(): Book[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Book[]) : SEED;
  } catch {
    return SEED;
  }
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBooks(read());
    setReady(true);
  }, []);

  const persist = useCallback((next: Book[]) => {
    setBooks(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const addBook = useCallback(
    (book: Omit<Book, "id" | "spine">) => {
      const next = [
        ...books,
        { ...book, id: crypto.randomUUID(), spine: Math.floor(Math.random() * 6) },
      ];
      persist(next);
    },
    [books, persist],
  );

  const removeBook = useCallback(
    (id: string) => persist(books.filter((b) => b.id !== id)),
    [books, persist],
  );

  return { books, ready, addBook, removeBook };
}

export function daysBetween(start: string, finish: string) {
  if (!start || !finish) return null;
  const a = new Date(start).getTime();
  const b = new Date(finish).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

export function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}
