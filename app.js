window.addEventListener("load", function () {

    // ---------- LOAD TRADINGVIEW ----------
    function loadChart() {
        if (typeof TradingView === "undefined") {
            console.error("TradingView non chargé");
            return;
        }

        new TradingView.widget({
            autosize: true,
            symbol: "BINANCE:BTCUSDT",
            theme: "dark",
            interval: "60",
            container_id: "tv_chart"
        });
    }

    // ---------- LOAD SCANNER ----------
    async function loadScanner() {
        try {
            const r = await fetch(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=volume_desc&per_page=50&page=1&price_change_percentage=24h"
            );

            const data = await r.json();

            const gainers = [...data]
                .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                .slice(0, 5);

            const losers = [...data]
                .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                .slice(0, 5);

            render("gainers", gainers);
            render("losers", losers);

        } catch (err) {
            console.error("Erreur API :", err);
        }
    }

    function render(id, list) {
        const ul = document.getElementById(id);
        if (!ul) return;

        ul.innerHTML = "";

        list.forEach(c => {
            ul.innerHTML += `<li>${c.name} (${c.price_change_percentage_24h.toFixed(2)}%)</li>`;
        });
    }

    // ---------- INIT ----------
    loadChart();
    loadScanner();

});
