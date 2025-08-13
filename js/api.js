// js/api.js
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

/**
 * getPrices(ids: comma string) -> returns simple price object
 */
async function fetchPrices(ids){
  if(!ids) return {};
  const url = `${COINGECKO_BASE}/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  if(!res.ok) throw new Error("Price fetch failed");
  return res.json();
}

/**
 * fetchHistorical(coinId, days) -> returns array [ [timestamp, price], ... ]
 */
async function fetchHistorical(coinId, days=30){
  const url = `${COINGECKO_BASE}/coins/${encodeURIComponent(coinId)}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  const res = await fetch(url);
  if(!res.ok) throw new Error("Historical fetch failed");
  const json = await res.json();
  return json.prices; // array of [timestamp, price]
}
