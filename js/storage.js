// js/storage.js
const STORAGE_KEY = "cg_portfolio_v1";

/**
 * Portfolio model:
 * [ { id: "bitcoin", amount: 0.5 }, ... ]
 */

function loadPortfolio(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){
    console.error("loadPortfolio error", e);
    return [];
  }
}
function savePortfolio(portfolio){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
}
function addOrUpdateCoin(id, amount){
  id = id.toLowerCase();
  const arr = loadPortfolio();
  const i = arr.findIndex(c=>c.id===id);
  if(i>=0){ arr[i].amount = parseFloat(arr[i].amount) + parseFloat(amount); }
  else{ arr.push({id, amount: parseFloat(amount)}); }
  savePortfolio(arr);
  return arr;
}
function setPortfolio(arr){ savePortfolio(arr); return arr;}
function removeCoin(id){
  const arr = loadPortfolio().filter(c=>c.id !== id.toLowerCase());
  savePortfolio(arr);
  return arr;
}
