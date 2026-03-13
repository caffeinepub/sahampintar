import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PriceData } from "../hooks/useQueries";
import { formatIDR } from "../utils/format";

interface PriceChartProps {
  prices: PriceData[];
  ma20: number;
  ma50: number;
}

function formatDateShort(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

export function PriceChart({ prices, ma20, ma50 }: PriceChartProps) {
  const last30 = prices.slice(-30);

  const data = last30.map((p) => ({
    date: formatDateShort(p.date),
    close: p.close,
    open: p.open,
    high: p.high,
    low: p.low,
    ma20,
    ma50,
  }));

  const allPrices = last30.map((p) => p.close);
  const minPrice = Math.min(...allPrices) * 0.98;
  const maxPrice = Math.max(...allPrices) * 1.02;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2 font-mono">
            {label}
          </p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono font-semibold text-foreground">
                {formatIDR(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.025 265)" />
        <XAxis
          dataKey="date"
          tick={{
            fill: "oklch(0.55 0.025 265)",
            fontSize: 11,
            fontFamily: "'JetBrains Mono'",
          }}
          axisLine={{ stroke: "oklch(0.22 0.025 265)" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[minPrice, maxPrice]}
          tick={{
            fill: "oklch(0.55 0.025 265)",
            fontSize: 11,
            fontFamily: "'JetBrains Mono'",
          }}
          axisLine={{ stroke: "oklch(0.22 0.025 265)" }}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono'",
            color: "oklch(0.55 0.025 265)",
          }}
        />
        <Line
          type="monotone"
          dataKey="close"
          name="Harga"
          stroke="oklch(0.78 0.14 85)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="ma20"
          name="MA20"
          stroke="oklch(0.56 0.17 145)"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="ma50"
          name="MA50"
          stroke="oklch(0.58 0.22 25)"
          strokeWidth={1.5}
          strokeDasharray="8 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
