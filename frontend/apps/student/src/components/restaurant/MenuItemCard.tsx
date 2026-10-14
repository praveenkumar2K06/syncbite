import React, { useState } from "react";
import type { MenuItem } from "@/types";
import { PlusIcon, MinusIcon } from "@/components/icons";

interface MenuItemCardProps {
  item: MenuItem;
  qty: number;
  instructions?: string;
  onAdd: () => void;
  onRemove: () => void;
  onCustomize?: () => void;
  disabled?: boolean;
}

export function MenuItemCard({
  item,
  qty,
  instructions,
  onAdd,
  onRemove,
  onCustomize,
  disabled = false,
}: MenuItemCardProps) {
  const [popKey, setPopKey] = useState(0);
  const [popping, setPopping] = useState(false);

  function handleAdd() {
    if (disabled) return;
    setPopping(true);
    setPopKey((k) => k + 1);
    setTimeout(() => setPopping(false), 580);
    onAdd();
  }

  return (
    <div
      className={`bg-cream border-2 border-navy flex gap-3 p-3 md:p-4 transition-all duration-75 ${
        disabled ? "opacity-75" : "hover:shadow-[3px_3px_0_#17232B]"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <span
            className="mt-1 flex-shrink-0 w-3 h-3 border-2"
            style={{
              borderColor: item.isVeg ? "#4F8B68" : "#D92D57",
              backgroundColor: item.isVeg ? "#4F8B68" : "#D92D57",
            }}
          />
          <h4 className="font-bold text-navy text-sm leading-snug">{item.name}</h4>
        </div>
        <div className="flex items-center gap-3 ml-5">
          <p className="font-impact text-navy text-base">₹{item.price}</p>
          {onCustomize && !disabled && (
            <button
              onClick={onCustomize}
              className="text-[10px] font-bold text-raspberry uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>✎</span> {instructions ? `Note: "${instructions}"` : "Add Note"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0">
        <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden bg-cream-100 border-2 border-navy flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        {qty === 0 ? (
          <div className="relative">
            {popping && (
              <span
                key={popKey}
                className="absolute left-1/2 top-0 w-3 h-3 rounded-full bg-raspberry pointer-events-none z-10 animate-pop-up"
              />
            )}
            <button
              onClick={handleAdd}
              disabled={disabled}
              className={`flex items-center gap-1.5 border-2 text-xs font-bold px-3 py-1.5 transition-colors duration-75 uppercase tracking-wider ${
                disabled
                  ? "bg-navy/10 border-navy/20 text-navy/40 cursor-not-allowed"
                  : "bg-cream border-raspberry text-raspberry hover:bg-raspberry hover:text-white cursor-pointer"
              }`}
            >
              <PlusIcon size={11} />
              {disabled ? "Closed" : "Add"}
            </button>
          </div>
        ) : (
          <div className="relative">
            {popping && (
              <span
                key={popKey}
                className="absolute left-1/2 top-0 w-3 h-3 rounded-full bg-raspberry pointer-events-none z-10 animate-pop-up"
              />
            )}
            <div className="flex items-center gap-0 border-2 border-navy overflow-hidden">
              <button
                onClick={onRemove}
                className="w-7 h-7 flex items-center justify-center text-navy hover:bg-navy hover:text-cream transition-colors duration-75 cursor-pointer"
              >
                <MinusIcon size={12} />
              </button>
              <span className="w-7 text-center text-sm font-bold text-navy border-x-2 border-navy">
                {qty}
              </span>
              <button
                onClick={handleAdd}
                disabled={disabled}
                className={`w-7 h-7 flex items-center justify-center transition-colors duration-75 ${
                  disabled
                    ? "text-navy/30 cursor-not-allowed bg-navy/5"
                    : "text-navy hover:bg-navy hover:text-cream cursor-pointer"
                }`}
              >
                <PlusIcon size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
