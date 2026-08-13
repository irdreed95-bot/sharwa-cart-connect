import { ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import { STORE_NAME } from "@/lib/store";

export function Navbar() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gold text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold text-gold">{STORE_NAME}</p>
            <p className="text-[11px] text-muted-foreground">Sharwa Store</p>
          </div>
        </div>

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
    </header>
  );
}
