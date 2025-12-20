<?php
/**
 * Magazine Grid Block Renderer
 */

// Defensive attribute extraction
$attributes = $attributes ?? [];
$sidebar_width = (int) ($attributes['sidebarWidth'] ?? 33);
$sidebar_position = $attributes['sidebarPosition'] ?? 'right';

if (!in_array($sidebar_position, ['left', 'right'], true)) {
    $sidebar_position = 'right';
}

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'fc-magazine-grid is-position-' . $sidebar_position,
    'style' => '--fc-sidebar-width: ' . $sidebar_width . '%;'
]);

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php echo $content; ?>
</div>