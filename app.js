// ================= TRADINGVIEW =================

let currentSymbol = "BINANCE:BTCUSDT";

function loadChart(symbol) {
    currentSymbol = symbol;

    document.getElementById("tv_chart").innerHTML = "";

    new TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: "60",
        timezone: "Europe/Paris",
        theme: "dark",
        style: "1",
        locale: "fr",
        container_id: "tv_chart"
    });
}

function changeSymbol() {
    let input = document.getElementById("symbolInput").value.toUpperCase();

    if (!input) return;

    if (!input.includes(":")) input = "BINANCE:" + input;

    loadChart(input);
}

// ================= WATCHLIST =================

function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist") || "[]");
}

function saveWatchlist(list) {
    localStorage.setItem("watchlist", JSON.stringify(list));
}

function addToWatchlist() {
    let list = getWatchlist();

    if (!list.includes(currentSymbol)) {
        list.push(currentSymbol);
        saveWatchlist(list);
        renderWatchlist();
    }
}

function removeSymbol(symbol) {
    let list = getWatchlist().filter(s => s !== symbol);
    saveWatchlist(list);
    renderWatchlist();
}

function renderWatchlist() {
    const ul = document.getElementById("watchlist");
    ul.innerHTML = "";

    getWatchlist().forEach(symbol => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span onclick="loadChart('${symbol}')">${symbol}</span>
            <button onclick="removeSymbol('${symbol}')">❌</button>
        `;

        ul.appendChild(li);
    });
}

// ================= SCANNER =================

async function loadScanner() {

    const minVolume = Number(document.getElementById("minVolume").value);

    const url =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=volume_desc&per_page=250&page=1&price_change_percentage=24h";

    const response = await fetch(url);
    const data = await response.json();

    const filtered = data.filter(c => c.total_volume >= minVolume);

    const gainers = [...filtered]
        .sort((a,b)=> b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0,10);

    const losers = [...filtered]
        .sort((a,b)=> a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0,10);

    displayList("gainers", gainers);
    displayList("losers", losers);
}

function displayList(id, list) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";

    list.forEach(c => {
        const li = document.createElement("li");

        const cls = c.price_change_percentage_24h >= 0 ? "up" : "down";

        li.innerHTML = `
            ${c.name} (${c.symbol.toUpperCase()})
            <span class="${cls}">
                ${c.price_change_percentage_24h.toFixed(2)}%
            </span>
        `;

        ul.appendChild(li);
    });
}

// INIT
loadChart(currentSymbol);
renderWatchlist();
loadScanner();
