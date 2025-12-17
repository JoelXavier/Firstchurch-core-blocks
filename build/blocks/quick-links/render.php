<?php
/**
 * Render callback for the Quick Links Parent block.
 */

$attributes = $attributes ?? [];
$title = $attributes['title'] ?? 'Quick Links';
$variant = $attributes['backgroundVariant'] ?? 'red';

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-quick-links has-bg-divine-' . esc_attr($variant)
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="fc-quick-links__inner">
        <!-- Header -->
        <div class="fc-quick-links__header">
            <h2 class="fc-quick-links__title"><?php echo wp_kses_post($title); ?></h2>
            <div class="fc-quick-links__underline"></div>
        </div>

        <!-- Links Container -->
        <div class="fc-quick-links__list">
            <?php echo $content; ?>
        </div>
    </div>
</section>