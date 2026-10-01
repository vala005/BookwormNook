import type { Book } from "@/lib/books";

const SPINE_TONES = [
  "bg-[color-mix(in_oklab,var(--oxblood)_88%,black)]",
  "bg-[color-mix(in_oklab,var(--moss)_70%,black)]",
  "bg-[color-mix(in_oklab,var(--wood)_80%,black)]",
  "bg-[color-mix(in_oklab,var(--gold)_38%,black)]",
  "bg-[color-mix(in_oklab,var(--chart-4)_55%,black)]",
  "bg-[color-mix(in_oklab,var(--oxblood)_55%,black)]",
];

export function BookSpine({ book, onSelect }: { book: Book; onSelect: (b: Book) => void }) {
  const tone = SPINE_TONES[book.spine % SPINE_TONES.length];
  const height = 150 + ((book.title.length * 7) % 46);
  const width = 34 + ((book.author.length * 3) % 20);

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      title={`${book.title} — ${book.author}`}
      style={{ height, width }}
      className={`group relative flex shrink-0 items-center justify-center overflow-hidden rounded-t-sm border border-black/50 ${tone} shadow-[inset_-6px_0_10px_-6px_rgba(0,0,0,0.9),inset_6px_0_8px_-6px_rgba(255,255,255,0.12)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-candle)] focus:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      <span className="absolute inset-y-2 left-1 w-px bg-primary/40" />
      <span className="absolute inset-y-2 right-1 w-px bg-primary/40" />
      <span
        className="font-display text-[0.72rem] uppercase tracking-[0.14em] text-parchment/90 [writing-mode:vertical-rl] whitespace-nowrap px-1"
        style={{ textOrientation: "mixed" }}
      >
        {book.title}
      </span>
    </button>
  );
}
