// -------- NAVIGATION SPA --------

const links = document.querySelectorAll(".sidebar a");
const views = document.querySelectorAll(".view");

links.forEach(link=>{
    link.addEventListener("click",()=>{

        links.forEach(l=>l.classList.remove("active"));
        link.classList.add("active");

        const target = link.textContent.trim().toLowerCase();

        views.forEach(v=>v.classList.remove("active"));

        if(target==="dashboard") document.getElementById("dashboardView").classList.add("active");
        if(target==="marchés") loadMarkets();
        if(target==="scanner") loadScannerAdvanced();
        if(target==="analyses") document.getElementById("analysisView").classList.add("active");
    });
});

// -------- TRADINGVIEW --------

new TradingView.widget({
    autosize:true,
    symbol:"BINANCE:BTCUSDT",
    theme:"dark",
    container_id:"tv_chart"
});

// -------- DASHBOARD SCANNER --------

async function loadDashboard(){
    const r=await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=volume_desc&per_page=50&page=1&price_change_percentage=24h");
    const data=await r.json();

    const gainers=[...data].sort((a,b)=>b.price_change_percentage_24h-a.price_change_percentage_24h).slice(0,5);
    const losers=[...data].sort((a,b)=>a.price_change_percentage_24h-b.price_change_percentage_24h).slice(0,5);

    render("gainers",gainers);
    render("losers",losers);
}

function render(id,list){
    const ul=document.getElementById(id);
    ul.innerHTML="";
    list.forEach(c=>{
        ul.innerHTML+=`<li>${c.name} (${c.price_change_percentage_24h.toFixed(2)}%)</li>`;
    });
}

loadDashboard();

// -------- PAGE MARCHÉS --------

async function loadMarkets(){
    document.getElementById("marketsView").classList.add("active");

    const r=await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=30&page=1");
    const data=await r.json();

    const ul=document.getElementById("marketsList");
    ul.innerHTML="";

    data.forEach(c=>{
        ul.innerHTML+=`<li>${c.name} — ${c.current_price} €</li>`;
    });
}

// -------- SCANNER AVANCÉ --------

async function loadScannerAdvanced(){
    document.getElementById("scannerView").classList.add("active");

    const r=await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=volume_desc&per_page=100&page=1&price_change_percentage=24h");
    const data=await r.json();

    const strong=data.filter(c=>c.price_change_percentage_24h>10);

    const ul=document.getElementById("scannerList");
    ul.innerHTML="";

    strong.forEach(c=>{
        ul.innerHTML+=`<li>🔥 ${c.name} (${c.price_change_percentage_24h.toFixed(2)}%)</li>`;
    });
}
