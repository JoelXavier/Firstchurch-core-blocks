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
    'class' => 'quick-link-item-wrapper' // Wrapper needed because `a` tag can't easily accept block props if we want clean markup
]);

// Wait, standard WP get_block_wrapper_attributes adds structural classes we might not want on a flex ITEM anchor.
// But we need it for supports. Let's apply it to the <a> directly.
?>

<a href="<?php echo esc_url($url); ?>" class="quick-link-item">
    <div class="quick-link-image-wrapper">
        <img src="<?php echo esc_url($media_url); ?>" alt="" class="quick-link-image" />
    </div>
    <div class="quick-link-content">
        <span class="quick-link-label">
            <?php echo esc_html($label); ?>
            <span class="quick-link-arrow">→</span>
        </span>
    </div>
</a>