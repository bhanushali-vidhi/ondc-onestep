export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-bg-card relative overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(250,245,239,0.04) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s linear infinite",
        }}
      />
    </div>
  );
}
