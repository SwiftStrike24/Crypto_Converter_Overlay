document.addEventListener('DOMContentLoaded', () => {
    const cryptoInput = document.getElementById('crypto-input');
    const fiatInput = document.getElementById('fiat-input');
    const cryptoSymbolSelect = document.getElementById('crypto-symbol-select');
    const fiatSymbolSelect = document.getElementById('fiat-symbol-select');
    const resultDisplay = document.getElementById('result-display');

    // Function to clear both input fields
    function clearInputs() {
        cryptoInput.value = '';
        fiatInput.value = '';
    }

    // Function to update result display
    const updateResultDisplay = (message, className) => {
        resultDisplay.textContent = message;
        resultDisplay.className = `alert ${className}`;
        resultDisplay.style.display = 'block';
    };

    // Function to format the converted amount based on the type of currency
    const formatConvertedAmount = (amount, isCrypto) => {
        const decimalPlaces = isCrypto ? 8 : 2;
        return Number(amount).toFixed(decimalPlaces);
    };

    // Function to debounce a function call
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    // Function to convert between crypto and fiat
    const convertCurrencies = async () => {
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

    // Add smooth transition effects to the input
    const applyInputFocusEffects = (input) => {
        input.addEventListener('focus', () => {
            input.style.background = 'rgba(255, 255, 255, 0.95)';
            input.style.transition = 'background 0.3s ease';
        });
        input.addEventListener('blur', () => {
            input.style.background = 'rgba(255, 255, 255, 0.75)';
        });
    };

    // Apply the effects to the crypto and fiat inputs
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
        clearInputs();
        updateResultDisplay('', '');
    });
    fiatSymbolSelect.addEventListener('change', () => {
        clearInputs();
        updateResultDisplay('', '');
    });
});