import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatIQD } from "@/lib/store";
import { CheckoutDialog } from "./CheckoutDialog";

export function CartSheet() {
  const { items, isOpen, setOpen, total, setQuantity, remove } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-md">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="font-display text-xl">سلة المشتريات</SheetTitle>
            <SheetDescription>راجع طلبك قبل إتمام الشراء</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <ShoppingBag className="size-10" />
                <p>سلتك فارغة حالياً</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold">{item.name}</p>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label="حذف المنتج"
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-border">
                        <button
                          className="px-2 py-1 text-primary"
                          aria-label="زيادة"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-4" />
                        </button>
                        <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-primary"
                          aria-label="إنقاص"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-4" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {formatIQD(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 border-t border-border p-4">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">المجموع الكلي</span>
              <span className="font-display text-lg font-bold text-primary">
                {formatIQD(total)}
              </span>
            </div>
            <Button
              className="w-full bg-gold font-bold text-primary-foreground hover:opacity-90"
              size="lg"
              disabled={items.length === 0}
              onClick={() => setCheckoutOpen(true)}
            >
              إتمام الطلب عبر واتساب
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
