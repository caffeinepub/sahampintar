import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface PriceData {
    low: number;
    date: Time;
    high: number;
    close: number;
    open: number;
    volume: bigint;
}
export interface FundamentalData {
    eps: number;
    peRatio: number;
    marketCap: bigint;
    debtToEquity: number;
    revenueGrowth: number;
    dividendYield: number;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface StockData {
    ticker: string;
    name: string;
    news: Array<NewsItem>;
    lastUpdated: Time;
    fundamentalData: FundamentalData;
    historicalPrices: Array<PriceData>;
    recommendation: Recommendation;
    technicalIndicators: TechnicalIndicators;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Recommendation {
    confidenceScore: bigint;
    signal: string;
}
export interface NewsItem {
    title: string;
    content: string;
    source: string;
    impactScore: bigint;
    sentiment: string;
    timestamp: Time;
}
export interface http_header {
    value: string;
    name: string;
}
export interface TechnicalIndicators {
    ma20: number;
    ma50: number;
    macd: number;
    bollingerLower: number;
    bollingerUpper: number;
    volumeTrend: number;
    rsi14: number;
}
export interface backendInterface {
    getAllRecommendations(): Promise<Array<[string, Recommendation]>>;
    getAllStockTickers(): Promise<Array<string>>;
    getFundamentalData(ticker: string): Promise<FundamentalData | null>;
    getHistoricalPrices(ticker: string): Promise<Array<PriceData> | null>;
    getNews(ticker: string): Promise<Array<NewsItem> | null>;
    getRecommendationV2(ticker: string): Promise<Recommendation | null>;
    getStock(ticker: string): Promise<StockData | null>;
    getTechnicalIndicators(ticker: string): Promise<TechnicalIndicators | null>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
