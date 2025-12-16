<?php
/**
 * Render callback for the Hero Split block.
 */

$attributes = $attributes ?? [];
$label = $attributes['label'] ?? '';
$title = $attributes['title'] ?? '';
$link_text = $attributes['linkText'] ?? '';
$link_url = $attributes['linkUrl'] ?? '#';
$image_url = $attributes['imageUrl'] ?? '';
$image_position = $attributes['imagePosition'] ?? 'left';
$image_aspect_ratio = $attributes['imageAspectRatio'] ?? 'landscape';

$background_color = $attributes['backgroundColor'] ?? '#1a1a1a';
$text_color = $attributes['textColor'] ?? '#f1eadd';
$link_color = $attributes['linkColor'] ?? '#ffffff';

// Build classes
$wrapper_classes = 'antigravity-hero-split';
if ($image_position === 'right') {
    $wrapper_classes .= ' image-right';
}
if ($image_aspect_ratio) {
    $wrapper_classes .= ' aspect-ratio-' . esc_attr($image_aspect_ratio);
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => $wrapper_classes,
    'style' => "--hero-split-bg: {$background_color}; --hero-split-text: {$text_color}; --hero-split-link: {$link_color};"
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <!-- Image Side -->
    <div class="hero-split-image-wrapper">
        <?php if (!empty($image_url)): ?>
            <img src="<?php echo esc_url($image_url); ?>" alt="" class="hero-split-image" />
        <?php endif; ?>
    </div>

    <!-- Content Side -->
    <div class="hero-split-content">
        <?php if (!empty($label)): ?>
            <span class="hero-split-label"><?php echo esc_html($label); ?></span>
        <?php endif; ?>

        <h2 class="hero-split-title"><?php echo wp_kses_post($title); ?></h2>

        <?php if (!empty($link_text)): ?>
            <a href="<?php echo esc_url($link_url); ?>" class="hero-split-link">
                <?php echo esc_html($link_text); ?>
                <!-- Simple chevron arrow SVG -->
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" fill="none" />
                </svg>
            </a>
        <?php endif; ?>

        <div class="hero-split-bar"></div>
    </div>
</section>