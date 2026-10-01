import { useState } from "react";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "@/lib/books";

type Draft = Omit<Book, "id" | "spine">;

const EMPTY = {
  title: "",
  author: "",
  startDate: "",
  finishDate: "",
  rating: 0,
  tagInput: "",
  notes: "",
};

export function AddBookDialog({ onAdd }: { onAdd: (book: Draft) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const submit = () => {
    if (!form.title.trim()) return;
    onAdd({
      title: form.title.trim(),
      author: form.author.trim(),
      startDate: form.startDate,
      finishDate: form.finishDate,
      rating: form.rating,
      notes: form.notes.trim(),
      tags: form.tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setForm(EMPTY);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-display text-base uppercase tracking-[0.15em]">
          <Plus className="mr-2 h-4 w-4" />
          Shelve a book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-primary">Shelve a book</DialogTitle>
          <DialogDescription>Record what you read and when you read it.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="The Secret History"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Donna Tartt"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finish">Finish date</Label>
              <Input
                id="finish"
                type="date"
                value={form.finishDate}
                onChange={(e) => setForm({ ...form, finishDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => setForm({ ...form, rating: n })}
                  className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Star
                    className={
                      n <= form.rating
                        ? "h-6 w-6 fill-primary text-primary"
                        : "h-6 w-6 text-muted-foreground/50"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (genres, themes — comma separated)</Label>
            <Input
              id="tags"
              value={form.tagInput}
              onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
              placeholder="Gothic, Mystery, Dark Academia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="A line worth remembering…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={submit}
            disabled={!form.title.trim()}
            className="font-display uppercase tracking-[0.15em]"
          >
            Add to shelf
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
