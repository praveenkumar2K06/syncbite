import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Restaurant, MenuItem, CartItem, OrderMode, Page } from "@/types";
import { useHumor } from "@/components/HumorSystem";
import { useAppContext } from "@/context/AppContext";
import {
  RestaurantHeader,
  OrderModeBanner,
  CategoryNav,
  MenuItemCard,
  MultiOutletConflictModal,
  ItemCustomizationModal,
  FloatingCartBar,
} from "@/components/restaurant";

interface RestaurantPageProps {
  restaurant?: Restaurant;
  cart?: CartItem[];
  onAddToCart?: (item: MenuItem, restaurantId: string) => void;
  onRemoveFromCart?: (itemId: string) => void;
  onNavigate?: (page: Page, opts?: { restaurant?: Restaurant; mode?: OrderMode }) => void;
  orderMode?: OrderMode;
}

export default function RestaurantPage(props: RestaurantPageProps = {}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ctx = useAppContext();

  const restaurant =
    props.restaurant ??
    (ctx.selectedRestaurant?.id === id
      ? ctx.selectedRestaurant
      : ctx.restaurants.find((r) => r.id === id));
  const { fetchRestaurantMenu } = ctx;
  const [isMenuLoading, setIsMenuLoading] = useState(() => {
    return Boolean(restaurant && (!restaurant.menu || restaurant.menu.length === 0));
  });

  useEffect(() => {
    if (!restaurant?.id) return;
    if (restaurant.menu && restaurant.menu.length > 0) {
      setIsMenuLoading(false);
      return;
    }
    let isMounted = true;
    setIsMenuLoading(true);
    fetchRestaurantMenu(restaurant.id)
      .catch(() => [])
      .finally(() => {
        if (isMounted) setIsMenuLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [restaurant?.id, restaurant?.menu, fetchRestaurantMenu]);
  const cart = props.cart ?? ctx.cart;
  const onAddToCart = props.onAddToCart ?? ctx.addToCart;
  const onRemoveFromCart = props.onRemoveFromCart ?? ctx.removeFromCart;
  const orderMode = props.orderMode ?? ctx.orderMode;
  const onNavigate =
    props.onNavigate ??
    ((page: Page) => {
      if (page === "checkout") navigate("/checkout");
      else if (page === "home") navigate("/home");
      else navigate(`/${page}`);
    });

  // Dynamically derive unique categories from the restaurant's menu items
  const categories = useMemo(() => {
    if (!restaurant?.menu) return [];
    const seen = new Set<string>();
    const list: Array<{ key: string; label: string }> = [];

    restaurant.menu.forEach((item) => {
      const rawCat = item.category || "General";
      if (!seen.has(rawCat)) {
        seen.add(rawCat);
        const countStr = String(list.length + 1).padStart(2, "0");
        const formattedLabel = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
        list.push({
          key: rawCat,
          label: `${countStr} — ${formattedLabel}`,
        });
      }
    });

    return list;
  }, [restaurant?.menu]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Active category defaults to the user's selection, or the first available category in the restaurant's menu
  const activeCategory =
    selectedCategory && categories.some((c) => c.key === selectedCategory)
      ? selectedCategory
      : (categories[0]?.key ?? "popular");

  const [vegOnly, setVegOnly] = useState(false);
  const [conflictItem, setConflictItem] = useState<{ item: MenuItem; restaurantId: string } | null>(
    null,
  );
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [itemNoteInput, setItemNoteInput] = useState("");

  const { trigger } = useHumor();
  const itemActionCounts = useRef<Map<string, number>>(new Map());

  if (!restaurant) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-impact text-2xl uppercase text-navy mb-2">Stall not found</h2>
        <p className="text-navy/50 text-sm mb-4">
          The stall you're looking for doesn't exist or is loading.
        </p>
        <button
          onClick={() => navigate("/browse")}
          className="bg-navy text-cream px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  function getQty(itemId: string) {
    return cart.find((ci) => ci.menuItem.id === itemId)?.quantity ?? 0;
  }

  function wrappedAdd(item: MenuItem, restaurantId: string, note?: string) {
    const existingRestId = cart[0]?.restaurantId;
    if (existingRestId && existingRestId !== restaurantId) {
      setConflictItem({ item, restaurantId });
      return;
    }

    const qty = getQty(item.id);
    if (qty >= 5) trigger("large-quantity");
    const count = (itemActionCounts.current.get(item.id) ?? 0) + 1;
    itemActionCounts.current.set(item.id, count);
    if (count >= 5) trigger("add-remove-same-item");
    onAddToCart(item, restaurantId);
    if (note && ctx.updateInstructions) {
      ctx.updateInstructions(item.id, note);
    }
  }

  function confirmConflictReplace() {
    if (!conflictItem) return;
    ctx.clearCart();
    onAddToCart(conflictItem.item, conflictItem.restaurantId);
    setConflictItem(null);
  }

  function wrappedRemove(itemId: string) {
    const count = (itemActionCounts.current.get(itemId) ?? 0) + 1;
    itemActionCounts.current.set(itemId, count);
    if (count >= 5) trigger("add-remove-same-item");
    onRemoveFromCart(itemId);
  }

  const filteredItems = restaurant.menu.filter((item) => {
    const matchesCat = item.category === activeCategory;
    const matchesVeg = vegOnly ? item.isVeg : true;
    return matchesCat && matchesVeg;
  });
  const cartItemsHere = cart.filter((ci) => ci.restaurantId === restaurant.id);
  const cartTotal = cartItemsHere.reduce((s, ci) => s + ci.menuItem.price * ci.quantity, 0);
  const cartCount = cartItemsHere.reduce((s, ci) => s + ci.quantity, 0);

  return (
    <div className="pb-32 md:pb-8">
      <RestaurantHeader restaurant={restaurant} onBack={() => onNavigate("home")} />
      <OrderModeBanner orderMode={orderMode} />
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setSelectedCategory}
        vegOnly={vegOnly}
        onToggleVegOnly={() => setVegOnly(!vegOnly)}
        hasCategoryItems={(key) => restaurant.menu.some((m) => m.category === key)}
      />

      {/* Menu items list */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {isMenuLoading ? (
          <div className="space-y-3 py-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="border-2 border-navy/15 bg-cream/50 p-4 h-24 flex justify-between items-center"
              >
                <div className="space-y-2 w-1/2">
                  <div className="h-4 bg-navy/10 rounded w-3/4" />
                  <div className="h-3 bg-navy/10 rounded w-1/2" />
                </div>
                <div className="h-8 bg-navy/10 rounded w-20" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-navy/40 text-sm">
            {vegOnly ? "No pure-veg items in this category." : "Nothing here yet."}
          </div>
        ) : (
          filteredItems.map((item) => {
            const qty = getQty(item.id);
            const cartItem = cart.find((ci) => ci.menuItem.id === item.id);
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                qty={qty}
                instructions={cartItem?.instructions}
                disabled={!restaurant.isOpen}
                onAdd={() => wrappedAdd(item, restaurant.id)}
                onRemove={() => wrappedRemove(item.id)}
                onCustomize={() => {
                  setCustomizingItem(item);
                  setItemNoteInput(cartItem?.instructions || "");
                }}
              />
            );
          })
        )}
      </div>

      <FloatingCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCheckout={() => onNavigate("checkout")}
      />

      <MultiOutletConflictModal
        isOpen={Boolean(conflictItem)}
        onCancel={() => setConflictItem(null)}
        onConfirm={confirmConflictReplace}
      />

      <ItemCustomizationModal
        item={customizingItem}
        noteInput={itemNoteInput}
        onNoteInputChange={setItemNoteInput}
        onCancel={() => setCustomizingItem(null)}
        onSave={() => {
          if (customizingItem) {
            wrappedAdd(customizingItem, restaurant.id, itemNoteInput.trim());
            setCustomizingItem(null);
          }
        }}
      />
    </div>
  );
}
