import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Stars } from "@/components/book-detail-dialog";
import { daysBetween, useBooks, type Book } from "@/lib/books";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BookWorm's Nook" },
      {
        name: "description",
        content:
          "Reading statistics for BookWorm's Nook: pages of your year, favourite genres, average rating and reading pace.",
      },
      { property: "og:title", content: "Dashboard — BookWorm's Nook" },
      {
        property: "og:description",
        content: "Reading statistics: pace per day, favourite genres and ratings.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { books } = useBooks();
  return <DashboardView books={books} />;
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="paper-card px-5 py-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl text-primary">{value}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DashboardView({ books }: { books: Book[] }) {
  const finished = books.filter((b) => b.finishDate);
  const durations = finished
    .map((b) => daysBetween(b.startDate, b.finishDate))
    .filter((d): d is number => d !== null);

  const avgDays = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;
  const avgRating = books.length
    ? (books.reduce((a, b) => a + b.rating, 0) / books.length).toFixed(1)
    : "—";

  const tagCounts = new Map<string, number>();
  books.forEach((b) => b.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)));
  const genres = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topGenre = genres[0]?.[0] ?? "—";
  const maxGenre = genres[0]?.[1] ?? 1;

  const monthCounts = new Array(12).fill(0) as number[];
  finished.forEach((b) => {
    const d = new Date(b.finishDate);
    if (!Number.isNaN(d.getTime())) {
      const m = d.getMonth();
      monthCounts[m] = (monthCounts[m] ?? 0) + 1;
    }
  });
  const maxMonth = Math.max(1, ...monthCounts);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  const ranked = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <section className="candle-glow rounded-xl px-4 py-8 text-center">
          <h1 className="font-display text-5xl text-primary sm:text-6xl">The Ledger</h1>
          <p className="mt-3 text-muted-foreground">Everything your shelves reveal about you.</p>
        </section>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Books read" value={String(books.length)} />
          <Stat label="Average rating" value={String(avgRating)} hint="out of five" />
          <Stat
            label="Average pace"
            value={avgDays ? `${avgDays}d` : "—"}
            hint="days per book"
          />
          <Stat label="Favourite genre" value={topGenre} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="paper-card px-6 py-6">
            <h2 className="font-display text-2xl text-primary">Books finished by month</h2>
            <div className="mt-6 flex h-48 items-end gap-2">
              {monthCounts.map((count, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className="w-full shrink-0 rounded-t-sm bg-primary/70 transition-all"
                    style={{ height: `${(count / maxMonth) * 100}%`, minHeight: count ? 6 : 2 }}
                    title={`${count} book${count === 1 ? "" : "s"}`}
                  />
                  <span className="text-xs text-muted-foreground">{months[i]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="paper-card px-6 py-6">
            <h2 className="font-display text-2xl text-primary">Genres & themes</h2>
            <div className="mt-6 space-y-3">
              {genres.length === 0 && (
                <p className="text-sm text-muted-foreground">No tags yet.</p>
              )}
              {genres.slice(0, 7).map(([tag, count]) => (
                <div key={tag}>
                  <div className="flex justify-between text-sm">
                    <span className="uppercase tracking-widest">{tag}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(count / maxGenre) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="paper-card mt-6 px-6 py-6">
          <h2 className="font-display text-2xl text-primary">Highest rated</h2>
          <ul className="mt-4 divide-y divide-border">
            {ranked.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-display text-xl">{b.title}</p>
                  <p className="text-sm text-muted-foreground">{b.author}</p>
                </div>
                <Stars value={b.rating} />
              </li>
            ))}
            {ranked.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">Nothing shelved yet.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
