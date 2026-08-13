import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/store/Navbar";
import { CategoryBar } from "@/components/store/CategoryBar";
import { ProductCard } from "@/components/store/ProductCard";
import { CartSheet } from "@/components/store/CartSheet";
import { STORE_NAME, type Product } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "شروة ستور | تسوق عطور وساعات وإكسسوارات في العراق" },
      {
        name: "description",
        content:
          "شروة ستور - متجر إلكتروني عراقي للعطور والساعات والإكسسوارات والأجهزة والهدايا مع طلب سريع عبر واتساب ودفع عند الاستلام.",
      },
      { property: "og:title", content: "شروة ستور | متجر إلكتروني عراقي" },
      {
        property: "og:description",
        content: "تسوق عطور، ساعات، إكسسوارات، هدايا ومواد منزلية بأسعار بالدينار العراقي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const [category, setCategory] = useState<string>("الكل");

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price, description, image_url, in_stock")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const products = (data ?? []).filter((p) => category === "الكل" || p.category === category);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CategoryBar active={category} onChange={setCategory} />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="my-6 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-luxe">
          <h1 className="font-display text-2xl font-bold text-gold sm:text-3xl">
            {STORE_NAME} — تسوّق بأناقة
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            منتجات مختارة بعناية: عطور، ساعات، إكسسوارات، أجهزة وهدايا. اطلب الآن وسيصلك التأكيد
            عبر واتساب خلال دقائق.
          </p>
        </section>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">لا توجد منتجات في هذا القسم بعد.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {STORE_NAME} — جميع الحقوق محفوظة
      </footer>

      <CartSheet />
    </div>
  );
}
