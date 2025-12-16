<?php
/**
 * Render callback for the Quote block.
 */

$attributes = $attributes ?? [];
$quote = $attributes['quote'] ?? '';
$citation = $attributes['citation'] ?? '';
$layout = $attributes['layout'] ?? 'center';
$variant = $attributes['variant'] ?? 'default';
$show_icon = $attributes['showIcon'] ?? true;

// Wrapper Attributes
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => "antigravity-quote-wrapper layout-{$layout} variant-{$variant}"
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="antigravity-quote-container">

        <!-- Decorative Icon -->
        <?php if ($show_icon): ?>
            <div class="quote-icon" aria-hidden="true">“</div>
        <?php endif; ?>

        <blockquote class="antigravity-quote-content">
            <?php if (!empty($quote)): ?>
                <p class="quote-text"><?php echo wp_kses_post($quote); ?></p>
            <?php endif; ?>

            <?php if (!empty($citation)): ?>
                <footer class="quote-citation">
                    <span class="citation-line"></span>
                    <cite><?php echo esc_html($citation); ?></cite>
                </footer>
            <?php endif; ?>
        </blockquote>

    </div>
</div>