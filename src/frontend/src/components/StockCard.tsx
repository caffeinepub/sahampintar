import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import type { StockData } from "../hooks/useQueries";
import {
  STOCK_SECTORS,
  formatIDR,
  formatPercent,
  getPriceChange,
  getSignalClass,
} from "../utils/format";

interface StockCardProps {
  stock: StockData;
  onClick: () => void;
  index: number;
}

export function StockCard({ stock, onClick, index }: StockCardProps) {
  const { current, changePct } = getPriceChange(stock.historicalPrices);
  const signal = stock.recommendation.signal.toUpperCase();
  const confidence = Number(stock.recommendation.confidenceScore);
  const signalClass = getSignalClass(signal);
  const isPositive = changePct >= 0;
  const sector = STOCK_SECTORS[stock.ticker] || "";

  const cardBorderColor =
    signal === "BUY"
      ? "border-l-[oklch(var(--signal-buy))]"
      : signal === "SELL"
        ? "border-l-[oklch(var(--signal-sell))]"
        : "border-l-[oklch(var(--signal-hold))]";

  const signalLabel =
    signal === "BUY" ? "BELI" : signal === "SELL" ? "JUAL" : "TAHAN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -3 }}
      data-ocid={`stock.card.${index + 1}`}
    >
      <Card
        className={cn(
          "cursor-pointer border border-border border-l-4 bg-card hover:bg-accent/20 transition-colors duration-200",
          cardBorderColor,
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-foreground">
                  {stock.ticker}
                </span>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground border-border"
                >
                  {sector}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {stock.name}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
          </div>

          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="font-mono text-xl font-bold text-foreground">
                {formatIDR(current)}
              </p>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-mono",
                  isPositive
                    ? "text-[oklch(var(--signal-buy))]"
                    : "text-[oklch(var(--signal-sell))]",
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercent(changePct)}
              </div>
            </div>

            <div
              className={cn(
                "flex flex-col items-center px-3 py-1.5 rounded border text-center",
                signalClass,
              )}
            >
              <span className="font-mono font-extrabold text-sm tracking-widest">
                {signal}
              </span>
              <span className="text-xs font-bold opacity-90">
                {signalLabel}
              </span>
              <span className="text-xs font-mono opacity-70">
                {confidence}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">RSI</p>
              <p
                className={cn(
                  "font-mono text-sm font-semibold",
                  stock.technicalIndicators.rsi14 < 30
                    ? "text-[oklch(var(--signal-buy))]"
                    : stock.technicalIndicators.rsi14 > 70
                      ? "text-[oklch(var(--signal-sell))]"
                      : "text-[oklch(var(--signal-hold))]",
                )}
              >
                {stock.technicalIndicators.rsi14.toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">MA20</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {formatIDR(stock.technicalIndicators.ma20)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">MA Cross</p>
              <p
                className={cn(
                  "text-xs font-bold",
                  stock.technicalIndicators.ma20 >
                    stock.technicalIndicators.ma50
                    ? "text-[oklch(var(--signal-buy))]"
                    : "text-[oklch(var(--signal-sell))]",
                )}
              >
                {stock.technicalIndicators.ma20 > stock.technicalIndicators.ma50
                  ? "Golden ↑"
                  : "Death ↓"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StockCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-lg border border-border bg-card p-4 animate-pulse"
      data-ocid={`stock.loading_state.${index + 1}`}
    >
      <div className="h-5 bg-muted rounded w-24 mb-2" />
      <div className="h-3 bg-muted rounded w-40 mb-4" />
      <div className="h-6 bg-muted rounded w-32 mb-2" />
      <div className="h-8 bg-muted rounded w-20 mb-3" />
      <div className="h-px bg-border mb-2" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-8 bg-muted rounded" />
        <div className="h-8 bg-muted rounded" />
        <div className="h-8 bg-muted rounded" />
      </div>
    </motion.div>
  );
}
