// js/dashboard.js
(async function(){
  const tableBody = document.querySelector("#portfolio-table tbody");
  const emptyNote = document.getElementById("empty-note");
  const totalEl = document.getElementById("total-value");
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  let pieChart = null;

  async function refresh(){
    const portfolio = loadPortfolio();
    if(portfolio.length === 0){
      tableBody.innerHTML = "";
      emptyNote.style.display = "block";
      totalEl.textContent = "$0.00";
      if(pieChart) pieChart.destroy();
      return;
    }
    emptyNote.style.display = "none";

    // fetch prices
    const ids = portfolio.map(p => p.id).join(",");
    let data = {};
    try{
      data = await fetchPrices(ids);
    }catch(e){
      console.error(e);
      tableBody.innerHTML = "<tr><td colspan='6'>Failed to fetch prices. Try again later.</td></tr>";
      return;
    }

    // render rows
    tableBody.innerHTML = "";
    let total = 0;
    const pieData = [];
    const pieLabels = [];
    for(const p of portfolio){
      const info = data[p.id];
      const price = info?.usd ?? 0;
      const change = info?.usd_24h_change ?? 0;
      const value = price * p.amount;
      total += value;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>$${price ? price.toLocaleString(undefined, {maximumFractionDigits: 8}) : '—'}</td>
        <td class="${change>=0? 'positive' : 'negative'}">${change? change.toFixed(2)+'%' : '—'}</td>
        <td>${p.amount}</td>
        <td>$${value ? value.toLocaleString(undefined, {maximumFractionDigits:2}) : '0.00'}</td>
        <td><a class="btn small" href="coin.html?coin=${encodeURIComponent(p.id)}">View</a></td>
      `;
      tableBody.appendChild(tr);

      pieLabels.push(p.id);
      pieData.push(Number((value||0).toFixed(2)));
    }

    totalEl.textContent = `$${total.toLocaleString(undefined,{maximumFractionDigits:2})}`;

    // Pie chart
    if(pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: pieLabels.map((_,i)=>`hsl(${(i*60)%360} 70% 55%)`)
        }]
      },
      options: {
        plugins: { legend:{ position:'bottom'} }
      }
    });
  }

  // initial fetch + refresh every 60s
  await refresh();
  setInterval(refresh, 60000);
})();
