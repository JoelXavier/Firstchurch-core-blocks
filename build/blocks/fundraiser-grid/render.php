<?php
/**
 * Render for Fundraiser Grid
 */

// Defensive attribute extraction
$columns = isset($attributes['columns']) ? (int) $attributes['columns'] : 3;

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-fundraiser-grid is-columns-' . (int) $columns,
    'style' => '--fc-grid-columns: ' . (int) $columns . ';'
]);

?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>