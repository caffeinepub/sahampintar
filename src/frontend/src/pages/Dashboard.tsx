import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, RefreshCw, Star, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { StockCard, StockCardSkeleton } from "../components/StockCard";
import { useAllStocks } from "../hooks/useQueries";
import { formatIDR, getPriceChange } from "../utils/format";

const TICKERS = ["ADRO", "PTBA", "ANTM", "TLKM", "BBSI"];

export function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: stocks,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useAllStocks(TICKERS);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["allStocks"] });
  };

  const bestBuyStock = stocks
    ? [...stocks]
        .filter((s) => s.recommendation.signal.toUpperCase() === "BUY")
        .sort(
          (a, b) =>
            Number(b.recommendation.confidenceScore) -
            Number(a.recommendation.confidenceScore),
        )[0]
    : null;

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen" data-ocid="dashboard.page">
      {/* Hero Header */}
      <div className="grid-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Pasar IDX{" "}
                <span style={{ color: "oklch(var(--primary))" }}>Hari Ini</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{today}</p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="inline-block w-2 h-2 rounded-full animate-pulse-soft"
                    style={{ backgroundColor: "oklch(var(--signal-buy))" }}
                  />
                  Update: {lastUpdated}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                data-ocid="dashboard.primary_button"
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <RefreshCw
                  className={cn(
                    "h-3.5 w-3.5 mr-1.5",
                    isLoading && "animate-spin",
                  )}
                />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Market Summary Bar */}
          {stocks && stocks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3"
            >
              {stocks.map((stock) => {
                const { current, changePct } = getPriceChange(
                  stock.historicalPrices,
                );
                const isPos = changePct >= 0;
                return (
                  <button
                    type="button"
                    key={stock.ticker}
                    onClick={() =>
                      navigate({
                        to: "/stock/$ticker",
                        params: { ticker: stock.ticker },
                      })
                    }
                    className="text-left p-2 rounded bg-card/50 border border-border hover:border-primary/50 transition-colors"
                    data-ocid="dashboard.tab"
                  >
                    <p className="font-mono font-bold text-xs text-foreground">
                      {stock.ticker}
                    </p>
                    <p className="font-mono text-xs">{formatIDR(current)}</p>
                    <p
                      className={cn(
                        "font-mono text-xs",
                        isPos
                          ? "text-[oklch(var(--signal-buy))]"
                          : "text-[oklch(var(--signal-sell))]",
                      )}
                    >
                      {isPos ? "+" : ""}
                      {changePct.toFixed(2)}%
                    </p>
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Best Buy Today */}
        <AnimatePresence>
          {bestBuyStock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-xl border p-5 cursor-pointer glow-buy signal-buy"
              onClick={() =>
                navigate({
                  to: "/stock/$ticker",
                  params: { ticker: bestBuyStock.ticker },
                })
              }
              data-ocid="dashboard.primary_button"
            >
              <div className="absolute right-4 top-4 opacity-10">
                <Star className="h-20 w-20" fill="currentColor" />
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="p-2 rounded-lg border"
                  style={{
                    backgroundColor: "oklch(var(--signal-buy-bg))",
                    borderColor: "oklch(var(--signal-buy) / 0.2)",
                  }}
                >
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1">
                    ⭐ Saham Terbaik Hari Ini
                  </p>
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {bestBuyStock.ticker}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {bestBuyStock.name}
                    </span>
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono text-lg font-bold text-foreground">
                      {formatIDR(
                        getPriceChange(bestBuyStock.historicalPrices).current,
                      )}
                    </span>
                    <Badge className="signal-buy border text-xs">
                      BUY ·{" "}
                      {Number(bestBuyStock.recommendation.confidenceScore)}%
                      Keyakinan
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {isError && (
          <div
            className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive"
            data-ocid="dashboard.error_state"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Gagal memuat data saham. Periksa koneksi dan coba lagi.
            </p>
          </div>
        )}

        {/* Stock Grid */}
        <div>
          <h2 className="font-display font-bold text-xl text-foreground mb-4">
            Analisa 5 Saham Pilihan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {isLoading
              ? ["sk1", "sk2", "sk3", "sk4", "sk5"].map((id, i) => (
                  <StockCardSkeleton key={id} index={i} />
                ))
              : stocks?.map((stock, i) => (
                  <StockCard
                    key={stock.ticker}
                    stock={stock}
                    index={i}
                    onClick={() =>
                      navigate({
                        to: "/stock/$ticker",
                        params: { ticker: stock.ticker },
                      })
                    }
                  />
                ))}
          </div>

          {!isLoading && (!stocks || stocks.length === 0) && !isError && (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="dashboard.empty_state"
            >
              <p>Tidak ada data saham tersedia saat ini.</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground border-t border-border pt-4"
        >
          <p>
            ⚠️ <strong>Disclaimer:</strong> Analisa ini bersifat informatif dan
            bukan merupakan saran investasi. Keputusan investasi sepenuhnya
            menjadi tanggung jawab investor. Pastikan melakukan riset mendalam
            sebelum berinvestasi.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
