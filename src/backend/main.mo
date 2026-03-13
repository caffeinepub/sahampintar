import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import VarArray "mo:core/VarArray";

actor {
  // Types
  type PriceData = {
    date : Time.Time;
    open : Float;
    close : Float;
    high : Float;
    low : Float;
    volume : Nat;
  };

  type TechnicalIndicators = {
    ma20 : Float;
    ma50 : Float;
    rsi14 : Float;
    macd : Float;
    bollingerUpper : Float;
    bollingerLower : Float;
    volumeTrend : Float;
  };

  type FundamentalData = {
    peRatio : Float;
    eps : Float;
    revenueGrowth : Float;
    debtToEquity : Float;
    dividendYield : Float;
    marketCap : Nat;
  };

  type NewsItem = {
    title : Text;
    content : Text;
    sentiment : Text;
    impactScore : Nat;
    source : Text;
    timestamp : Time.Time;
  };

  type Recommendation = {
    signal : Text;
    confidenceScore : Nat;
  };

  type StockData = {
    ticker : Text;
    name : Text;
    historicalPrices : [PriceData];
    technicalIndicators : TechnicalIndicators;
    fundamentalData : FundamentalData;
    news : [NewsItem];
    recommendation : Recommendation;
    lastUpdated : Time.Time;
  };

  // Global state - singleton pattern for persistent data
  let stocks = Map.empty<Text, StockData>();
  let isSeeded = Map.empty<Principal, Bool>();

  // Helper functions
  func ensureSeeded() : () {
    if (stocks.size() == 0) { Runtime.trap("System not seeded. Please run seedAllStocks first.") };
  };

  // Public query methods
  public query func getStock(ticker : Text) : async ?StockData {
    stocks.get(ticker);
  };

  public query func getHistoricalPrices(ticker : Text) : async ?[PriceData] {
    ensureSeeded();

    switch (stocks.get(ticker)) {
      case (?stock) { ?stock.historicalPrices };
      case (null) { null };
    };
  };

  public query func getTechnicalIndicators(ticker : Text) : async ?TechnicalIndicators {
    ensureSeeded();

    switch (stocks.get(ticker)) {
      case (?stock) { ?stock.technicalIndicators };
      case (null) { null };
    };
  };

  public query func getFundamentalData(ticker : Text) : async ?FundamentalData {
    ensureSeeded();

    switch (stocks.get(ticker)) {
      case (?stock) { ?stock.fundamentalData };
      case (null) { null };
    };
  };

  public query func getNews(ticker : Text) : async ?[NewsItem] {
    ensureSeeded();

    switch (stocks.get(ticker)) {
      case (?stock) { ?stock.news };
      case (null) { null };
    };
  };

  public query func getRecommendationV2(ticker : Text) : async ?Recommendation {
    ensureSeeded();

    switch (stocks.get(ticker)) {
      case (?stock) { ?stock.recommendation };
      case (null) { null };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Returns all current stock recommendations
  public query ({ caller }) func getAllRecommendations() : async [(Text, Recommendation)] {
    let result = List.empty<(Text, Recommendation)>();
    let iter = stocks.entries();
    iter.forEach(
      func((ticker, stockData)) {
        result.add((ticker, stockData.recommendation));
      }
    );
    result.toArray();
  };

  public query ({ caller }) func getAllStockTickers() : async [Text] {
    stocks.keys().toArray();
  };
};
