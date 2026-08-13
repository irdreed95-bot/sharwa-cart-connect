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

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  in_stock: boolean;
};

export function formatIQD(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(value))} د.ع`;
}
