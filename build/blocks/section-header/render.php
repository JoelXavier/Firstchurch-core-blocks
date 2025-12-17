<?php
/**
 * Render callback for the Section Header block.
 */

$attributes = isset($attributes) ? $attributes : [];
$title = isset($attributes['title']) ? $attributes['title'] : '';
$subtitle = isset($attributes['subtitle']) ? $attributes['subtitle'] : '';
$alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'left';
$show_decoration = isset($attributes['showDecoration']) ? $attributes['showDecoration'] : true;
$decoration_color = isset($attributes['decorationColor']) ? $attributes['decorationColor'] : 'gold';

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'fc-section-header fc-section-header--align-' . esc_attr($alignment)
));
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if ($title): ?>
        <h2 class="fc-section-header__title"><?php echo wp_kses_post($title); ?></h2>
    <?php endif; ?>

    <?php if ($subtitle): ?>
        <p class="fc-section-header__subtitle"><?php echo wp_kses_post($subtitle); ?></p>
    <?php endif; ?>

    <?php if ($show_decoration): ?>
        <div class="fc-section-header__line fc-section-header__line--<?php echo esc_attr($decoration_color); ?>"></div>
    <?php endif; ?>
</div>