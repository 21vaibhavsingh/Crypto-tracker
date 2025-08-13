// js/coin.js
(async function(){
  const params = new URLSearchParams(location.search);
  const coin = params.get("coin");
  if(!coin){
    document.getElementById("coin-title").textContent = "Coin not specified";
    return;
  }
  document.getElementById("coin-title").textContent = coin;

  const priceEl = document.getElementById("coin-price");
  const changeEl = document.getElementById("coin-change");
  const amountEl = document.getElementById("coin-amount");
  const ctx = document.getElementById("lineChart").getContext("2d");
  let chart = null;

  // load your amount if present
  const myAmount = loadPortfolio().find(c=>c.id===coin)?.amount ?? 0;
  amountEl.textContent = myAmount;

  async function refreshSummary(){
    try{
      const p = await fetchPrices(coin);
      const info = p[coin];
      const price = info?.usd ?? 0;
      const ch = info?.usd_24h_change ?? 0;
      priceEl.textContent = `$${price.toLocaleString(undefined,{maximumFractionDigits:8})}`;
      changeEl.textContent = `${ch.toFixed(2)}%`;
      changeEl.className = ch>=0? 'big-value positive':'big-value negative';
    }catch(e){
      priceEl.textContent = "—";
      changeEl.textContent = "—";
    }
  }

  async function loadChart(days=30){
    try{
      const prices = await fetchHistorical(coin, days);
      const labels = prices.map(p=> {
        const d = new Date(p[0]);
        return `${d.getMonth()+1}/${d.getDate()}`;
      });
      const data = prices.map(p=>p[1]);

      if(chart) chart.destroy();
      chart = new Chart(ctx, {
        type:'line',
        data:{ labels, datasets:[{ label: coin, data, fill:true, tension:0.2 }]},
        options:{ plugins:{ legend:{ display:false }}, scales:{ x:{ ticks:{ maxRotation:0 } } } }
      });
    }catch(e){
      console.error(e);
    }
  }

  // wire period buttons
  document.querySelectorAll(".period-btn").forEach(btn=>{
    btn.addEventListener("click", async (ev)=>{
      document.querySelectorAll(".period-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const days = btn.dataset.days || 30;
      await loadChart(days);
    });
  });

  await refreshSummary();
  await loadChart(30);
  setInterval(refreshSummary, 60000);

})();
