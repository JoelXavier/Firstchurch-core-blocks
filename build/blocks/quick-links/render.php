<?php
/**
 * Render callback for the Quick Links Parent block.
 */

$attributes = $attributes ?? [];
$title = $attributes['title'] ?? 'Quick Links';

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'antigravity-quick-links'
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="quick-links-inner">
        <!-- Header -->
        <div class="quick-links-header">
            <h2 class="quick-links-title"><?php echo wp_kses_post($title); ?></h2>
            <div class="quick-links-underline"></div>
        </div>

        <!-- Links Container -->
        <div class="quick-links-list">
            <?php echo $content; ?>
        </div>
    </div>
</section>