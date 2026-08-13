import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { formatIQD, STORE_NAME, WHATSAPP_NUMBER } from "@/lib/store";

export function CheckoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { items, total, clear, setOpen } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim()) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }

    const lines = items.map(
      (i, idx) => `${idx + 1}. ${i.name} × ${i.quantity} = ${formatIQD(i.price * i.quantity)}`,
    );
    const message = [
      `طلب جديد من ${STORE_NAME}`,
      "",
      `الاسم: ${name}`,
      `العنوان: ${address}`,
      `رقم الهاتف: ${phone}`,
      "",
      "تفاصيل الطلب:",
      ...lines,
      "",
      `المجموع الكلي: ${formatIQD(total)}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("تم تجهيز طلبك، أكمل الإرسال عبر واتساب");
    clear();
    onOpenChange(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">معلومات التوصيل</DialogTitle>
          <DialogDescription>
            سنرسل تفاصيل الطلب إلى واتساب المتجر لتأكيده معك.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="co-name">الاسم الكامل</Label>
            <Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="co-address">العنوان</Label>
            <Input
              id="co-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="المحافظة، المنطقة، أقرب نقطة دالة"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="co-phone">رقم الهاتف</Label>
            <Input
              id="co-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XXXXXXXXX"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary p-3 text-sm">
            <span className="text-muted-foreground">المجموع</span>
            <span className="font-bold text-primary">{formatIQD(total)}</span>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gold font-bold text-primary-foreground hover:opacity-90"
          >
            إرسال الطلب عبر واتساب
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
