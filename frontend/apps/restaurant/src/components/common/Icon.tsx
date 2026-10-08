import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Home01Icon,
  Restaurant01Icon,
  Invoice01Icon,
  Settings01Icon,
  PlusSignIcon,
  PencilEdit02Icon,
  Delete02Icon,
  Tick02Icon,
  Cancel01Icon,
  ChevronRightIcon,
  Search01Icon,
  UserIcon,
  Logout01Icon,
  FlashIcon,
  RefreshCwIcon,
  Store01Icon,
  Building02Icon,
  Package01Icon,
  KitchenUtensilsIcon,
  Coins01Icon,
  CreditCardIcon,
  LegalDocument01Icon,
  BellRingIcon,
  Notification01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";

const ICON_MAP: Record<string, IconSvgElement> = {
  home: Home01Icon,
  menu: Restaurant01Icon,
  categories: Tag01Icon,
  orders: Invoice01Icon,
  settings: Settings01Icon,
  plus: PlusSignIcon,
  edit: PencilEdit02Icon,
  trash: Delete02Icon,
  check: Tick02Icon,
  x: Cancel01Icon,
  chevron: ChevronRightIcon,
  search: Search01Icon,
  user: UserIcon,
  logout: Logout01Icon,
  pencil: PencilEdit02Icon,
  zap: FlashIcon,
  refresh: RefreshCwIcon,
  brands: Building02Icon,
  branches: Store01Icon,
  inventory: Package01Icon,
  kitchen: KitchenUtensilsIcon,
  kitchens: KitchenUtensilsIcon,
  finances: Coins01Icon,
  subscription: CreditCardIcon,
  merchant: LegalDocument01Icon,
  bell: BellRingIcon,
  notification: Notification01Icon,
  notifications: BellRingIcon,
};

export interface IconProps {
  n: string;
  size?: number | string;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ n, size = 16, color, className, strokeWidth = 2 }: IconProps) {
  const icon = ICON_MAP[n];
  if (!icon) return null;

  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color || "currentColor"}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    />
  );
}

export { Icon as Ico };
