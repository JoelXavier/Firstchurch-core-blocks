<?php
/**
 * Render callback for the Quote block.
 */

// Defensive attribute extraction
$quote = $attributes['quote'] ?? '';
$citation = $attributes['citation'] ?? '';
$layout = $attributes['layout'] ?? 'center';
$variant = $attributes['variant'] ?? 'default';
$show_icon = (bool) ($attributes['showIcon'] ?? true);

// Wrapper Attributes
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => "fc-quote fc-quote--layout-{$layout} fc-quote--variant-{$variant}"
]);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="fc-quote__container">

        <?php if ($show_icon): ?>
            <div class="fc-quote__icon" aria-hidden="true">&ldquo;</div>
        <?php endif; ?>

        <blockquote class="fc-quote__content">
            <?php if ($quote): ?>
                <p class="fc-quote__text"><?php echo wp_kses_post($quote); ?></p>
            <?php endif; ?>

            <?php if ($citation): ?>
                <footer class="fc-quote__citation">
                    <span class="fc-quote__line"></span>
                    <cite><?php echo esc_html($citation); ?></cite>
                </footer>
            <?php endif; ?>
        </blockquote>

    </div>
</div>