// js/manage.js
(function(){
  const form = document.getElementById("addForm");
  const coinIdInput = document.getElementById("coinId");
  const amountInput = document.getElementById("coinAmount");
  const listEl = document.getElementById("portfolioList");
  const clearBtn = document.getElementById("clearBtn");

  function renderList(){
    const portfolio = loadPortfolio();
    listEl.innerHTML = "";
    if(portfolio.length === 0){
      listEl.innerHTML = "<li class='small muted'>No coins saved yet.</li>";
      return;
    }
    portfolio.forEach(item=>{
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${item.id}</strong>
          <div class="meta">${item.amount} coins</div>
        </div>
        <div>
          <button class="btn small edit">Edit</button>
          <button class="btn ghost small remove">Remove</button>
        </div>
      `;
      // edit
      li.querySelector(".edit").addEventListener("click", ()=>{
        coinIdInput.value = item.id;
        amountInput.value = item.amount;
        window.scrollTo({top:0, behavior:'smooth'});
      });
      // remove
      li.querySelector(".remove").addEventListener("click", ()=>{
        if(!confirm(`Remove ${item.id} from portfolio?`)) return;
        removeCoin(item.id);
        renderList();
      });
      listEl.appendChild(li);
    });
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const id = coinIdInput.value.trim().toLowerCase();
    const amt = parseFloat(amountInput.value);
    if(!id || isNaN(amt) || amt<=0){ alert("Enter valid coin id and amount"); return;}
    addOrUpdateCoin(id, amt);
    coinIdInput.value = ""; amountInput.value = "";
    renderList();
  });

  clearBtn.addEventListener("click", ()=>{
    if(!confirm("Clear entire portfolio?")) return;
    setPortfolio([]);
    renderList();
  });

  renderList();
})();
