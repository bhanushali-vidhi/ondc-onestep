"use client";

import StoreBuilder, { StoreBuilderValues } from "@/components/StoreBuilder";
import { useStore } from "@/lib/storeContext";
import { useToast } from "@/components/ui/Toast";

export default function StorePage() {
  const { data, hydrated, update } = useStore();
  const toast = useToast();

  const handleSave = (v: StoreBuilderValues) => {
    update({
      storeName: v.storeName,
      category: v.category,
      themeColor: v.themeColor,
      logo: v.logo,
      ondcOn: v.ondcOn,
      logisticsOn: v.logisticsOn,
    });
    toast.show({
      title: "Storefront updated",
      description: "Your changes are live across all ONDC channels.",
      variant: "success",
    });
  };

  if (!hydrated) {
    return <div className="h-[600px] rounded-md bg-bg-card animate-pulse" />;
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-2">
      <StoreBuilder
        mode="owner"
        initial={{
          storeName: data.storeName,
          category: data.category,
          themeColor: data.themeColor,
          logo: data.logo,
          ondcOn: data.ondcOn,
          logisticsOn: data.logisticsOn,
        }}
        onSave={handleSave}
      />
    </div>
  );
}
