# Crypto Converter App

## Overview

This app is designed to convert cryptocurrencies to fiat currencies and vice versa using the CoinMarketCap API. It features a simple user interface for selecting the amount and type of currency to convert.

## Features

- **Instant Crypto-Fiat Conversions**: Rapidly convert between cryptocurrencies and fiat currencies with accuracy.
- **Live Market Rates**: Access real-time exchange rates from CoinMarketCap for up-to-date conversions.
- **Intuitive Interface**: A minimalist design facilitates easy navigation and operation.
- **Broad Currency Support**: Includes a wide array of cryptocurrencies, including Bitcoin and Ethereum.
- **Dynamic Updates**: Input fields adjust in real-time, providing immediate conversion feedback.
- **Responsive Design**: Optimized for a consistent experience across desktop and mobile devices.
- **Error Handling**: Integrates error feedback for user guidance and seamless operation.
- **Scalable Architecture**: Easily expandable to include additional currencies as needed.
- **Tested Reliability**: Undergone extensive testing to ensure dependable functionality.


## Setup

To get the app running locally on your machine, follow these steps:

1. **Clone the repository:**
    ```
    git clone <repository_url>
    cd path_to_cloned_repository
    ```

2. **Install Node.js and npm:**
    Make sure you have Node.js and npm installed on your system. If not, you can download and install them from [Node.js official website](https://nodejs.org/).

3. **Install dependencies:**
    ```
    npm install
    ```

4. **Setup environment variables:**
    Rename the `.env.template` file to `.env` and update it with your CoinMarketCap API key:
    ```
    COINMARKETCAP_API_KEY=your_api_key_here
    ```

5. **Start the application:**
    ```
    npm start
    ```
    The app should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

Once the app is running, navigate to the home page where you will see two input fields for the amount to be converted. Select the type of currency from the dropdown menus and enter the amount. The conversion result will be displayed below the input fields.

## Shortcut Activation

Quickly activate/deactivate the conversion tool with the `Ctrl+Shift+X` shortcut, streamlining your workflow.

## Contributing

Contributions to the Crypto Converter app are welcome. If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

X / Twitter - [@dayenoor](https://twitter.com/dayenoor)

Project Link: [https://github.com/SwiftStrike24/Crypto_Converter_Overlay](https://github.com/SwiftStrike24/Crypto_Converter_Overlay)

## Acknowledgments

- [CoinMarketCap API](https://coinmarketcap.com/api/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Axios](https://github.com/axios/axios)
- [EJS](https://ejs.co/)
