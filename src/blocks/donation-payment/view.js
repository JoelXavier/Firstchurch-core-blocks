document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.fc-donation-payment');

    blocks.forEach(block => {
        const amountBtns = block.querySelectorAll('.fc-donation-payment__amount-btn');
        const customInput = block.querySelector('.fc-js-custom-amount');
        const summaryAmountSpan = block.querySelector('.fc-js-summary-amount');
        const summaryTotalSpan = block.querySelector('.fc-js-summary-total');

        const formatCurrency = (val) => {
            return '$' + new Intl.NumberFormat('en-US').format(val) + '.00';
        };

        const updateSummary = (val) => {
            const formatted = formatCurrency(val);
            if (summaryAmountSpan) summaryAmountSpan.textContent = formatted;
            if (summaryTotalSpan) summaryTotalSpan.textContent = formatted;
        };

        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Clear active state from other buttons
                amountBtns.forEach(b => b.classList.remove('is-selected'));
                // Set active state
                btn.classList.add('is-selected');
                // Clear custom input
                if (customInput) customInput.value = '';
                // Update summary
                const amount = btn.getAttribute('data-amount');
                updateSummary(amount);
            });
        });

        if (customInput) {
            customInput.addEventListener('input', (e) => {
                const val = e.target.value;
                if (val) {
                    // Clear buttons
                    amountBtns.forEach(b => b.classList.remove('is-selected'));
                    // Update summary
                    updateSummary(val);
                } else {
                    // Revert to default or first button?
                    // Let's find the first button with is-selected or just leave at 0
                }
            });
        }
    });
});
