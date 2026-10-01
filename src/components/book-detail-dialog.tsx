import { Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { daysBetween, formatDate, type Book } from "@/lib/books";

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= value ? "fill-primary text-primary" : "text-muted-foreground/50"}
        />
      ))}
    </span>
  );
}

export function BookDetailDialog({
  book,
  onClose,
  onDelete,
}: {
  book: Book | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const days = book ? daysBetween(book.startDate, book.finishDate) : null;

  return (
    <Dialog open={!!book} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg border-border bg-card">
        {book && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl text-primary">
                {book.title}
              </DialogTitle>
              <DialogDescription className="font-display text-lg tracking-wide">
                {book.author || "Unknown author"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Stars value={book.rating} size={20} />
                <span className="text-muted-foreground">{book.rating} / 5</span>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                    Started
                  </dt>
                  <dd className="mt-1 font-display text-lg">{formatDate(book.startDate)}</dd>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                    Finished
                  </dt>
                  <dd className="mt-1 font-display text-lg">{formatDate(book.finishDate)}</dd>
                </div>
              </dl>

              {days && (
                <p className="text-muted-foreground">
                  Read over <span className="text-primary">{days}</span> day{days === 1 ? "" : "s"}.
                </p>
              )}

              {book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="border-primary/40 text-primary uppercase tracking-widest"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              )}

              {book.notes && (
                <p className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground">
                  {book.notes}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  onDelete(book.id);
                  onClose();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove from shelf
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
