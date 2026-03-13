import { useQuery } from "@tanstack/react-query";
import type {
  FundamentalData,
  NewsItem,
  PriceData,
  Recommendation,
  StockData,
  TechnicalIndicators,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAllRecommendations() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, Recommendation]>>({
    queryKey: ["allRecommendations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecommendations();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000,
  });
}

export function useAllStockTickers() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<string>>({
    queryKey: ["allStockTickers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStockTickers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStock(ticker: string) {
  const { actor, isFetching } = useActor();
  return useQuery<StockData | null>({
    queryKey: ["stock", ticker],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStock(ticker);
    },
    enabled: !!actor && !isFetching && !!ticker,
    refetchInterval: 60000,
  });
}

export function useAllStocks(tickers: string[]) {
  const { actor, isFetching } = useActor();
  return useQuery<StockData[]>({
    queryKey: ["allStocks", tickers.join(",")],
    queryFn: async () => {
      if (!actor) return [];
      const results = await Promise.all(tickers.map((t) => actor.getStock(t)));
      return results.filter((s): s is StockData => s !== null);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000,
  });
}

export function useTechnicalIndicators(ticker: string) {
  const { actor, isFetching } = useActor();
  return useQuery<TechnicalIndicators | null>({
    queryKey: ["technical", ticker],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTechnicalIndicators(ticker);
    },
    enabled: !!actor && !isFetching && !!ticker,
  });
}

export function useFundamentalData(ticker: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FundamentalData | null>({
    queryKey: ["fundamental", ticker],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFundamentalData(ticker);
    },
    enabled: !!actor && !isFetching && !!ticker,
  });
}

export function useNews(ticker: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Array<NewsItem> | null>({
    queryKey: ["news", ticker],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNews(ticker);
    },
    enabled: !!actor && !isFetching && !!ticker,
  });
}

export function useHistoricalPrices(ticker: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Array<PriceData> | null>({
    queryKey: ["historicalPrices", ticker],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHistoricalPrices(ticker);
    },
    enabled: !!actor && !isFetching && !!ticker,
  });
}

export function useRecommendation(ticker: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Recommendation | null>({
    queryKey: ["recommendation", ticker],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRecommendationV2(ticker);
    },
    enabled: !!actor && !isFetching && !!ticker,
    refetchInterval: 60000,
  });
}

export type {
  StockData,
  Recommendation,
  TechnicalIndicators,
  FundamentalData,
  NewsItem,
  PriceData,
};
