async function loadCrypto() {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=5&page=1";

    const response = await fetch(url);
    const data = await response.json();

    const container = document.getElementById("crypto-data");
    container.innerHTML = "";

    data.forEach(coin => {
        const change = coin.price_change_percentage_24h;
        const colorClass = change >= 0 ? "up" : "down";

        container.innerHTML += `
            <div class="card">
                <h3>${coin.name}</h3>
                <p>Prix : ${coin.current_price} €</p>
                <p class="${colorClass}">
                    ${change.toFixed(2)} %
                </p>
            </div>
        `;
    });
}

loadCrypto();
setInterval(loadCrypto, 60000);
