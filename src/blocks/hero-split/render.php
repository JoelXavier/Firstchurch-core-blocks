<?php
/**
 * Render callback for the Hero Split block.
 */

// Defensive attribute extraction
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
$wrapper_classes = 'fc-hero-split';
if ($image_position === 'right') {
    $wrapper_classes .= ' fc-hero-split--right';
}
if ($image_aspect_ratio) {
    if ($image_aspect_ratio === 'portrait') {
        $wrapper_classes .= ' fc-hero-split--portrait';
    } elseif ($image_aspect_ratio === 'square') {
        $wrapper_classes .= ' fc-hero-split--square';
    }
    // Landscape is default, no class needed
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => $wrapper_classes,
    'style' => "--hero-split-bg: " . esc_attr($background_color) . "; --hero-split-text: " . esc_attr($text_color) . "; --hero-split-link: " . esc_attr($link_color) . ";"
]);
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <!-- Image Side -->
    <div class="fc-hero-split__media">
        <?php if ($image_url): ?>
            <img src="<?php echo esc_url($image_url); ?>" alt="" class="fc-hero-split__image" />
        <?php endif; ?>
    </div>

    <!-- Content Side -->
    <div class="fc-hero-split__content">
        <?php if ($label): ?>
            <span class="fc-hero-split__label"><?php echo esc_html($label); ?></span>
        <?php endif; ?>

        <h2 class="fc-hero-split__title"><?php echo wp_kses_post($title); ?></h2>

        <?php if ($link_text): ?>
            <a href="<?php echo esc_url($link_url); ?>" class="fc-hero-split__link">
                <?php echo esc_html($link_text); ?>
                <!-- Simple chevron arrow SVG -->
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" fill="none" />
                </svg>
            </a>
        <?php endif; ?>

        <div class="fc-hero-split__bar"></div>
    </div>

</section>