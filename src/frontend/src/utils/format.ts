export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatMarketCap(value: bigint): string {
  const num = Number(value);
  if (num >= 1_000_000_000_000) {
    return `Rp ${(num / 1_000_000_000_000).toFixed(2)} T`;
  }
  if (num >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toFixed(2)} M`;
  }
  if (num >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toFixed(2)} jt`;
  }
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSignalClass(signal: string): string {
  const s = signal.toUpperCase();
  if (s === "BUY") return "signal-buy";
  if (s === "SELL") return "signal-sell";
  return "signal-hold";
}

export function getSignalGlow(signal: string): string {
  const s = signal.toUpperCase();
  if (s === "BUY") return "glow-buy";
  if (s === "SELL") return "glow-sell";
  return "glow-hold";
}

export function getPriceChange(prices: { close: number }[]): {
  current: number;
  change: number;
  changePct: number;
} {
  if (!prices || prices.length === 0)
    return { current: 0, change: 0, changePct: 0 };
  const current = prices[prices.length - 1].close;
  const prev = prices.length > 1 ? prices[prices.length - 2].close : current;
  const change = current - prev;
  const changePct = prev !== 0 ? (change / prev) * 100 : 0;
  return { current, change, changePct };
}

export const STOCK_NAMES: Record<string, string> = {
  ADRO: "PT Adaro Energy Indonesia Tbk",
  PTBA: "PT Bukit Asam Tbk",
  ANTM: "PT Aneka Tambang Tbk",
  TLKM: "PT Telkom Indonesia Tbk",
  BBSI: "PT Bank Bisnis Internasional Tbk",
};

export const STOCK_SECTORS: Record<string, string> = {
  ADRO: "Energi & Batubara",
  PTBA: "Energi & Batubara",
  ANTM: "Pertambangan & Mineral",
  TLKM: "Telekomunikasi",
  BBSI: "Perbankan",
};
