<?php
/**
 * Render callback for the Section block.
 */

$attributes = isset($attributes) ? $attributes : [];
$layout_mode = isset($attributes['layoutMode']) ? $attributes['layoutMode'] : 'contained';
$vertical_spacing = isset($attributes['verticalSpacing']) ? $attributes['verticalSpacing'] : 'medium';
$has_decoration = isset($attributes['hasDecoration']) ? $attributes['hasDecoration'] : false;
$d_pos = isset($attributes['decorationPosition']) ? $attributes['decorationPosition'] : 'bottom';
$noise = isset($attributes['noise']) ? $attributes['noise'] : false;

$classes = array('fc-section');
$classes[] = 'fc-section--mode-' . $layout_mode;
$classes[] = 'fc-section--spacing-' . $vertical_spacing;

if ($has_decoration) {
    $classes[] = 'fc-section--has-decoration';
    $classes[] = 'fc-section--decoration-' . $d_pos;
}

if ($noise) {
    $classes[] = 'fc-section--noise';
}

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => implode(' ', $classes)
));
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="fc-section__inner">
        <?php echo $content; ?>
    </div>
</div>