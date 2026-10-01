import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import shelfBg from "@/assets/shelf-bg.jpg";
import { SiteHeader } from "@/components/site-header";
import { BookSpine } from "@/components/book-spine";
import { BookDetailDialog } from "@/components/book-detail-dialog";
import { AddBookDialog } from "@/components/add-book-dialog";
import { useBooks, type Book } from "@/lib/books";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bookshelf — BookWorm's Nook" },
      {
        name: "description",
        content:
          "A candlelit dark academia bookshelf for tracking every book you read, with dates, ratings and genre tags.",
      },
      { property: "og:title", content: "Bookshelf — BookWorm's Nook" },
      {
        property: "og:description",
        content: "Track your reading on a candlelit dark academia bookshelf.",
      },
    ],
  }),
  component: Bookshelf,
});

const PER_SHELF = 9;

function Bookshelf() {
  const { books, ready, addBook, removeBook } = useBooks();
  const [selected, setSelected] = useState<Book | null>(null);

  const shelves: Book[][] = [];
  for (let i = 0; i < Math.max(books.length, 1); i += PER_SHELF) {
    shelves.push(books.slice(i, i + PER_SHELF));
  }

  return (
    <div
      className="min-h-screen bg-background bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `url(${shelfBg})` }}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-[2px]">
        <SiteHeader />

        <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
          <section className="candle-glow rounded-xl px-4 py-8 text-center">
            <h1 className="font-display text-5xl text-primary sm:text-6xl">The Bookshelf</h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Every volume you have finished, arranged by candlelight. Click a spine to read its
              record.
            </p>
            <div className="mt-6 flex justify-center">
              <AddBookDialog onAdd={addBook} />
            </div>
          </section>

          <section className="mt-10 space-y-8">
            {ready && books.length === 0 && (
              <p className="paper-card px-6 py-12 text-center font-display text-xl text-muted-foreground">
                The shelves stand empty. Shelve your first book.
              </p>
            )}

            {shelves.map((row, i) => (
              <div key={i}>
                <div className="flex min-h-[200px] items-end gap-2 rounded-t-md border border-b-0 border-black/40 bg-black/35 px-5 pt-6">
                  {row.map((book) => (
                    <BookSpine key={book.id} book={book} onSelect={setSelected} />
                  ))}
                </div>
                <div className="shelf-plank h-4 rounded-b-md" />
              </div>
            ))}
          </section>
        </main>

        <BookDetailDialog
          book={selected}
          onClose={() => setSelected(null)}
          onDelete={removeBook}
        />
      </div>
    </div>
  );
}
