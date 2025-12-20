<?php
/**
 * Render for Fundraiser Card
 */

$label = isset($attributes['label']) ? (string) $attributes['label'] : 'CAMPAIGN';
$title = isset($attributes['title']) ? (string) $attributes['title'] : '';
$description = isset($attributes['description']) ? (string) $attributes['description'] : '';
$useDashboardData = isset($attributes['useDashboardData']) ? (bool) $attributes['useDashboardData'] : false;
$fundraiserId = isset($attributes['fundraiserId']) ? $attributes['fundraiserId'] : null;
$goalAmount = isset($attributes['goalAmount']) ? (float) $attributes['goalAmount'] : 1000000.0;
$raisedAmount = isset($attributes['raisedAmount']) ? (float) $attributes['raisedAmount'] : 250000.0;
$showProgress = isset($attributes['showProgress']) ? (bool) $attributes['showProgress'] : true;
$linkText = isset($attributes['linkText']) ? (string) $attributes['linkText'] : 'MAKE A SACRIFICE';
$linkUrl = isset($attributes['linkUrl']) ? (string) $attributes['linkUrl'] : '#';

// Handle Dashboard Data Query
if ($useDashboardData && $fundraiserId) {
    $allFundraisers = get_option('fc_fundraiser_data', []);
    if (is_array($allFundraisers)) {
        foreach ($allFundraisers as $f) {
            if (isset($f['id']) && $f['id'] == $fundraiserId) {
                $title = (string) ($f['title'] ?? $title);
                $goalAmount = (float) ($f['goal'] ?? 0);
                $raisedAmount = (float) ($f['raised'] ?? 0);
                break;
            }
        }
    }
}

$percentage = 0;
if ($goalAmount > 0) {
    $percentage = min(100, max(0, ($raisedAmount / $goalAmount) * 100));
}

$format_currency = function ($val) {
    return '$' . number_format((float) $val);
};

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-fundraiser-card'
]);

?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="fc-fundraiser-card__inner">
        <?php if (!empty($label)): ?>
            <span class="fc-fundraiser-card__label"><?php echo esc_html($label); ?></span>
        <?php endif; ?>

        <h3 class="fc-fundraiser-card__title"><?php echo esc_html($title); ?></h3>

        <?php if (!empty($description)): ?>
            <p class="fc-fundraiser-card__description"><?php echo esc_html($description); ?></p>
        <?php endif; ?>

        <?php if ($showProgress): ?>
            <div class="fc-fundraiser-card__progress-container">
                <div class="fc-fundraiser-card__metrics">
                    <div class="fc-fundraiser-card__metric-group">
                        <span class="fc-fundraiser-card__metric-label">Raised</span>
                        <span
                            class="fc-fundraiser-card__metric-val"><?php echo esc_html($format_currency($raisedAmount)); ?></span>
                    </div>
                    <div class="fc-fundraiser-card__metric-group">
                        <span class="fc-fundraiser-card__metric-label">Goal</span>
                        <span
                            class="fc-fundraiser-card__metric-val"><?php echo esc_html($format_currency($goalAmount)); ?></span>
                    </div>
                </div>
                <div class="fc-fundraiser-card__progress-track">
                    <div class="fc-fundraiser-card__progress-fill" style="width: <?php echo (float) $percentage; ?>%;">
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <div class="fc-fundraiser-card__footer">
            <a href="<?php echo esc_url($linkUrl); ?>" class="fc-fundraiser-card__button">
                <?php echo esc_html($linkText); ?>
            </a>
        </div>
    </div>
</div>