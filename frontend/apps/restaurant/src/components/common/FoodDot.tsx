import { C } from "@/constants";
import type { FoodType } from "@/lib/portal";

export interface FoodDotProps {
  type: FoodType;
}

export default function FoodDot({ type }: FoodDotProps) {
  const c = { veg: C.green, nonveg: C.red }[type];
  return (
    <span
      title={type}
      style={{
        width: 13,
        height: 13,
        borderRadius: 2,
        border: `1.5px solid ${c}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
    </span>
  );
}
