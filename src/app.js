// Load environment variables from a .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const axios = require('axios'); // Used to make HTTP requests to external APIs
const app = express();
const cryptoList = require('../cryptos.json'); // Adjust the path as needed, load the cryptocurrency list

// Serve static files (like CSS, JavaScript, and images) from the 'public' directory
app.use(express.static('public'));

// Set up EJS as the templating engine for rendering views
app.set('view engine', 'ejs');

// Route handler for the home page
app.get('/', (req, res) => {
    // Render the index.ejs template, passing the cryptoList to the view for dynamic dropdown population
    res.render('index', { cryptoList: cryptoList });
});

// CoinMarketCap API configuration
const API_KEY = process.env.COINMARKETCAP_API_KEY; // API key stored in .env file for security
const BASE_URL = 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion';

// Async function for converting cryptocurrency to CAD
async function convertCryptoToCAD(amount, symbol = 'BTC') {
    // Define parameters for the API request
    const params = {
        amount: amount,
        symbol: symbol,
        convert: 'CAD'
    };

    try {
        // Make the GET request to CoinMarketCap API
        const response = await axios.get(BASE_URL, {
            params: params,
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY // Use the API key in the request header
            }
        });

        // Return the response data
        return response.data;
    } catch (error) {
        // Log and return null if an error occurs
        console.error('Error converting currency:', error);
        return null;
    }
}

// Route for handling currency conversion requests
app.get('/convert', async (req, res) => {
    // Destructure amount and symbol from the query parameters
    const { amount, symbol } = req.query;

    // Await the conversion result from the convertCryptoToCAD function
    const result = await convertCryptoToCAD(amount, symbol);

    // Check if the result is valid and contains the necessary data
    if (result && result.data && result.data[0] && result.data[0].quote && result.data[0].quote.CAD) {
        // Prepare the conversion object to send as JSON
        const conversion = {
            symbol: symbol,
            amount: amount,
            convertedAmount: result.data[0].quote.CAD.price,
            lastUpdated: result.data[0].quote.CAD.last_updated
        };
        res.json(conversion); // Send the conversion data as JSON
    } else {
        // Send a 500 status code with an error message if the conversion failed
        res.status(500).json({ error: 'Conversion failed' });
    }
});

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log the server start to the console
});
