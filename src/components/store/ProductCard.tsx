import { Plus } from "lucide-react";
import { formatIQD, type Product } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-luxe">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.in_stock && (
          <span className="absolute top-2 right-2 rounded-full bg-background/90 px-2 py-1 text-xs text-muted-foreground">
            غير متوفر
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[11px] text-muted-foreground">{product.category}</span>
        <h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-display text-sm font-bold text-primary">
            {formatIQD(Number(product.price))}
          </span>
          <button
            disabled={!product.in_stock}
            onClick={() => {
              add(product);
              toast.success("تمت الإضافة إلى السلة");
            }}
            aria-label={`إضافة ${product.name} للسلة`}
            className="flex size-9 items-center justify-center rounded-xl bg-gold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Plus className="size-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
