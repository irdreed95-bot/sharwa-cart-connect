export const STORE_NAME = "شروة ستور";
export const WHATSAPP_NUMBER = "9647828638203";

export const CATEGORIES = [
  "الكل",
  "إكسسوارات",
  "عطور",
  "عناية بالبشرة",
  "هدايا رجالية",
  "هدايا نسائية",
  "مواد منزلية",
  "كماليات السيارات",
  "ساعات",
  "اجهزة الكترونية",
] as const;

export const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c !== "الكل");

export const PRODUCT_SELECT =
  "id, name, category, price, description, image_url, in_stock, images, features, usage_text";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  in_stock: boolean;
  images?: string[];
  features?: string[];
  usage_text?: string;
};

export function productImages(product: Product): string[] {
  const list = [product.image_url, ...(product.images ?? [])].filter(
    (src) => typeof src === "string" && src.trim().length > 0,
  );
  return Array.from(new Set(list));
}

export function formatIQD(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(value))} د.ع`;
}
