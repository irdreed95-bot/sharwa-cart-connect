import { CATEGORIES } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CategoryBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === category
                ? "border-transparent bg-gold text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
