<?php
/**
 * Render callback for the Section block.
 */

$attributes = isset($attributes) ? $attributes : [];
$layout_mode = isset($attributes['layoutMode']) ? $attributes['layoutMode'] : 'contained';
$vertical_spacing = isset($attributes['verticalSpacing']) ? $attributes['verticalSpacing'] : 'medium';
$has_decoration = isset($attributes['hasDecoration']) ? $attributes['hasDecoration'] : false;
$d_pos = isset($attributes['decorationPosition']) ? $attributes['decorationPosition'] : 'bottom';

$classes = array('antigravity-section');
$classes[] = 'mode-' . $layout_mode;
$classes[] = 'spacing-' . $vertical_spacing;

if ($has_decoration) {
    $classes[] = 'has-decoration';
    $classes[] = 'decoration-' . $d_pos;
}

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => implode(' ', $classes)
));
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="antigravity-section-inner">
        <?php echo $content; ?>
    </div>
</div>