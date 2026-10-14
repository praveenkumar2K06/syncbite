import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "./icons";
import type { CartItem } from "@/types";

interface CartBarProps {
  cart: CartItem[];
}

export default function CartBar({ cart }: CartBarProps) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (count === 0) return null;

  return (
    <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-30 px-4 pb-2 pointer-events-none">
      <button
        onClick={() => navigate("/checkout")}
        className="w-full pointer-events-auto flex items-center justify-between bg-raspberry text-cream px-4 py-3.5 border-2 border-navy shadow-[4px_4px_0_#17232B]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-navy w-7 h-7 flex items-center justify-center text-sm font-bold text-cream">
            {count}
          </div>
          <span className="font-impact text-base uppercase tracking-wider">View Cart</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-golden">₹{total}</span>
          <ArrowRightIcon size={16} />
        </div>
      </button>
    </div>
  );
}
