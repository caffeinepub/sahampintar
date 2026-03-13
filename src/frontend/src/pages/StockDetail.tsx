import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart2,
  DollarSign,
  Info,
  Loader2,
  Newspaper,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { PriceChart } from "../components/PriceChart";
import { useStock } from "../hooks/useQueries";
import {
  STOCK_SECTORS,
  formatDate,
  formatIDR,
  formatMarketCap,
  formatPercent,
  getPriceChange,
  getSignalClass,
} from "../utils/format";

function getRecommendationExplanation(
  signal: string,
  confidence: number,
  rsi: number,
  ma20: number,
  ma50: number,
  pe: number,
): string {
  const s = signal.toUpperCase();
  const maSignal =
    ma20 > ma50
      ? "Golden Cross (MA20 di atas MA50)"
      : "Death Cross (MA20 di bawah MA50)";
  const rsiDesc =
    rsi < 30
      ? "oversold (jenuh jual)"
      : rsi > 70
        ? "overbought (jenuh beli)"
        : "netral";
  const peDesc = pe < 10 ? "murah" : pe < 20 ? "wajar" : "mahal";

  if (s === "BUY") {
    return `Sinyal BELI dengan keyakinan ${confidence}%. RSI berada di zona ${rsiDesc} (${rsi.toFixed(1)}), menunjukkan potensi kenaikan harga. Indikator moving average menunjukkan ${maSignal}. Valuasi P/E ${pe.toFixed(1)}x dinilai ${peDesc} dibanding rata-rata industri. Kombinasi teknikal dan fundamental mendukung posisi beli.`;
  }
  if (s === "SELL") {
    return `Sinyal JUAL dengan keyakinan ${confidence}%. RSI berada di zona ${rsiDesc} (${rsi.toFixed(1)}), menunjukkan tekanan jual. Indikator moving average menunjukkan ${maSignal}. Valuasi P/E ${pe.toFixed(1)}x dinilai ${peDesc}. Disarankan untuk mempertimbangkan aksi jual atau proteksi portofolio.`;
  }
  return `Sinyal TAHAN dengan keyakinan ${confidence}%. RSI berada di zona ${rsiDesc} (${rsi.toFixed(1)}). Indikator moving average menunjukkan ${maSignal}. Valuasi P/E ${pe.toFixed(1)}x dinilai ${peDesc}. Disarankan untuk mempertahankan posisi sambil memantau pergerakan lebih lanjut.`;
}

