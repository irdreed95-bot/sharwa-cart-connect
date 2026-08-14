import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/store/Navbar";
import { CartSheet } from "@/components/store/CartSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { formatIQD, productImages, PRODUCT_SELECT, STORE_NAME, type Product } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: `تفاصيل المنتج | ${STORE_NAME}` },
      {
        name: "description",
        content: "تفاصيل المنتج والمواصفات والمميزات والصور مع إمكانية الطلب عبر واتساب.",
      },
      { property: "og:title", content: `تفاصيل المنتج | ${STORE_NAME}` },
      {
        property: "og:description",
        content: "تفاصيل المنتج والمواصفات والمميزات والصور مع إمكانية الطلب عبر واتساب.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { add, setOpen } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState<"specs" | "promo">("specs");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Product | null;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pb-24">
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          رجوع للمتجر
        </Link>

        {isLoading ? (
          <div className="mt-4 space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !product ? (
          <p className="py-24 text-center text-muted-foreground">هذا المنتج غير موجود.</p>
        ) : (
          <ProductDetails
            product={product}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            tab={tab}
            setTab={setTab}
            onAdd={() => {
              add(product);
              toast.success("تمت الإضافة إلى السلة");
              setOpen(true);
            }}
          />
        )}
      </main>

      <CartSheet />
    </div>
  );
}

function ProductDetails({
  product,
  activeImage,
  setActiveImage,
  tab,
  setTab,
  onAdd,
}: {
  product: Product;
  activeImage: number;
  setActiveImage: (i: number) => void;
  tab: "specs" | "promo";
  setTab: (t: "specs" | "promo") => void;
  onAdd: () => void;
}) {
  const images = productImages(product);
  const features = (product.features ?? []).filter((f) => f.trim().length > 0);

  return (
    <div className="mt-4 space-y-5">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-luxe">
        <div className="aspect-square bg-secondary">
          <img
            src={images[activeImage] ?? images[0]}
            alt={product.name}
            className="size-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto p-3">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                aria-label={`عرض الصورة ${i + 1}`}
                className={cn(
                  "size-16 shrink-0 overflow-hidden rounded-xl border-2",
                  i === activeImage ? "border-gold" : "border-border opacity-70",
                )}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">{product.category}</span>
        <h1 className="font-display text-xl font-bold sm:text-2xl">{product.name}</h1>
        <p className="font-display text-2xl font-bold text-gold">
          {formatIQD(Number(product.price))}
        </p>
        {!product.in_stock && <p className="text-sm text-destructive">غير متوفر حالياً</p>}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-luxe">
        <div className="mb-4 flex gap-2 border-b border-border">
          {(
            [
              ["specs", "المواصفات"],
              ["promo", "وصف ترويجي"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "-mb-px border-b-2 px-3 pb-2 text-sm font-medium",
                tab === key
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "specs" ? (
          <div className="space-y-4 text-sm leading-relaxed">
            {product.usage_text?.trim() && (
              <div>
                <h2 className="mb-1 font-bold">الاستخدامات:</h2>
                <p className="whitespace-pre-line text-muted-foreground">{product.usage_text}</p>
              </div>
            )}
            {features.length > 0 && (
              <div>
                <h2 className="mb-2 font-bold">المميزات:</h2>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2 text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!product.usage_text?.trim() && features.length === 0 && (
              <p className="text-muted-foreground">لا توجد مواصفات إضافية لهذا المنتج.</p>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {product.description?.trim() || "لا يوجد وصف لهذا المنتج."}
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <span className="font-display text-lg font-bold text-gold">
            {formatIQD(Number(product.price))}
          </span>
          <button
            disabled={!product.in_stock}
            onClick={onAdd}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gold font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <ShoppingCart className="size-5" />
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
}
