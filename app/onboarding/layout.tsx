import { StoreProvider } from "@/lib/storeContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider fresh>
      <ToastProvider>{children}</ToastProvider>
    </StoreProvider>
  );
}
