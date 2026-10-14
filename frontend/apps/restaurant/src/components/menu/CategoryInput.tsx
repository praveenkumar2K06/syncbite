import { useState, useMemo, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_CATEGORY } from "@/constants";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Tick02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export interface CategoryInputProps {
  value: string;
  onChange: (v: string) => void;
  categories: string[];
  className?: string;
  placeholder?: string;
}

export default function CategoryInput({
  value,
  onChange,
  categories,
  className,
  placeholder = "Select a category…",
}: CategoryInputProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [customList, setCustomList] = useState<string[]>([]);
  const [previousCategory, setPreviousCategory] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Merge provided categories and user-created custom categories
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const c of categories) {
      if (c && c.trim()) set.add(c.trim());
    }
    for (const c of customList) {
      if (c && c.trim()) set.add(c.trim());
    }
    // Include currently set value if not in list and not currently typing new
    if (value && value.trim() && !isAddingNew) {
      set.add(value.trim());
    }
    return Array.from(set);
  }, [categories, customList, value, isAddingNew]);

  useEffect(() => {
    if (isAddingNew) {
      inputRef.current?.focus();
    }
  }, [isAddingNew]);

  const handleCommitNew = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    if (!customList.includes(trimmed)) {
      setCustomList((prev) => [...prev, trimmed]);
    }
    onChange(trimmed);
    setIsAddingNew(false);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setCustomCategory("");
    const fallback = previousCategory || allCategories[0] || DEFAULT_CATEGORY;
    onChange(fallback);
  };

  if (isAddingNew) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Input
            ref={inputRef}
            value={customCategory}
            onChange={(e) => {
              setCustomCategory(e.target.value);
              onChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCommitNew();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCancelNew();
              }
            }}
            placeholder="Type new category name…"
            className={cn("h-9 text-xs sm:text-sm flex-1", className)}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleCommitNew}
            disabled={!customCategory.trim()}
            className="h-9 px-2.5 text-xs shrink-0"
            title="Apply category"
          >
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCancelNew}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
            title="Cancel"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground m-0">
          Press Enter or checkmark to confirm category
        </p>
      </div>
    );
  }

  return (
    <Select
      value={value || undefined}
      onValueChange={(val) => {
        if (val === "__ADD_NEW__") {
          setPreviousCategory(value);
          setIsAddingNew(true);
          setCustomCategory("");
          onChange("");
        } else if (val) {
          onChange(val);
        }
      }}
    >
      <SelectTrigger className={cn("w-full h-9 text-xs sm:text-sm", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-56">
        {allCategories.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem
          value="__ADD_NEW__"
          className="text-primary font-medium cursor-pointer data-highlighted:bg-primary data-highlighted:text-primary-foreground focus:bg-primary focus:text-primary-foreground hover:bg-primary hover:text-primary-foreground data-highlighted:**:text-primary-foreground focus:**:text-primary-foreground hover:**:text-primary-foreground"
        >
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="w-3.5 h-3.5" />
            <span>Add new category…</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
