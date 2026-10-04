import type { FoodType } from "@/lib/portal";
import { cn } from "@/lib/utils";
import FoodDot from "../common/FoodDot";

export const FOOD_TYPES: FoodType[] = ["veg", "nonveg"];
export const FOOD_LABELS: Record<FoodType, string> = {
  veg: "Vegetarian",
  nonveg: "Non-Vegetarian",
};

export interface FoodTypePickerProps {
  value: FoodType;
  onChange: (t: FoodType) => void;
}

export default function FoodTypePicker({ value, onChange }: FoodTypePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {FOOD_TYPES.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
              active
                ? t === "veg"
                  ? "border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30"
                  : "border-red-600 bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-red-500/30"
                : "border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <FoodDot type={t} />
            <span>{FOOD_LABELS[t]}</span>
          </button>
        );
      })}
    </div>
  );
}
