export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-bg-card border border-border flex items-center justify-center text-fg-muted mb-4 text-[24px]">
          {icon}
        </div>
      )}
      <h3 className="font-display font-semibold text-[18px]">{title}</h3>
      {description && (
        <p className="mt-1.5 text-[14px] text-fg-muted max-w-[400px]">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
