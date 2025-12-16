<?php
/**
 * Render callback for the Quick Link Item block.
 */

$attributes = $attributes ?? [];
$label = $attributes['label'] ?? 'Link Label';
$url = $attributes['url'] ?? '#';
$media_url = $attributes['mediaUrl'] ?? '';

// Fallback image if none selected
if (empty($media_url)) {
    $media_url = 'https://placehold.co/100x100/333/gold?text=IMG';
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-quick-link-item'
]);
?>

<a <?php echo $wrapper_attributes; ?> href="<?php echo esc_url($url); ?>">
    <div class="fc-quick-link-item__image-wrapper">
        <img src="<?php echo esc_url($media_url); ?>" alt="" class="fc-quick-link-item__image" />
    </div>
    <div class="fc-quick-link-item__content">
        <span class="fc-quick-link-item__label">
            <?php echo esc_html($label); ?>
            <span class="fc-quick-link-item__arrow">→</span>
        </span>
    </div>
</a>