function FundamentalCard({
  label,
  value,
  signal,
  icon,
  description,
}: {
  label: string;
  value: string;
  signal: "good" | "neutral" | "bad";
  icon: React.ReactNode;
  description: string;
}) {
  const signalColor =
    signal === "good"
      ? "text-[oklch(var(--signal-buy))]"
      : signal === "bad"
        ? "text-[oklch(var(--signal-sell))]"
        : "text-[oklch(var(--signal-hold))]";
  const dot =
    signal === "good"
      ? "bg-[oklch(var(--signal-buy))]"
      : signal === "bad"
        ? "bg-[oklch(var(--signal-sell))]"
        : "bg-[oklch(var(--signal-hold))]";

  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
        <span className={cn("inline-block w-2 h-2 rounded-full", dot)} />
      </div>
      <p className={cn("font-mono font-bold text-base", signalColor)}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

export function StockDetail() {
  const { ticker } = useParams({ from: "/stock/$ticker" });
  const navigate = useNavigate();
  const { data: stock, isLoading, isError } = useStock(ticker);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="stock.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data {ticker}...</p>
        </div>
      </div>
    );
  }

  if (isError || !stock) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="stock.error_state"
      >
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            Gagal memuat data untuk {ticker}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/" })}
            data-ocid="stock.secondary_button"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { current, changePct } = getPriceChange(stock.historicalPrices);
  const signal = stock.recommendation.signal.toUpperCase();
  const confidence = Number(stock.recommendation.confidenceScore);
  const ti = stock.technicalIndicators;
  const fd = stock.fundamentalData;
  const signalClass = getSignalClass(signal);
  const isPos = changePct >= 0;
  const sector = STOCK_SECTORS[ticker] || "";

  const explanation = getRecommendationExplanation(
    signal,
    confidence,
    ti.rsi14,
    ti.ma20,
    ti.ma50,
    fd.peRatio,
  );

  const rsiPercent = Math.min(100, Math.max(0, ti.rsi14));
  const rsiColor =
    ti.rsi14 < 30
      ? "bg-[oklch(var(--signal-buy))]"
      : ti.rsi14 > 70
        ? "bg-[oklch(var(--signal-sell))]"
        : "bg-[oklch(var(--signal-hold))]";

  const priceMidBoll = (ti.bollingerUpper + ti.bollingerLower) / 2;
  const bollPos =
    ti.bollingerUpper !== ti.bollingerLower
      ? Math.min(
          100,
          Math.max(
            0,
            ((current - ti.bollingerLower) /
              (ti.bollingerUpper - ti.bollingerLower)) *
              100,
          ),
        )
      : 50;
  const bollSignal =
    current >= ti.bollingerUpper
      ? "Overbought"
      : current <= ti.bollingerLower
        ? "Oversold"
        : "Normal";

  const sortedNews = [...(stock.news || [])].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <div className="min-h-screen" data-ocid="stock.page">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            data-ocid="stock.secondary_button"
            className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-extrabold text-foreground">
                  {ticker}
                </h1>
                <Badge variant="outline" className="text-muted-foreground">
                  {sector}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{stock.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  {formatIDR(current)}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 font-mono text-sm font-semibold",
                    isPos
                      ? "text-[oklch(var(--signal-buy))]"
                      : "text-[oklch(var(--signal-sell))]",
                  )}
                >
                  {isPos ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {formatPercent(changePct)}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "px-6 py-4 rounded-xl border-2 text-center",
                signalClass,
              )}
            >
              <p className="font-mono font-extrabold text-2xl tracking-widest">
                {signal}
              </p>
              <p className="text-sm font-bold opacity-90">
                {signal === "BUY"
                  ? "BELI"
                  : signal === "SELL"
                    ? "JUAL"
                    : "TAHAN"}
              </p>
              <p className="font-mono text-xs opacity-70 mt-1">
                Keyakinan: {confidence}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Recommendation Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("p-4 rounded-xl border", signalClass)}
          data-ocid="stock.card"
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">Analisa Rekomendasi</p>
              <p className="text-sm opacity-90 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Price Chart */}
        <Card data-ocid="stock.panel">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <BarChart2
                className="h-4 w-4"
                style={{ color: "oklch(var(--primary))" }}
              />
              Grafik Harga 30 Hari Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stock.historicalPrices.length > 0 ? (
              <PriceChart
                prices={stock.historicalPrices}
                ma20={ti.ma20}
                ma50={ti.ma50}
              />
            ) : (
              <div
                className="h-64 flex items-center justify-center text-muted-foreground"
                data-ocid="stock.empty_state"
              >
                Data harga tidak tersedia
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Analysis */}
        <Card data-ocid="stock.section">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Activity
                className="h-4 w-4"
                style={{ color: "oklch(var(--primary))" }}
              />
              Analisa Teknikal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* RSI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">RSI (14)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-foreground">
                    {ti.rsi14.toFixed(1)}
                  </span>
                  <Badge
                    className={cn(
                      "text-xs border",
                      ti.rsi14 < 30
                        ? "signal-buy"
                        : ti.rsi14 > 70
                          ? "signal-sell"
                          : "signal-hold",
                    )}
                  >
                    {ti.rsi14 < 30
                      ? "Oversold → Beli"
                      : ti.rsi14 > 70
                        ? "Overbought → Jual"
                        : "Netral"}
                  </Badge>
                </div>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
                    rsiColor,
                  )}
                  style={{ width: `${rsiPercent}%` }}
                />
                <div className="absolute inset-y-0 left-[30%] w-px bg-border/70" />
                <div className="absolute inset-y-0 left-[70%] w-px bg-border/70" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>Oversold (30)</span>
                <span>Overbought (70)</span>
                <span>100</span>
              </div>
            </div>

            <Separator />

            {/* MACD */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MACD</p>
                <p className="font-mono font-bold text-foreground">
                  {ti.macd.toFixed(3)}
                </p>
              </div>
              <Badge
                className={cn(
                  "border text-xs",
                  ti.macd > 0 ? "signal-buy" : "signal-sell",
                )}
              >
                {ti.macd > 0 ? "Bullish ↑" : "Bearish ↓"}
              </Badge>
            </div>

            <Separator />

            {/* Bollinger Bands */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Bollinger Bands
                </span>
                <Badge
                  className={cn(
                    "border text-xs",
                    bollSignal === "Oversold"
                      ? "signal-buy"
                      : bollSignal === "Overbought"
                        ? "signal-sell"
                        : "signal-hold",
                  )}
                >
                  {bollSignal}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-xs text-muted-foreground">Lower</p>
                  <p className="font-mono text-sm">
                    {formatIDR(ti.bollingerLower)}
                  </p>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-xs text-muted-foreground">Middle</p>
                  <p className="font-mono text-sm">{formatIDR(priceMidBoll)}</p>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-xs text-muted-foreground">Upper</p>
                  <p className="font-mono text-sm">
                    {formatIDR(ti.bollingerUpper)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="relative h-2 bg-muted rounded-full">
                  <div
                    className="absolute top-0 h-full w-1.5 rounded-full -translate-x-1/2 transition-all duration-700"
                    style={{
                      left: `${bollPos}%`,
                      backgroundColor: "oklch(var(--primary))",
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Harga saat ini di posisi {bollPos.toFixed(0)}% dari band bawah
                  ke atas
                </p>
              </div>
            </div>

            <Separator />

            {/* Volume + MA Crossover */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Volume Trend</p>
                  <p className="font-mono font-bold text-foreground">
                    {ti.volumeTrend.toFixed(2)}x
                  </p>
                </div>
                <Badge
                  className={cn(
                    "border text-xs",
                    ti.volumeTrend > 1 ? "signal-buy" : "signal-hold",
                  )}
                >
                  {ti.volumeTrend > 1.2
                    ? "Tinggi"
                    : ti.volumeTrend > 0.8
                      ? "Normal"
                      : "Rendah"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">MA Crossover</p>
                  <p className="font-mono text-xs text-foreground">
                    MA20: {formatIDR(ti.ma20)}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    MA50: {formatIDR(ti.ma50)}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "border text-xs",
                    ti.ma20 > ti.ma50 ? "signal-buy" : "signal-sell",
                  )}
                >
                  {ti.ma20 > ti.ma50 ? "Golden ↑" : "Death ↓"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fundamental Analysis */}
        <Card data-ocid="stock.section">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <DollarSign
                className="h-4 w-4"
                style={{ color: "oklch(var(--primary))" }}
              />
              Analisa Fundamental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <FundamentalCard
                label="P/E Ratio"
                value={`${fd.peRatio.toFixed(1)}x`}
                signal={
                  fd.peRatio < 10 ? "good" : fd.peRatio < 25 ? "neutral" : "bad"
                }
                icon={<BarChart2 className="h-3 w-3" />}
                description={
                  fd.peRatio < 10
                    ? "Murah"
                    : fd.peRatio < 25
                      ? "Wajar"
                      : "Mahal"
                }
              />
              <FundamentalCard
                label="EPS"
                value={formatIDR(fd.eps)}
                signal={fd.eps > 0 ? "good" : fd.eps === 0 ? "neutral" : "bad"}
                icon={<DollarSign className="h-3 w-3" />}
                description={fd.eps > 0 ? "Positif" : "Negatif"}
              />
              <FundamentalCard
                label="Market Cap"
                value={formatMarketCap(fd.marketCap)}
                signal="neutral"
                icon={<TrendingUp className="h-3 w-3" />}
                description="Kapitalisasi Pasar"
              />
              <FundamentalCard
                label="Dividend Yield"
                value={`${(fd.dividendYield * 100).toFixed(2)}%`}
                signal={
                  fd.dividendYield > 0.03
                    ? "good"
                    : fd.dividendYield > 0
                      ? "neutral"
                      : "bad"
                }
                icon={<DollarSign className="h-3 w-3" />}
                description={
                  fd.dividendYield > 0.03
                    ? "Yield Menarik"
                    : fd.dividendYield > 0
                      ? "Ada Dividen"
                      : "Tidak Ada Dividen"
                }
              />
              <FundamentalCard
                label="Revenue Growth"
                value={`${(fd.revenueGrowth * 100).toFixed(1)}%`}
                signal={
                  fd.revenueGrowth > 0.1
                    ? "good"
                    : fd.revenueGrowth >= 0
                      ? "neutral"
                      : "bad"
                }
                icon={<TrendingUp className="h-3 w-3" />}
                description={
                  fd.revenueGrowth > 0.1
                    ? "Pertumbuhan Tinggi"
                    : fd.revenueGrowth >= 0
                      ? "Stabil"
                      : "Menurun"
                }
              />
              <FundamentalCard
                label="Debt/Equity"
                value={fd.debtToEquity.toFixed(2)}
                signal={
                  fd.debtToEquity < 0.5
                    ? "good"
                    : fd.debtToEquity < 1.5
                      ? "neutral"
                      : "bad"
                }
                icon={<AlertCircle className="h-3 w-3" />}
                description={
                  fd.debtToEquity < 0.5
                    ? "Hutang Rendah"
                    : fd.debtToEquity < 1.5
                      ? "Sedang"
                      : "Hutang Tinggi"
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* News Section */}
        <Card data-ocid="stock.section">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Newspaper
                className="h-4 w-4"
                style={{ color: "oklch(var(--primary))" }}
              />
              Berita & Sentimen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedNews.length === 0 ? (
              <p
                className="text-muted-foreground text-sm py-4 text-center"
                data-ocid="stock.empty_state"
              >
                Tidak ada berita tersedia
              </p>
            ) : (
              <div className="space-y-3">
                {sortedNews.map((news, i) => {
                  const sentiment = news.sentiment.toUpperCase();
                  const sentimentClass =
                    sentiment === "POSITIVE"
                      ? "signal-buy"
                      : sentiment === "NEGATIVE"
                        ? "signal-sell"
                        : "signal-hold";
                  const sentimentLabel =
                    sentiment === "POSITIVE"
                      ? "Positif"
                      : sentiment === "NEGATIVE"
                        ? "Negatif"
                        : "Netral";

                  return (
                    <div
                      key={news.title}
                      className="p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                      data-ocid={`stock.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground leading-snug">
                            {news.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {news.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {news.source}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(news.timestamp)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <Badge
                            className={cn("border text-xs", sentimentClass)}
                          >
                            {sentimentLabel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Impact: {Number(news.impactScore)}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
