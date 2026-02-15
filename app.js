// ---------- NAVIGATION ----------
const links=document.querySelectorAll(".sidebar a");
const views=document.querySelectorAll(".view");

links.forEach(link=>{
link.onclick=()=>{
links.forEach(l=>l.classList.remove("active"));
link.classList.add("active");

views.forEach(v=>v.classList.remove("active"));

if(link.textContent==="Dashboard") dashboardView.classList.add("active");
if(link.textContent==="Marchés"){ marketsView.classList.add("active"); loadMarkets();}
if(link.textContent==="Scanner"){ scannerView.classList.add("active"); loadScanner();}
if(link.textContent==="Analyses") analysisView.classList.add("active");
};
});

// ---------- CHART ----------
function loadChart(symbol="BINANCE:BTCUSDT"){
tv_chart.innerHTML="";
new TradingView.widget({
autosize:true,
symbol:symbol,
theme:"dark",
container_id:"tv_chart"
});
}
loadChart();

// ---------- WATCHLIST ----------
function getWatchlist(){
return JSON.parse(localStorage.getItem("watchlist")||"[]");
}
function saveWatchlist(list){
localStorage.setItem("watchlist",JSON.stringify(list));
}

function addAsset(symbolInput=null){
let symbol=symbolInput||watchInput.value.toUpperCase();
if(!symbol) return;

if(!symbol.includes(":")) symbol="BINANCE:"+symbol;

let list=getWatchlist();
if(!list.includes(symbol)) list.push(symbol);

saveWatchlist(list);
renderWatchlist();
watchInput.value="";
}

function removeAsset(symbol){
let list=getWatchlist().filter(s=>s!==symbol);
saveWatchlist(list);
renderWatchlist();
}

function renderWatchlist(){
watchlist.innerHTML="";
getWatchlist().forEach(symbol=>{
const li=document.createElement("li");
li.className="watch-item";
li.innerHTML=`
<span onclick="loadChart('${symbol}')">${symbol}</span>
<span class="price" id="price-${symbol}">...</span>
<button onclick="removeAsset('${symbol}')">X</button>
`;
watchlist.appendChild(li);
});
updatePrices();
}
renderWatchlist();

// ---------- LIVE PRICES ----------
async function updatePrices(){
const list=getWatchlist();
if(!list.length) return;

const ids=list.map(s=>s.split(":")[1].replace("USDT","").toLowerCase()).join(",");
try{
const r=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur`);
const data=await r.json();

list.forEach(symbol=>{
const id=symbol.split(":")[1].replace("USDT","").toLowerCase();
if(data[id]){
document.getElementById("price-"+symbol).innerText=data[id].eur+" €";
}
});
}catch{}
}
setInterval(updatePrices,15000);

// ---------- MARKETS ----------
let marketCache=[];
async function loadMarkets(){
if(marketCache.length) return renderMarkets(marketCache);

const r=await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&per_page=50&page=1");
marketCache=await r.json();
renderMarkets(marketCache);
}

function renderMarkets(list){
marketsList.innerHTML="";
list.forEach(c=>{
marketsList.innerHTML+=`
<li>
${c.name} — ${c.current_price} €
<button class="add-btn" onclick="addAsset('BINANCE:${c.symbol.toUpperCase()}USDT')">⭐</button>
</li>`;
});
}

// ---------- SEARCH ----------
function searchMarket(){
const q=searchMarketInput.value.toLowerCase();
const filtered=marketCache.filter(c=>c.name.toLowerCase().includes(q));
renderMarkets(filtered);
}

// ---------- SCANNER ----------
async function loadScanner(){
const r=await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&price_change_percentage=24h");
const data=await r.json();

scannerList.innerHTML="";
data.filter(c=>c.price_change_percentage_24h>10).slice(0,15).forEach(c=>{
scannerList.innerHTML+=`<li>🔥 ${c.name} (${c.price_change_percentage_24h.toFixed(2)}%)</li>`;
});
}
