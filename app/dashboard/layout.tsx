import DashboardShell from "@/components/DashboardShell";
import { StoreProvider } from "@/lib/storeContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ToastProvider>
        <DashboardShell>{children}</DashboardShell>
      </ToastProvider>
    </StoreProvider>
  );
}
