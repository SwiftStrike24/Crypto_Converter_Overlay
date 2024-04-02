document.addEventListener('DOMContentLoaded', () => {
    const convertButton = document.getElementById('convert-button');
    const amountInput = document.getElementById('amount-input');
    const currencySymbolSelect = document.getElementById('currency-symbol-select');
    const resultDisplay = document.getElementById('result-display');

    convertButton.addEventListener('click', async () => {
        const amount = amountInput.value;
        const symbol = currencySymbolSelect.value;
        resultDisplay.style.display = 'none';
        convertButton.textContent = 'Converting...';
        convertButton.disabled = true;

        try {
            const response = await fetch(`/convert?amount=${amount}&symbol=${symbol}`);
            const data = await response.json();
            if (data.convertedAmount) {
                resultDisplay.textContent = `Converted Amount: ${data.convertedAmount.toFixed(2)} CAD`;
                resultDisplay.className = 'alert alert-success';
            } else {
                resultDisplay.textContent = 'Error in conversion.';
                resultDisplay.className = 'alert alert-danger';
            }
            resultDisplay.style.display = 'block';
        } catch (error) {
            console.error('Error fetching conversion:', error);
            resultDisplay.textContent = 'Error fetching conversion.';
            resultDisplay.className = 'alert alert-danger';
            resultDisplay.style.display = 'block';
        }

        convertButton.textContent = 'Convert';
        convertButton.disabled = false;
    });
});
