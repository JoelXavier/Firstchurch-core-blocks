<?php
/**
 * Render callback for the Card Grid block.
 */

$attributes = $attributes ?? [];
$section_title = $attributes['sectionTitle'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'antigravity-card-grid'
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if ($section_title): ?>
        <div class="card-grid-header">
            <h2 class="section-title"><?php echo wp_kses_post($section_title); ?></h2>
            <div class="section-line"></div>
        </div>
    <?php endif; ?>

    <div class="card-grid-container">
        <?php echo $content; ?>
    </div>
</div>