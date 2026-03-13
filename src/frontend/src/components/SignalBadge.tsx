import { cn } from "@/lib/utils";

interface SignalBadgeProps {
  signal: string;
  confidence?: number;
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
}

export function SignalBadge({
  signal,
  confidence,
  size = "md",
  showGlow = false,
}: SignalBadgeProps) {
  const s = signal.toUpperCase();
  const signalClass =
    s === "BUY" ? "signal-buy" : s === "SELL" ? "signal-sell" : "signal-hold";
  const glowClass = showGlow
    ? s === "BUY"
      ? "glow-buy"
      : s === "SELL"
        ? "glow-sell"
        : "glow-hold"
    : "";

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 font-semibold",
    md: "text-sm px-3 py-1 font-bold tracking-wide",
    lg: "text-lg px-5 py-2 font-extrabold tracking-widest",
  };

  const label = s === "BUY" ? "BELI" : s === "SELL" ? "JUAL" : "TAHAN";

  return (
    <div className={cn("inline-flex flex-col items-center gap-0.5", glowClass)}>
      <span
        className={cn(
          "rounded border font-mono",
          signalClass,
          sizeClasses[size],
        )}
      >
        {s}
      </span>
      {confidence !== undefined && (
        <span
          className={cn(
            "text-xs font-mono opacity-80",
            signalClass.replace("signal-", "text-"),
          )}
        >
          {label} · {confidence.toFixed(0)}%
        </span>
      )}
    </div>
  );
}
