<?php
/**
 * Magazine Item Block Renderer
 */

$media_url = isset($attributes['mediaUrl']) ? (string) $attributes['mediaUrl'] : '';
$layout = isset($attributes['layout']) ? (string) $attributes['layout'] : 'vertical';
$useDashboardData = isset($attributes['useDashboardData']) ? (bool) $attributes['useDashboardData'] : false;
$fundraiserId = isset($attributes['fundraiserId']) ? $attributes['fundraiserId'] : null;

// Handle Dashboard Data Override
$fundraiser_data = null;
if ($useDashboardData && $fundraiserId) {
    $allFundraisers = get_option('fc_fundraiser_data', []);
    if (is_array($allFundraisers)) {
        foreach ($allFundraisers as $f) {
            if (isset($f['id']) && $f['id'] == $fundraiserId) {
                $fundraiser_data = (array) $f;
                // Override Media URL
                if (!empty($f['image'])) {
                    $media_url = (string) $f['image'];
                }
                break;
            }
        }
    }
}

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'fc-magazine-item is-layout-' . esc_attr($layout) . ($fundraiser_data ? ' is-linked-fundraiser' : ''),
    'data-fundraiser-id' => $useDashboardData ? esc_attr($fundraiserId) : '',
    'data-raised' => $fundraiser_data ? (float) $fundraiser_data['raised'] : 0,
    'data-target' => $fundraiser_data ? (float) $fundraiser_data['target'] : 0,
]);

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php if (!empty($media_url)): ?>
        <div class="fc-magazine-item__image-wrapper">
            <img src="<?php echo esc_url($media_url); ?>" alt="" style="display: block; width: 100%; height: auto;">
        </div>
    <?php endif; ?>

    <div class="fc-magazine-item__content">
        <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
    </div>
</div>