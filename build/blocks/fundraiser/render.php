<?php
/**
 * Render callback for the Fundraiser block.
 */

$attributes = $attributes ?? [];
$title = $attributes['title'] ?? 'Fundraiser';
$goal_amount = $attributes['goalAmount'] ?? 5000000;
$raised_amount = $attributes['raisedAmount'] ?? 1644394;
$link_text = $attributes['linkText'] ?? 'Donate Now';
$link_url = $attributes['linkUrl'] ?? '#';

// Calculate Percentage
$percentage = 0;
if ($goal_amount > 0) {
    $percentage = min(100, max(0, ($raised_amount / $goal_amount) * 100));
}

// Format Currency helper
if (!function_exists('fc_fundraiser_format_currency')) {
    function fc_fundraiser_format_currency($amount)
    {
        return '$' . number_format($amount, 0);
    }
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-fundraiser'
]);
?>

<section <?php echo $wrapper_attributes; ?>>

    <div class="fc-fundraiser__header">
        <h2 class="fc-fundraiser__title"><?php echo wp_kses_post($title); ?></h2>
        <div class="fc-fundraiser__line"></div>
    </div>

    <div class="fc-fundraiser__container">
        <!-- Metrics -->
        <div class="fc-fundraiser__metrics">
            <div class="fc-fundraiser__metric-group">
                <span class="fc-fundraiser__metric-label">Raised</span>
                <span
                    class="fc-fundraiser__metric-value fc-fundraiser__metric-value--raised"><?php echo fc_fundraiser_format_currency($raised_amount); ?></span>
            </div>
            <div class="fc-fundraiser__metric-group" style="text-align: right;">
                <span class="fc-fundraiser__metric-label">Goal</span>
                <span
                    class="fc-fundraiser__metric-value fc-fundraiser__metric-value--goal"><?php echo fc_fundraiser_format_currency($goal_amount); ?></span>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="fc-fundraiser__progress-track" aria-valuemin="0"
            aria-valuemax="<?php echo esc_attr($goal_amount); ?>"
            aria-valuenow="<?php echo esc_attr($raised_amount); ?>" role="progressbar">
            <div class="fc-fundraiser__progress-fill" style="width: <?php echo esc_attr($percentage); ?>%;"></div>
        </div>

        <!-- Actions -->
        <div class="fc-fundraiser__actions">
            <a href="<?php echo esc_url($link_url); ?>" class="fc-fundraiser__button">
                <?php echo esc_html($link_text); ?>
            </a>
        </div>
    </div>

</section>