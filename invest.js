// Function to fetch real-time stock data from Alpha Vantage for all companies
async function fetchStockDataForAllCompanies() {
    const apiKey = 'AZI7DSNC1G4BMYYE';
    const symbols = ['GOOGL', 'MSFT', 'AAPL', 'AMZN', 'TSLA']; // Add more symbols as needed
    const stockData = {};

    // Iterate through each symbol and fetch real-time data
    for (const symbol of symbols) {
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            // Extract the latest stock price from the response data
            const latestPrice = data['Time Series (5min)'][Object.keys(data['Time Series (5min)'])[0]]['4. close'];
            stockData[symbol] = latestPrice;
        } catch (error) {
            console.error('Error fetching stock data for', symbol, ':', error);
            stockData[symbol] = null;
        }
    }

    return stockData;
}

// Function to make an investment
async function makeInvestment() {
    const amount = parseFloat(document.getElementById('amount').value);
    const company = document.getElementById('company').value;

    if (amount <= 0 || !company) {
        alert("Please enter a valid amount and select a company.");
        return;
    }

    // Fetch real-time stock data for all companies
    const stockData = await fetchStockDataForAllCompanies();

    // Check if the selected company is valid
    if (!(company in stockData) || stockData[company] === null) {
        alert("Failed to fetch stock data for the selected company. Please try again later.");
        return;
    }

    // Use the fetched data for the selected company
    const latestPrice = stockData[company];
    console.log("Investing " + amount + " HW in " + company + " at $" + latestPrice + " per share");
}
