import { Link } from "@tanstack/react-router";
import { Search, ShieldCheck, ShoppingCart, Sparkles, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { STORE_NAME } from "@/lib/store";

export function Navbar({
  query,
  onQueryChange,
}: {
  query?: string;
  onQueryChange?: (value: string) => void;
}) {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gold text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold text-gold">{STORE_NAME}</p>
            <p className="text-[11px] text-muted-foreground">Sharwa Store</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            aria-label="تسجيل الدخول للوحة التحكم"
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
          >
            <ShieldCheck className="size-5 text-muted-foreground" />
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="فتح سلة المشتريات"
            className="relative flex size-11 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
          >
            <ShoppingCart className="size-5 text-primary" />
            {count > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {onQueryChange && (
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query ?? ""}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="ابحث عن منتج..."
              aria-label="البحث عن منتج"
              className="h-11 w-full rounded-xl border border-border bg-card pr-10 pl-10 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                aria-label="مسح البحث"
                className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
