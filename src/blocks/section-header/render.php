<?php
/**
 * Render callback for the Section Header block.
 */

// Defensive attribute extraction
$title = $attributes['title'] ?? '';
$subtitle = $attributes['subtitle'] ?? '';
$alignment = $attributes['alignment'] ?? 'left';
$show_decoration = (bool) ($attributes['showDecoration'] ?? true);
$decoration_color = $attributes['decorationColor'] ?? 'gold';

// Breakdown style attributes
$subtitle_color = $attributes['subtitleColor'] ?? '';
$subtitle_font = $attributes['subtitleFontFamily'] ?? '';
$subtitle_lh = $attributes['subtitleLineHeight'] ?? '';

$subtitle_styles = [];
if ($subtitle_color)
    $subtitle_styles[] = "color: " . esc_attr($subtitle_color);
if ($subtitle_font)
    $subtitle_styles[] = "font-family: " . esc_attr($subtitle_font);
if ($subtitle_lh)
    $subtitle_styles[] = "line-height: " . esc_attr($subtitle_lh);

$subtitle_style_attr = !empty($subtitle_styles) ? 'style="' . implode(';', $subtitle_styles) . '"' : '';

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-section-header fc-section-header--align-' . $alignment
]);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php if ($title): ?>
        <h2 class="fc-section-header__title"><?php echo esc_html($title); ?></h2>
    <?php endif; ?>

    <?php if ($subtitle): ?>
        <p class="fc-section-header__subtitle" <?php echo $subtitle_style_attr; ?>><?php echo esc_html($subtitle); ?></p>
    <?php endif; ?>

    <?php if ($show_decoration): ?>
        <div class="fc-section-header__line fc-section-header__line--<?php echo esc_attr($decoration_color); ?>"></div>
    <?php endif; ?>
</div>