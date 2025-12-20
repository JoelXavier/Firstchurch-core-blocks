<?php
/**
 * Render for Donation Payment
 */

// Defensive attribute extraction
$amounts = $attributes['amounts'] ?? [10, 25, 50, 75, 100, 250, 500, 1000, 2000];
$default_amount = (int) ($attributes['defaultAmount'] ?? 100);
$button_text = $attributes['buttonText'] ?? __('Donate now', 'first-church-core-blocks');
$title = $attributes['title'] ?? __('How much would you like to donate today?', 'first-church-core-blocks');
$subtitle = $attributes['subtitle'] ?? __('All donations directly impact our organization and help us further our mission.', 'first-church-core-blocks');
$donor_title = $attributes['donorTitle'] ?? __("Who's Donating Today?", 'first-church-core-blocks');
$donor_subtitle = $attributes['donorSubtitle'] ?? __("We'll never share this information with anyone and we sincerely thank you.", 'first-church-core-blocks');
$payment_title = $attributes['paymentTitle'] ?? __("Payment Details", 'first-church-core-blocks');
$payment_subtitle = $attributes['paymentSubtitle'] ?? __("How would you like to pay for your donation?", 'first-church-core-blocks');

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-donation-payment'
]);

?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
    data-default-amount="<?php echo (int) $default_amount; ?>">
    <div class="fc-donation-payment__container">

        <!-- Amount Selection Section -->
        <div class="fc-donation-payment__section">
            <h2 class="fc-donation-payment__section-title"><?php echo esc_html($title); ?></h2>
            <p class="fc-donation-payment__section-subtitle"><?php echo esc_html($subtitle); ?></p>

            <div class="fc-donation-payment__amount-grid">
                <?php foreach ($amounts as $amt):
                    $amt = (int) $amt;
                    if ($amt <= 0)
                        continue;
                    ?>
                    <button type="button"
                        class="fc-donation-payment__amount-btn <?php echo ($amt === $default_amount) ? 'is-selected' : ''; ?>"
                        data-amount="<?php echo (int) $amt; ?>">
                        $<?php echo number_format($amt); ?>.00
                    </button>
                <?php endforeach; ?>
            </div>

            <div class="fc-donation-payment__custom-amount">
                <input type="number"
                    placeholder="<?php esc_attr_e('Enter custom amount', 'first-church-core-blocks'); ?>"
                    class="fc-donation-payment__input fc-js-custom-amount" />
            </div>
        </div>

        <!-- Donor Information Section -->
        <div class="fc-donation-payment__section">
            <h3 class="fc-donation-payment__sub-title"><?php echo esc_html($donor_title); ?></h3>
            <p class="fc-donation-payment__section-subtitle"><?php echo esc_html($donor_subtitle); ?></p>

            <div class="fc-donation-payment__form-grid">
                <div class="fc-donation-payment__field">
                    <label><?php esc_html_e('First name *', 'first-church-core-blocks'); ?></label>
                    <input type="text" name="first_name" placeholder="John" required />
                </div>
                <div class="fc-donation-payment__field">
                    <label><?php esc_html_e('Last name', 'first-church-core-blocks'); ?></label>
                    <input type="text" name="last_name" placeholder="Doe" />
                </div>
            </div>
            <div class="fc-donation-payment__field">
                <label><?php esc_html_e('Email Address *', 'first-church-core-blocks'); ?></label>
                <input type="email" name="email" placeholder="john@example.com" required />
            </div>
        </div>

        <!-- Payment Details Section -->
        <div class="fc-donation-payment__section">
            <h3 class="fc-donation-payment__sub-title"><?php echo esc_html($payment_title); ?></h3>
            <p class="fc-donation-payment__section-subtitle"><?php echo esc_html($payment_subtitle); ?></p>

            <div class="fc-donation-payment__summary-box">
                <h4 class="fc-donation-payment__summary-title">
                    <?php esc_html_e('Donation Summary', 'first-church-core-blocks'); ?></h4>
                <div class="fc-donation-payment__summary-row">
                    <span><?php esc_html_e('Payment Amount', 'first-church-core-blocks'); ?></span>
                    <span class="fc-js-summary-amount">$<?php echo number_format($default_amount); ?>.00</span>
                </div>
                <div class="fc-donation-payment__summary-row">
                    <span><?php esc_html_e('Giving Frequency', 'first-church-core-blocks'); ?></span>
                    <span><?php esc_html_e('One time', 'first-church-core-blocks'); ?></span>
                </div>
                <div class="fc-donation-payment__summary-total">
                    <span><?php esc_html_e('Donation Total', 'first-church-core-blocks'); ?></span>
                    <span class="fc-js-summary-total">$<?php echo number_format($default_amount); ?>.00</span>
                </div>
            </div>

            <div class="fc-donation-payment__method-selector">
                <label>
                    <input type="radio" checked disabled />
                    <span><?php esc_html_e('Donate with Authorized.Net - Credit Cards', 'first-church-core-blocks'); ?></span>
                </label>
            </div>

            <div class="fc-donation-payment__cc-fields">
                <div class="fc-donation-payment__field">
                    <label><?php esc_html_e('Credit Card Info *', 'first-church-core-blocks'); ?></label>
                    <div class="fc-donation-payment__cc-row">
                        <input type="text" placeholder="<?php esc_attr_e('Card number', 'first-church-core-blocks'); ?>"
                            class="fc-cc-number" disabled />
                        <input type="text" placeholder="MM / YY" class="fc-cc-expiry" disabled />
                        <input type="text" placeholder="CVC" class="fc-cc-cvc" disabled />
                    </div>
                </div>
            </div>

            <div class="fc-donation-payment__submit">
                <button type="submit" class="fc-donation-payment__submit-btn">
                    <?php echo esc_html($button_text); ?>
                </button>
            </div>
        </div>
    </div>
</div>