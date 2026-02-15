// CHART
function loadChart(symbol="BINANCE:BTCUSDT") {
    document.getElementById("tv_chart").innerHTML="";

    new TradingView.widget({
        autosize:true,
        symbol:symbol,
        theme:"dark",
        interval:"60",
        container_id:"tv_chart"
    });
}

loadChart();

// SCANNER
async function loadScanner(){
    const r=await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=volume_desc&per_page=100&page=1&price_change_percentage=24h"
    );
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
        const li=document.createElement("li");
        const cls=c.price_change_percentage_24h>0?"up":"down";

        li.innerHTML=`
            ${c.name}
            <span class="${cls}">
                ${c.price_change_percentage_24h.toFixed(2)}%
            </span>
        `;
        ul.appendChild(li);
    });
}

loadScanner();
