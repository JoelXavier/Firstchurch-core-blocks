<?php
/**
 * Magazine Grid Block Renderer
 */

$sidebar_width = isset($attributes['sidebarWidth']) ? $attributes['sidebarWidth'] : 33;
$sidebar_position = isset($attributes['sidebarPosition']) ? $attributes['sidebarPosition'] : 'right';

$block_props = get_block_wrapper_attributes([
    'class' => 'fc-magazine-grid is-position-' . $sidebar_position,
    'style' => '--fc-sidebar-width: ' . $sidebar_width . '%;'
]);

?>
<div <?php echo $block_props; ?>>
    <?php echo $content; ?>
</div>