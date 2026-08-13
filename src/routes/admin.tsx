import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatIQD, PRODUCT_CATEGORIES, STORE_NAME, type Product } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة تحكم شروة ستور" },
      { name: "description", content: "لوحة إدارة منتجات متجر شروة ستور." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "لوحة تحكم شروة ستور" },
      { property: "og:description", content: "إدارة منتجات المتجر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type FormState = {
  id?: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image_url: string;
  in_stock: boolean;
};

const emptyForm: FormState = {
  name: "",
  category: PRODUCT_CATEGORIES[0]!,
  price: "",
  description: "",
  image_url: "",
  in_stock: true,
};

function AdminPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    async function load(uid: string | null) {
      if (!active) return;
      setUserId(uid);
      if (!uid) {
        setIsAdmin(null);
        setChecking(false);
        return;
      }
      const { data } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
      if (!active) return;
      setIsAdmin(Boolean(data));
      setChecking(false);
    }

    supabase.auth.getSession().then(({ data }) => load(data.session?.user.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setChecking(true);
        void load(session?.user.id ?? null);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        جارٍ التحقق...
      </div>
    );
  }

  if (!userId) return <AuthCard />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">هذا الحساب لا يملك صلاحية الإدارة.</p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          تسجيل الخروج
        </Button>
      </div>
    );
  }

  return <Dashboard />;
}

function AuthCard() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("تم تسجيل الدخول");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب، يمكنك تسجيل الدخول الآن");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-luxe"
      >
        <div className="text-center">
          <h1 className="font-display text-xl font-bold text-gold">لوحة تحكم {STORE_NAME}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "signin" ? "سجّل الدخول للمتابعة" : "إنشاء حساب المدير"}
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gold font-bold text-primary-foreground hover:opacity-90"
        >
          {mode === "signin" ? "دخول" : "إنشاء حساب"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "ليس لديك حساب؟ إنشاء حساب" : "لديك حساب؟ تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price, description, image_url, in_stock")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: FormState) => {
      const payload = {
        name: values.name.trim(),
        category: values.category,
        price: Number(values.price) || 0,
        description: values.description.trim(),
        image_url: values.image_url.trim(),
        in_stock: values.in_stock,
      };
      if (values.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("تم حفظ المنتج");
      setForm(emptyForm);
      void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "تعذر الحفظ"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حذف المنتج");
      void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "تعذر الحذف"),
  });

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw error;
      const { data, error: signError } = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signError) throw signError;
      setForm((f) => ({ ...f, image_url: data.signedUrl }));
      toast.success("تم رفع الصورة");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر رفع الصورة");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <h1 className="font-display text-lg font-bold text-gold">لوحة تحكم {STORE_NAME}</h1>
          <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
            <LogOut className="size-4" />
            خروج
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-luxe">
          <h2 className="mb-4 font-display text-base font-bold">
            {form.id ? "تعديل منتج" : "إضافة منتج جديد"}
          </h2>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name.trim()) return toast.error("اسم المنتج مطلوب");
              save.mutate(form);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="p-name">اسم المنتج</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-price">السعر (د.ع)</Label>
              <Input
                id="p-price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>الفئة</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-image">رابط الصورة</Label>
              <Input
                id="p-image"
                dir="ltr"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-desc">الوصف</Label>
              <Textarea
                id="p-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="size-4" />
                {uploading ? "جارٍ الرفع..." : "رفع صورة"}
              </Button>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="معاينة الصورة"
                  className="size-14 rounded-lg object-cover"
                />
              )}
              <div className="mr-auto flex items-center gap-2">
                <Switch
                  id="p-stock"
                  checked={form.in_stock}
                  onCheckedChange={(v) => setForm({ ...form, in_stock: v })}
                />
                <Label htmlFor="p-stock">متوفر</Label>
              </div>
            </div>

            <div className="flex gap-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={save.isPending}
                className="bg-gold font-bold text-primary-foreground hover:opacity-90"
              >
                <Plus className="size-4" />
                {form.id ? "حفظ التعديلات" : "إضافة المنتج"}
              </Button>
              {form.id && (
                <Button type="button" variant="ghost" onClick={() => setForm(emptyForm)}>
                  <X className="size-4" />
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold">
            المنتجات ({products.length})
          </h2>
          {isLoading ? (
            <p className="text-muted-foreground">جارٍ التحميل...</p>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  className="size-14 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} — {formatIQD(Number(p.price))}
                    {!p.in_stock && " — غير متوفر"}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="تعديل"
                  onClick={() =>
                    setForm({
                      id: p.id,
                      name: p.name,
                      category: p.category,
                      price: String(p.price),
                      description: p.description,
                      image_url: p.image_url,
                      in_stock: p.in_stock,
                    })
                  }
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="حذف"
                  onClick={() => remove.mutate(p.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
