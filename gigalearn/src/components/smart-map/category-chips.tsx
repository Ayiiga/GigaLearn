"use client";

import { PLACE_CATEGORIES } from "@/content/smart-map/categories";
import { useMapStore } from "@/stores/map-store";
import { cn } from "@/lib/utils";

export function CategoryChips() {
  const activeCategory = useMapStore((s) => s.activeCategory);
  const setActiveCategory = useMapStore((s) => s.setActiveCategory);

  return (
    <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        type="button"
        onClick={() => setActiveCategory("all")}
        className={cn(
          "shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold backdrop-blur-xl transition",
          activeCategory === "all"
            ? "bg-sm-primary text-white shadow-md"
            : "bg-white/85 text-slate-700 shadow-sm dark:bg-[#0B3A63]/85 dark:text-white",
        )}
      >
        Nearby
      </button>
      {PLACE_CATEGORIES.slice(0, 14).map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => setActiveCategory(cat.id)}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold backdrop-blur-xl transition",
            activeCategory === cat.id
              ? "bg-sm-primary text-white shadow-md"
              : "bg-white/85 text-slate-700 shadow-sm dark:bg-[#0B3A63]/85 dark:text-white",
          )}
        >
          <span className="mr-1.5">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
