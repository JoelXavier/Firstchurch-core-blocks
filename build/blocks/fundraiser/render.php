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
if (!function_exists('antigravity_format_currency')) {
    function antigravity_format_currency($amount)
    {
        return '$' . number_format($amount, 0);
    }
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'antigravity-fundraiser'
]);
?>

<section <?php echo $wrapper_attributes; ?>>

    <div class="fundraiser-header">
        <h2 class="fundraiser-title"><?php echo wp_kses_post($title); ?></h2>
        <div class="fundraiser-line"></div>
    </div>

    <div class="fundraiser-container">
        <!-- Metrics -->
        <div class="fundraiser-metrics">
            <div class="metric-group">
                <span class="metric-label">Raised</span>
                <span class="metric-value raised"><?php echo antigravity_format_currency($raised_amount); ?></span>
            </div>
            <div class="metric-group" style="text-align: right;">
                <span class="metric-label">Goal</span>
                <span class="metric-value goal"><?php echo antigravity_format_currency($goal_amount); ?></span>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-track" aria-valuemin="0" aria-valuemax="<?php echo esc_attr($goal_amount); ?>"
            aria-valuenow="<?php echo esc_attr($raised_amount); ?>" role="progressbar">
            <div class="progress-fill" style="width: <?php echo esc_attr($percentage); ?>%;"></div>
        </div>

        <!-- Actions -->
        <div class="fundraiser-actions">
            <a href="<?php echo esc_url($link_url); ?>" class="donate-button">
                <?php echo esc_html($link_text); ?>
            </a>
        </div>
    </div>

</section>