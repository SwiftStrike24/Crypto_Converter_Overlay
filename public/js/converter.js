document.addEventListener('DOMContentLoaded', () => {
    const cryptoInput = document.getElementById('crypto-input');
    const fiatInput = document.getElementById('fiat-input');
    const cryptoSymbolSelect = document.getElementById('crypto-symbol-select');
    const fiatSymbolSelect = document.getElementById('fiat-symbol-select');
    const resultDisplay = document.getElementById('result-display');

    // Function to clear the non-active input field
    function clearOtherInput(activeInput) {
        if (activeInput === cryptoInput) {
            fiatInput.value = ''; // Clear the fiat input if crypto input is active
        } else {
            cryptoInput.value = ''; // Clear the crypto input if fiat input is active
        }
    }

    // Function to update result display
    const updateResultDisplay = (message, className) => {
        resultDisplay.textContent = message;
        resultDisplay.className = `alert ${className}`;
        resultDisplay.style.display = 'block';
    };

    // Function to format the converted amount based on the type of currency
    const formatConvertedAmount = (amount, isCrypto) => {
        // Use more decimal places for cryptocurrencies, fewer for fiat
        const decimalPlaces = isCrypto ? 8 : 2;
        return Number(amount).toFixed(decimalPlaces);
    };

    // Function to convert between crypto and fiat
    const convertCurrencies = async () => {
        const cryptoAmount = cryptoInput.value;
        const fiatAmount = fiatInput.value;
        const cryptoSymbol = cryptoSymbolSelect.value;
        const fiatSymbol = fiatSymbolSelect.value;

        // Determine if the active conversion is to or from crypto
        const isConvertingToCrypto = Boolean(fiatAmount);

        // Check which input is active and set the amount and symbols accordingly
        let amount = cryptoAmount ? cryptoAmount : fiatAmount;
        let fromSymbol = cryptoAmount ? cryptoSymbol : fiatSymbol;
        let toSymbol = cryptoAmount ? fiatSymbol : cryptoSymbol;

        // Prevent conversion if amount is invalid or symbols are not selected
        if (!amount || amount <= 0 || !fromSymbol || !toSymbol) {
            updateResultDisplay('Please enter a valid amount and select both currencies.', 'alert-danger');
            return;
        }

        try {
            const response = await fetch(`/convert?cryptoAmount=${cryptoAmount}&fiatAmount=${fiatAmount}&cryptoSymbol=${cryptoSymbol}&fiatSymbol=${fiatSymbol}`);
            const data = await response.json();

            if (response.ok) {
                let convertedValue = isConvertingToCrypto ? cryptoInput : fiatInput;
                convertedValue.value = formatConvertedAmount(data.price, isConvertingToCrypto);
                updateResultDisplay(`Converted amount: ${convertedValue.value} ${toSymbol}`, 'alert-success');
            } else {
                throw new Error(data.error || 'Conversion failed');
            }
        } catch (error) {
            console.error('Error during conversion:', error);
            updateResultDisplay('Error in conversion.', 'alert-danger');
        }
    };

    // Event listener for the input fields to trigger conversion on input change
    cryptoInput.addEventListener('input', () => {
        clearOtherInput(cryptoInput);
        convertCurrencies();
    });
    fiatInput.addEventListener('input', () => {
        clearOtherInput(fiatInput);
        convertCurrencies();
    });

    // Event listeners for the currency selection dropdowns to trigger conversion on change
    cryptoSymbolSelect.addEventListener('change', convertCurrencies);
    fiatSymbolSelect.addEventListener('change', convertCurrencies);
});
