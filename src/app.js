// app.js v2.1

// Load environment variables from the .env file
require('dotenv').config();

// Import express for server functionality and axios for making API requests
const express = require('express');
const axios = require('axios');

// Initialize the Express application
const app = express();

// Import the lists of supported cryptocurrencies and fiat currencies
const cryptoList = require('../cryptos.json');
const fiatList = require('../fiats.json');

// Set up middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Home route to render the main page with lists of currencies
app.get('/', (req, res) => {
    res.render('index', { cryptoList: cryptoList, fiatList: fiatList });
});

// Define the API key and base URL for the CoinMarketCap API
const API_KEY = process.env.COINMARKETCAP_API_KEY;
const PRICE_CONVERSION_URL = 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion';
const QUOTES_LATEST_URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';

// Define the base URL for the CoinConvert API endpoint
const COINCONVERT_URL = 'https://api.coinconvert.net/convert';

// Asynchronous function to handle currency conversion
async function convertCurrency(amount, fromSymbol, toSymbol) {
    const fromCrypto = cryptoList.find(crypto => crypto.symbol === fromSymbol);
    const toCrypto = cryptoList.find(crypto => crypto.symbol === toSymbol);
    const fromFiat = fiatList.find(fiat => fiat.symbol === fromSymbol);
    const toFiat = fiatList.find(fiat => fiat.symbol === toSymbol);

    let params = {};
    let requestUrl = PRICE_CONVERSION_URL;

    if (fromCrypto) {
        params = { amount: amount, symbol: fromSymbol, convert: toSymbol };
    } else if (fromFiat && toCrypto) {
        // Fiat to crypto conversion using CoinConvert API
        requestUrl = `${COINCONVERT_URL}/${fromSymbol.toLowerCase()}/${toSymbol.toLowerCase()}?amount=${amount}`;
        return axios.get(requestUrl).then(response => {
            if (response.data.status === 'success') {
                return {
                    price: response.data[toSymbol],
                    last_updated: new Date().toISOString()
                };
            }
            throw new Error('Failed to convert using CoinConvert API');
        });
    } else {
        console.error('Invalid conversion symbols:', fromSymbol, toSymbol);
        throw new Error('Invalid currency symbols');
    }

    console.log('Converting currency with the following parameters:', params);

    try {
        const response = await axios.get(requestUrl, {
            headers: { 'X-CMC_PRO_API_KEY': API_KEY },
            params: params
        });

        console.log('API response:', response.data);

        if (response.data.data && response.data.data.length > 0 && response.data.data[0].quote && response.data.data[0].quote[toSymbol]) {
            return {
                price: response.data.data[0].quote[toSymbol].price,
                last_updated: response.data.data[0].quote[toSymbol].last_updated
            };
        }
        throw new Error('Conversion data missing in API response');
    } catch (error) {
        console.error('Error while making API request:', error);
        throw error;
    }
}

// Route for handling conversion requests
app.get('/convert', async (req, res) => {
    const { cryptoAmount, fiatAmount, cryptoSymbol, fiatSymbol } = req.query;
    let amount = cryptoAmount || fiatAmount;
    let fromSymbol = cryptoAmount ? cryptoSymbol : fiatSymbol;
    let toSymbol = cryptoAmount ? fiatSymbol : cryptoSymbol;

    if (!amount || parseFloat(amount) <= 0) {
        console.error('Invalid amount provided:', amount);
        return res.status(400).json({ error: 'Invalid amount for conversion' });
    }

    try {
        const conversionResult = await convertCurrency(amount, fromSymbol, toSymbol);
        res.json(conversionResult);
    } catch (error) {
        console.error('Error occurred during conversion:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route for fetching live price feed using CoinConvert API
app.get('/live-price', async (req, res) => {
    // Extract crypto and fiat symbols from the query string
    const cryptoSymbol = req.query.crypto; // ensure this matches the query parameter name
    const fiatSymbol = req.query.fiat; // ensure this matches the query parameter name

    // Validate input
    if (!cryptoSymbol || !fiatSymbol) {
        return res.status(400).json({ error: 'Missing cryptocurrency or fiat symbol' });
    }

    // Set a default amount, since the conversion rate does not depend on the amount for display purposes
    const amount = '1'; // Default amount for live price query

    try {
        const url = `${COINCONVERT_URL}/${cryptoSymbol.toLowerCase()}/${fiatSymbol.toLowerCase()}?amount=${amount}`;
        const response = await axios.get(url);
        
        if (response.data.status === 'success') {
            const cryptoAmount = response.data[cryptoSymbol.toUpperCase()];
            const fiatAmount = response.data[fiatSymbol.toUpperCase()];
            const conversionRate = fiatAmount / cryptoAmount;

            res.json({
                status: 'success',
                crypto: cryptoSymbol,
                fiat: fiatSymbol,
                amount: cryptoAmount,
                convertedAmount: fiatAmount,
                conversionRate: conversionRate,
                last_updated: new Date().toISOString() // Use the current time as the last updated timestamp
            });
        } else {
            res.status(500).json({ message: 'API call was not successful', details: response.data });
        }
    } catch (error) {
        console.error('Error fetching live price from CoinConvert API:', error);
        res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
});

// New route for testing API
app.get('/test-api', async (req, res) => {
    // Retrieve crypto and fiat parameters from the query string or default to BTC and USD
    const cryptoInput = req.query.crypto || 'btc'; // default to 'btc' if no crypto query param
    const fiatInput = req.query.fiat || 'usd'; // default to 'usd' if no fiat query param
    const amount = req.query.amount || '1'; // default to 1 if no amount query param

    try {
        const url = `${COINCONVERT_URL}/${cryptoInput}/${fiatInput}?amount=${amount}`;
        const response = await axios.get(url);

        if (response.data.status === 'success') {
            // Ensure both crypto and fiat amounts are returned from API
            const cryptoAmount = response.data[cryptoInput.toUpperCase()];
            const fiatAmount = response.data[fiatInput.toUpperCase()];

            // Calculate the conversion rate if both amounts are present
            const conversionRate = cryptoAmount && fiatAmount ? fiatAmount / cryptoAmount : null;

            // Format the response for better readability
            const formattedResponse = {
                status: response.data.status,
                amount: cryptoAmount,
                convertedAmount: fiatAmount,
                conversionRate: conversionRate
            };
            res.json(formattedResponse);
        } else {
            res.status(500).json({ message: 'API call was not successful', details: response.data });
        }
    } catch (error) {
        console.error('Error fetching data from CoinConvert API:', error);
        res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});