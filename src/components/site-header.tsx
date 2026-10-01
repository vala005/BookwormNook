import { Link } from "@tanstack/react-router";
import logo from "@/assets/bookworms-nook-logo.png.asset.json";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-4 sm:flex-row sm:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="BookWorm's Nook"
            width={180}
            height={106}
            className="h-16 w-auto invert-logo"
          />
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="nav-link"
            activeProps={{ "data-current": "true" } as never}
          >
            Bookshelf
          </Link>
          <Link
            to="/dashboard"
            className="nav-link"
            activeProps={{ "data-current": "true" } as never}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
