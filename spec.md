# SahamPintar - Indonesian Stock Trading Advisor

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Dashboard utama dengan sinyal BUY / HOLD / SELL untuk 5 saham IDX: ADRO, PTBA, ANTM, TLKM, BBSI
- Analisa teknikal per saham: Moving Average (MA20, MA50), RSI, MACD, Bollinger Bands, Volume trend
- Analisa fundamental per saham: P/E Ratio, EPS, market cap, dividend yield, debt ratio
- Skor gabungan (composite score) dari analisa teknikal + fundamental menghasilkan rekomendasi BUY/HOLD/SELL
- Feed berita/isu terkini per saham yang mempengaruhi sentimen (simulasi dari HTTP outcalls)
- Halaman detail per saham dengan chart harga historis dan indikator teknikal
- Ringkasan portofolio: saham mana yang paling direkomendasikan hari ini
- Backend menyimpan data harga historis dan analisa, bisa di-refresh
- HTTP outcalls ke sumber data eksternal (Yahoo Finance / CNBC Indonesia) untuk data harga terkini

### Modify
- Tidak ada (project baru)

### Remove
- Tidak ada (project baru)

## Implementation Plan
1. Backend Motoko:
   - Tipe data: StockData, TechnicalAnalysis, FundamentalData, NewsItem, Recommendation
   - Fungsi: getStockAnalysis(ticker), getAllStocks(), refreshData(), getNewsForStock(ticker)
   - HTTP outcalls untuk mengambil data harga dari API publik
   - Kalkulasi indikator teknikal dari data historis
   - Logika rekomendasi BUY/HOLD/SELL berdasarkan skor gabungan
2. Frontend React:
   - Halaman utama: kartu ringkasan 5 saham dengan rekomendasi berwarna (hijau=BUY, kuning=HOLD, merah=SELL)
   - Detail saham: chart harga, indikator teknikal, fundamental, berita
   - Auto-refresh setiap beberapa menit
   - Badge signal yang menonjol
   - Tabel perbandingan semua saham
