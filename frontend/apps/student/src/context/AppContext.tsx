import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem, MenuItem, Order, OrderMode, Restaurant } from "@/types";
import {
  clearTokens,
  getBranchesApi,
  getBrandsApi,
  getBranchMenuApi,
  adaptBackendBranchToRestaurant,
  adaptBackendMenuToItems,
  getOrdersApi,
  adaptBackendOrderToUi,
  getCartApi,
  addCartItemApi,
  updateCartItemQtyApi,
  removeCartItemApi,
  clearCartApi,
  type BackendBranch,
  type BackendBrand,
} from "@/api";
import { useHumor } from "@/components/HumorSystem";
import { apiClient } from "@/api";
import {
  isPlatformFrozen,
  checkPlatformFreezeApi,
  subscribePlatformFreeze,
} from "@syncbite/shared";

export interface AuthUser {
  name: string;
  email: string;
}

const AUTH_KEY = "sat_auth_user";

interface AppCtx {
  // Auth
  user: AuthUser | null;
  handleLogin: (u: AuthUser) => void;
  handleLogout: () => void;
  // Data
  restaurants: Restaurant[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  // Cart
  cart: CartItem[];
  cartJustAdded: boolean;
  addToCart: (item: MenuItem, restaurantId: string, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQty: (itemId: string, delta: number) => void;
  updateInstructions?: (itemId: string, note: string) => void;
  clearCart: () => void;
  refreshBranches: () => Promise<void>;
  fetchRestaurantMenu: (restaurantId: string) => Promise<MenuItem[]>;
  // Polling
  refreshOrders: () => Promise<void>;
  // Order flow
  orderMode: OrderMode;
  setOrderMode: React.Dispatch<React.SetStateAction<OrderMode>>;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<Restaurant | null>>;
  // Emergency Kill Switch / Platform Freeze status
  isFrozen: boolean;
}

const AppContext = createContext<AppCtx | null>(null);

export function useAppContext(): AppCtx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { trigger } = useHumor();

  const [isFrozen, setIsFrozen] = useState(() => isPlatformFrozen());

  useEffect(() => {
    // Initial fetch from feature flags endpoint
    void checkPlatformFreezeApi(apiClient);

    const unsubscribe = subscribePlatformFreeze(setIsFrozen);

    // Poll feature flags periodically and on tab focus
    const interval = setInterval(() => {
      void checkPlatformFreezeApi(apiClient);
    }, 30_000);

    const onFocus = () => {
      if (!document.hidden) void checkPlatformFreezeApi(apiClient);
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", onFocus);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [orderMode, setOrderMode] = useState<OrderMode>("now");
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartJustAdded, setCartJustAdded] = useState(false);

  // Sync ref so cart item IDs are readable synchronously in event handlers
  const cartRef = useRef<CartItem[]>([]);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const handleLogin = useCallback((u: AuthUser) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const handleLogout = useCallback(() => {
    clearTokens();
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  // In-memory cache for fetched menus
  const menuCacheRef = useRef<Map<string, MenuItem[]>>(new Map());

  function areRestaurantsEqual(prev: Restaurant[], next: Restaurant[]): boolean {
    if (prev === next) return true;
    if (prev.length !== next.length) return false;
    for (let i = 0; i < prev.length; i++) {
      const p = prev[i];
      const n = next[i];
      if (
        p.id !== n.id ||
        p.isOpen !== n.isOpen ||
        p.name !== n.name ||
        p.category !== n.category ||
        p.rating !== n.rating ||
        p.prepTime !== n.prepTime ||
        (p.menu?.length ?? 0) !== (n.menu?.length ?? 0)
      ) {
        return false;
      }
    }
    return true;
  }

  function areStudentOrdersEqual(prev: Order[], next: Order[]): boolean {
    if (prev === next) return true;
    if (prev.length !== next.length) return false;
    for (let i = 0; i < prev.length; i++) {
      const p = prev[i];
      const n = next[i];
      if (p.id !== n.id || p.status !== n.status || p.total !== n.total) {
        return false;
      }
    }
    return true;
  }

  // Fetch branches metadata from backend (without eagerly downloading all menus)
  const refreshBranches = useCallback(async () => {
    try {
      const [branches, brands]: [BackendBranch[], BackendBrand[]] = await Promise.all([
        getBranchesApi(),
        getBrandsApi().catch(() => [] as BackendBrand[]),
      ]);
      const brandMap = new Map<string, BackendBrand>(
        (brands || []).map((b: BackendBrand) => [b.id, b]),
      );

      if (branches && branches.length > 0) {
        setRestaurants((prevList) => {
          const prevMap = new Map<string, Restaurant>(prevList.map((r) => [r.id, r]));
          const loadedRestaurants: Restaurant[] = branches.map((branch: BackendBranch) => {
            const brand = branch.brand_id ? brandMap.get(branch.brand_id) : undefined;
            const existing = prevMap.get(branch.id);
            // Retain any already loaded menu items for this branch
            const existingMenu =
              existing?.menu && existing.menu.length > 0
                ? existing.menu
                : menuCacheRef.current.get(branch.id) || [];
            const adapted = adaptBackendBranchToRestaurant(branch, undefined, undefined, brand);
            if (existingMenu.length > 0) {
              adapted.menu = existingMenu;
            }
            return adapted;
          });

          // Keep selectedRestaurant in sync with fresh branch state
          setSelectedRestaurant((prev) => {
            if (!prev) return prev;
            const updated = loadedRestaurants.find((r) => r.id === prev.id);
            if (updated && (updated.isOpen !== prev.isOpen || updated.name !== prev.name)) {
              return updated;
            }
            return prev;
          });

          if (areRestaurantsEqual(prevList, loadedRestaurants)) {
            return prevList;
          }
          return loadedRestaurants;
        });
      }
    } catch {
      // restaurants stay untouched if backend unreachable
    }
  }, []);

  // Lazily fetch menu for a specific restaurant on demand
  const fetchRestaurantMenu = useCallback(async (restaurantId: string): Promise<MenuItem[]> => {
    // Return cached menu if available
    const cached = menuCacheRef.current.get(restaurantId);
    if (cached && cached.length > 0) {
      return cached;
    }

    try {
      const menuData = await getBranchMenuApi(restaurantId);
      const items = adaptBackendMenuToItems(menuData);
      menuCacheRef.current.set(restaurantId, items);

      // Update in restaurants list & selectedRestaurant
      setRestaurants((prev) =>
        prev.map((r) => (r.id === restaurantId ? { ...r, menu: items } : r)),
      );
      setSelectedRestaurant((prev) =>
        prev && prev.id === restaurantId ? { ...prev, menu: items } : prev,
      );

      return items;
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    void refreshBranches();

    // Skip polling while logged out (e.g. on LoginPage)
    if (!user) return;

    // Poll branch status (online/offline & operating hours) every 10 seconds (skip when tab is hidden)
    const interval = setInterval(() => {
      if (document.hidden) return;
      void refreshBranches();
    }, 10_000);

    const onVisibilityOrFocus = () => {
      if (!document.hidden) void refreshBranches();
    };
    window.addEventListener("focus", onVisibilityOrFocus);
    document.addEventListener("visibilitychange", onVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onVisibilityOrFocus);
      document.removeEventListener("visibilitychange", onVisibilityOrFocus);
    };
  }, [user, refreshBranches]);

  // Fetch orders from backend with polling for active orders
  const refreshOrders = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getOrdersApi();
      if (Array.isArray(data)) {
        const adapted = data.map((order) => adaptBackendOrderToUi(order));
        setOrders((prev) => (areStudentOrdersEqual(prev, adapted) ? prev : adapted));
      }
    } catch {
      // orders stay untouched if backend unreachable
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void refreshOrders();

    // Auto-poll orders every 6 seconds if active orders exist (skip when tab is hidden)
    const interval = setInterval(() => {
      if (document.hidden) return;
      setOrders((current) => {
        const hasActive = current.some((o) => o.status !== "completed" && o.status !== "cancelled");
        if (hasActive) {
          void refreshOrders();
        }
        return current;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [user, refreshOrders]);

  // Hydrate cart from backend on login
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    async function loadCart() {
      try {
        const backendCart = await getCartApi();
        if (!isMounted || backendCart.is_expired || !backendCart.items?.length) return;
        const cartItems: CartItem[] = backendCart.items.map((item) => ({
          menuItem: {
            id: item.menu_item_id,
            name: item.menu_item_name || "Item",
            description: "",
            price: item.unit_price ?? 0,
            category: "popular" as const,
            image: "",
            isVeg: true,
          },
          quantity: item.quantity,
          restaurantId: backendCart.branch_id,
          cartItemId: item.id,
        }));
        setCart(cartItems);
      } catch {
        // cart starts empty if backend unreachable
      }
    }
    loadCart();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Return after inactivity
  useEffect(() => {
    const LS_KEY = "sat_last_seen";
    const now = Date.now();
    const lastSeen = localStorage.getItem(LS_KEY);
    if (lastSeen) {
      const elapsed = now - Number(lastSeen);
      if (elapsed > 30 * 60 * 1000) {
        setTimeout(() => trigger("return-after-inactivity"), 2000);
      }
    }
    localStorage.setItem(LS_KEY, String(now));
  }, [trigger]);

  // Long browse no order
  useEffect(() => {
    const t = setTimeout(
      () => {
        setCart((current) => {
          const count = current.reduce((s, ci) => s + ci.quantity, 0);
          if (count === 0) trigger("long-browse-no-order");
          return current;
        });
      },
      3 * 60 * 1000,
    );
    return () => clearTimeout(t);
  }, [trigger]);

  const addToCart = useCallback((item: MenuItem, restaurantId: string, instructions?: string) => {
    setCartJustAdded(true);
    setTimeout(() => setCartJustAdded(false), 500);
    const previous = cartRef.current;
    setCart((prev) => {
      const existingRestId = prev[0]?.restaurantId;
      const base = existingRestId && existingRestId !== restaurantId ? [] : prev;
      const existing = base.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return base.map((ci) =>
          ci.menuItem.id === item.id
            ? { ...ci, quantity: ci.quantity + 1, instructions: instructions ?? ci.instructions }
            : ci,
        );
      }
      return [...base, { menuItem: item, quantity: 1, restaurantId, instructions }];
    });

    // Background sync — capture the backend cart item ID for subsequent update/remove calls, rollback on error
    addCartItemApi(restaurantId, item.id, 1)
      .then((backendCart) => {
        const backendItem = backendCart.items.find((bi) => bi.menu_item_id === item.id);
        if (backendItem) {
          setCart((prev) =>
            prev.map((ci) =>
              ci.menuItem.id === item.id && !ci.cartItemId
                ? { ...ci, cartItemId: backendItem.id }
                : ci,
            ),
          );
        }
      })
      .catch(() => {
        // Rollback state if network/backend rejected the addition
        setCart(previous);
      });
  }, []);

  const updateInstructions = useCallback((itemId: string, note: string) => {
    setCart((prev) =>
      prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, instructions: note } : ci)),
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    const previous = cartRef.current;
    const cartItem = cartRef.current.find((ci) => ci.menuItem.id === itemId);
    setCart((prev) =>
      prev
        .map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci))
        .filter((ci) => ci.quantity > 0),
    );
    if (cartItem?.cartItemId) {
      removeCartItemApi(cartItem.cartItemId).catch(() => {
        setCart(previous);
      });
    }
  }, []);

  const updateQty = useCallback((itemId: string, delta: number) => {
    const previous = cartRef.current;
    const cartItem = cartRef.current.find((ci) => ci.menuItem.id === itemId);
    const nextQty = (cartItem?.quantity ?? 0) + delta;
    setCart((prev) =>
      prev
        .map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity: ci.quantity + delta } : ci))
        .filter((ci) => ci.quantity > 0),
    );
    if (cartItem?.cartItemId) {
      const apiCall =
        nextQty > 0
          ? updateCartItemQtyApi(cartItem.cartItemId, nextQty)
          : removeCartItemApi(cartItem.cartItemId);
      apiCall.catch(() => {
        setCart(previous);
      });
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    clearCartApi().catch(() => {});
  }, []);

  const contextValue = useMemo<AppCtx>(
    () => ({
      user,
      handleLogin,
      handleLogout,
      restaurants,
      orders,
      setOrders,
      cart,
      cartJustAdded,
      addToCart,
      removeFromCart,
      updateQty,
      updateInstructions,
      clearCart,
      refreshBranches,
      fetchRestaurantMenu,
      refreshOrders,
      orderMode,
      setOrderMode,
      selectedRestaurant,
      setSelectedRestaurant,
      isFrozen,
    }),
    [
      user,
      handleLogin,
      handleLogout,
      restaurants,
      orders,
      cart,
      cartJustAdded,
      addToCart,
      removeFromCart,
      updateQty,
      updateInstructions,
      clearCart,
      refreshBranches,
      fetchRestaurantMenu,
      refreshOrders,
      orderMode,
      selectedRestaurant,
      isFrozen,
    ],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
