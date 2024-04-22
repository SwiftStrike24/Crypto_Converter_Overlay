# Crypto Converter App

## Overview

This app is designed to convert cryptocurrencies to fiat currencies and vice versa using the CoinMarketCap API. It features a simple user interface for selecting the amount and type of currency to convert.

## Features

- **Direct Crypto-Fiat Exchange**: Execute direct conversions between cryptocurrencies and fiat currencies with high precision.
- **Real-Time Rate Synchronization**: Fetch the latest exchange rates in real-time from CoinMarketCap's API for accurate, up-to-the-minute conversions.
- **Streamlined User Experience**: Interact with a user-centric interface that is both aesthetically pleasing and functionally efficient.
- **Comprehensive Currency Portfolio**: Support for a diverse range of digital currencies, including Bitcoin, Ethereum, and many others, provides a broad spectrum of conversion possibilities.
- **Intelligent Value Tracking**: As you type, witness the agile recalibration of the equivalent currency value, offering a dynamic and uninterrupted user experience.
- **Interactive User Inputs**: The conversion process is simplified, eliminating the need for a separate convert button, and offering instantaneous results as you input values.
- **Drag-and-Drop Customization**: Personalize your conversion interface with drag-and-drop features to prioritize the currencies you use most frequently.
- **Dark Mode Aesthetics**: Toggle between light and dark modes for reduced eye strain and enhanced accessibility during various lighting conditions.
- **Responsive Design**: Ensures seamless operation across various devices and screen sizes, providing a consistent user experience whether on desktop or mobile.
- **Error Handling Mechanisms**: Built-in error responses and informative messages guide the user through correct usage and troubleshooting steps.
- **Extensibility for Future Currencies**: Designed with scalability in mind, the app allows for the easy addition of new cryptocurrencies or fiat currencies to the conversion list.
- **Robust Testing Framework**: Incorporates thorough testing strategies to ensure reliability and performance are maintained across updates.


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
