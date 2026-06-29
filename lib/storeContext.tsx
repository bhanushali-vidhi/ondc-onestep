"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "out";
  emoji: string;
};

export type StoreData = {
  // Profile
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  category: string;
  themeColor: string;
  logo: string | null;

  // Network toggles
  ondcOn: boolean;
  logisticsOn: boolean;

  // Onboarding
  onboardingComplete: boolean;
  onboardingStep: number;

  // Catalog
  products: Product[];

  // Verification
  gstin: string;
  pan: string;
  verified: boolean;
};

const STORAGE_KEY = "ondc-onestep:store@v1";

const seedProducts: Product[] = [
  { id: "p1", name: "Saffron Rice 5kg", category: "grocery", price: 540, stock: 42, status: "active", emoji: "🍚" },
  { id: "p2", name: "Garam Masala 200g", category: "grocery", price: 180, stock: 128, status: "active", emoji: "🌶️" },
  { id: "p3", name: "Premium Cardamom", category: "grocery", price: 820, stock: 12, status: "active", emoji: "🟢" },
  { id: "p4", name: "Spice Combo Pack", category: "grocery", price: 1240, stock: 18, status: "active", emoji: "🎁" },
  { id: "p5", name: "Turmeric 1kg", category: "grocery", price: 290, stock: 94, status: "active", emoji: "🟡" },
  { id: "p6", name: "Black Pepper 250g", category: "grocery", price: 320, stock: 56, status: "active", emoji: "⚫" },
  { id: "p7", name: "Mustard Seeds 500g", category: "grocery", price: 120, stock: 0, status: "out", emoji: "🟤" },
  { id: "p8", name: "Coriander Powder", category: "grocery", price: 95, stock: 0, status: "draft", emoji: "🟢" },
];

const defaultData: StoreData = {
  storeName: "Anjali's Spice Co.",
  ownerName: "Anjali Sharma",
  ownerEmail: "anjali@spice.in",
  category: "grocery",
  themeColor: "#FF6B35",
  logo: null,

  ondcOn: true,
  logisticsOn: true,

  onboardingComplete: true,
  onboardingStep: 0,

  products: seedProducts,

  gstin: "29ABCDE1234F1Z5",
  pan: "ABCDE1234F",
  verified: true,
};

type Ctx = {
  data: StoreData;
  hydrated: boolean;
  update: (patch: Partial<StoreData>) => void;
  reset: () => void;
  setOnboarded: (b: boolean) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({
  children,
  fresh = false,
}: {
  children: React.ReactNode;
  fresh?: boolean;
}) {
  const [data, setData] = useState<StoreData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData({ ...defaultData, ...JSON.parse(raw) });
      } else if (fresh) {
        // Brand-new signup → empty state (no products, no onboarding)
        setData({
          ...defaultData,
          storeName: "",
          products: [],
          onboardingComplete: false,
          onboardingStep: 0,
          verified: false,
        });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [fresh]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota
    }
  }, [data, hydrated]);

  const update = useCallback((patch: Partial<StoreData>) => {
    setData((d) => ({ ...d, ...patch }));
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setData(defaultData);
  }, []);

  const setOnboarded = useCallback((b: boolean) => {
    setData((d) => ({ ...d, onboardingComplete: b }));
  }, []);

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    setData((d) => ({
      ...d,
      products: [{ id: `p${Date.now()}`, ...p }, ...d.products],
    }));
  }, []);

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      setData((d) => ({
        ...d,
        products: d.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
    },
    []
  );

  const deleteProduct = useCallback((id: string) => {
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      data,
      hydrated,
      update,
      reset,
      setOnboarded,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [data, hydrated, update, reset, setOnboarded, addProduct, updateProduct, deleteProduct]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
