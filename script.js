const apiURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
let selectedCryptos = JSON.parse(localStorage.getItem('selectedCryptos')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadCryptoList();
    loadSelectedCryptos();
    document.getElementById('clear-selection').addEventListener('click', clearSelection);
    document.getElementById('sort-marketcap').addEventListener('click', sortByMarketCap);
    document.getElementById('view-24h-change').addEventListener('click', toggle24hChange);

    // Fetch cryptocurrencies
    fetchCryptocurrencies();
});

// Fetch cryptocurrencies from API
function fetchCryptocurrencies() {
    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayCryptoList(data))
        .catch(error => console.error("Error fetching data:", error));
}

// Load crypto list container
function loadCryptoList() {
    const cryptoItems = document.getElementById('crypto-items');
    cryptoItems.innerHTML = '<p>Loading cryptocurrencies...</p>';
}

// Display list of cryptocurrencies
function displayCryptoList(cryptoData) {
    const cryptoItems = document.getElementById('crypto-items');
    cryptoItems.innerHTML = '';
    cryptoData.forEach(crypto => {
        const listItem = document.createElement('li');
        listItem.textContent = `${crypto.name} (${crypto.symbol.toUpperCase()}) - $${crypto.current_price.toFixed(2)}`;
        listItem.classList.add('crypto-item');
        listItem.addEventListener('click', () => addCryptoToComparison(crypto));
        cryptoItems.appendChild(listItem);
    });
}

// Add cryptocurrency to selected comparison
function addCryptoToComparison(crypto) {
    if (selectedCryptos.some(item => item.id === crypto.id)) {
        alert(`${crypto.name} is already in the comparison list.`);
        return;
    }

    if (selectedCryptos.length < 5) {
        selectedCryptos.push(crypto);
        updateComparison();
        localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
    } else {
        alert("You can compare up to 5 cryptocurrencies only.");
    }
}

// Load and display selected cryptocurrencies
function loadSelectedCryptos() {
    updateComparison();
}

// Update comparison section
function updateComparison() {
    const selectedCryptosDiv = document.getElementById('selected-cryptos');
    selectedCryptosDiv.innerHTML = '';

    if (selectedCryptos.length === 0) {
        selectedCryptosDiv.innerHTML = '<p>No cryptocurrencies selected.</p>';
        return;
    }

    selectedCryptos.forEach(crypto => {
        const div = document.createElement('div');
        div.classList.add('selected-crypto');
        div.textContent = `${crypto.name} - $${crypto.current_price.toFixed(2)}`;
        selectedCryptosDiv.appendChild(div);
    });
}

// Clear selected cryptocurrencies
function clearSelection() {
    selectedCryptos = [];
    localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
    updateComparison();
}

// Sort selected cryptocurrencies by market cap
function sortByMarketCap() {
    selectedCryptos.sort((a, b) => b.market_cap - a.market_cap);
    updateComparison();
}

// Toggle 24-hour price change view
function toggle24hChange() {
    const selectedCryptosDiv = document.getElementById('selected-cryptos');
    if (selectedCryptosDiv.classList.contains('show-24h-change')) {
        selectedCryptosDiv.classList.remove('show-24h-change');
        updateComparison();
    } else {
        selectedCryptosDiv.innerHTML = '';
        selectedCryptos.forEach(crypto => {
            const div = document.createElement('div');
            div.classList.add('selected-crypto');
            div.textContent = `${crypto.name} - 24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%`;
            selectedCryptosDiv.appendChild(div);
        });
        selectedCryptosDiv.classList.add('show-24h-change');
    }
}
