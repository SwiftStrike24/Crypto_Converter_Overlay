// converter.js v1.2

document.addEventListener('DOMContentLoaded', () => {
    const cryptoInput = document.getElementById('crypto-input');
    const fiatInput = document.getElementById('fiat-input');
    const cryptoSymbolSelect = document.getElementById('crypto-symbol-select');
    const fiatSymbolSelect = document.getElementById('fiat-symbol-select');
    const resultDisplay = document.getElementById('result-display');
    const cryptoChosen = document.getElementById('crypto-chosen');
    const fiatChosen = document.getElementById('fiat-chosen');
    const fiatValue = document.getElementById('fiat-value');

    // Function to clear both input fields
    function clearInputs() {
        cryptoInput.value = '';
        fiatInput.value = '';
    }

    // Function to update result display
    function updateResultDisplay(message, className) {
        resultDisplay.textContent = message;
        resultDisplay.className = `alert ${className}`;
        resultDisplay.style.display = 'block';
    }

    // Function to format the converted amount based on the type of currency
    function formatConvertedAmount(amount, isCrypto) {
        const decimalPlaces = isCrypto ? 8 : 2;
        return Number(amount).toFixed(decimalPlaces);
    }

    // Function to debounce a function call
    function debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }

    // Function to convert between crypto and fiat
    async function convertCurrencies() {
        const cryptoAmount = cryptoInput.value;
        const fiatAmount = fiatInput.value;
        const cryptoSymbol = cryptoSymbolSelect.value;
        const fiatSymbol = fiatSymbolSelect.value;

        const isConvertingToCrypto = Boolean(fiatAmount);
        let amount = cryptoAmount || fiatAmount;
        let fromSymbol = cryptoAmount ? cryptoSymbol : fiatSymbol;
        let toSymbol = cryptoAmount ? fiatSymbol : cryptoSymbol;

        if (!amount || amount <= 0 || !fromSymbol || !toSymbol) {
            updateResultDisplay('Please enter a valid amount and select both currencies.', 'alert-danger');
            return;
        }

        try {
            const response = await fetch(`/convert?cryptoAmount=${cryptoAmount}&fiatAmount=${fiatAmount}&cryptoSymbol=${cryptoSymbol}&fiatSymbol=${fiatSymbol}`);
            const data = await response.json();

            if (response.ok) {
                const convertedValue = isConvertingToCrypto ? cryptoInput : fiatInput;
                convertedValue.value = formatConvertedAmount(data.price, isConvertingToCrypto);
                updateResultDisplay(`Converted amount: ${convertedValue.value} ${toSymbol}`, 'alert-success');
            } else {
                throw new Error(data.error || 'Conversion failed');
            }
        } catch (error) {
            console.error('Error during conversion:', error);
            updateResultDisplay('Error in conversion.', 'alert-danger');
        }
    }

    // Function to update the live price feed display
    async function updateLivePriceDisplay() {
        const cryptoSymbol = cryptoSymbolSelect.value;
        const fiatSymbol = fiatSymbolSelect.value;

        try {
            const response = await fetch(`/live-price?cryptoSymbol=${cryptoSymbol}&fiatSymbol=${fiatSymbol}`);
            const data = await response.json();
            console.log("API Response:", data);  // This should log the expected structure

            if (response.ok && data.status === 'success') {
                // Ensure DOM elements are correctly identified
                console.log(`DOM Elements:`, {
                cryptoChosen,
                fiatValue,
                fiatChosen
                });

                // Log the data to be assigned
                console.log("Data to update:", {
                crypto: data.crypto,
                convertedAmount: data.convertedAmount.toFixed(2),
                fiat: data.fiat
                });

                cryptoChosen.textContent = data.crypto.toUpperCase();
                fiatValue.textContent = parseFloat(data.convertedAmount).toFixed(2);
                fiatChosen.textContent = data.fiat.toUpperCase();
            } else {
                throw new Error(data.error || 'Failed to fetch live price');
            }
        } catch (error) {
            console.error('Error fetching live price:', error);
        }
    }

    // Start updating the live price feed on load
    updateLivePriceDisplay();
    setInterval(updateLivePriceDisplay, 30000); // Update every 30 seconds

    // Add smooth transition effects to the input fields
    function applyInputFocusEffects(input) {
        input.addEventListener('focus', () => {
            input.style.background = 'rgba(255, 255, 255, 0.95)';
            input.style.transition = 'background 0.3s ease';
        });
        input.addEventListener('blur', () => {
            input.style.background = 'rgba(255, 255, 255, 0.75)';
        });
    }

    applyInputFocusEffects(cryptoInput);
    applyInputFocusEffects(fiatInput);

    // Event listeners for conversion triggers
    const debouncedConvertCurrencies = debounce(convertCurrencies, 500);
    cryptoInput.addEventListener('input', () => {
        fiatInput.value = '';
        if (cryptoInput.value) {
            debouncedConvertCurrencies();
        }
    });
    fiatInput.addEventListener('input', () => {
        cryptoInput.value = '';
        if (fiatInput.value) {
            debouncedConvertCurrencies();
        }
    });

    cryptoSymbolSelect.addEventListener('change', () => {
        if (cryptoInput.value || fiatInput.value) {
            debouncedConvertCurrencies();
        }
        updateLivePriceDisplay();
    });

    fiatSymbolSelect.addEventListener('change', () => {
        if (cryptoInput.value || fiatInput.value) {
            debouncedConvertCurrencies();
        }
        updateLivePriceDisplay();
    });

    // Update the live price feed when currencies are changed
    cryptoSymbolSelect.addEventListener('change', updateLivePriceDisplay);
    fiatSymbolSelect.addEventListener('change', updateLivePriceDisplay);
});
