<?php
/**
 * Render callback for the Card Item block.
 */

$attributes = $attributes ?? [];
$label = $attributes['label'] ?? '';
$title = $attributes['title'] ?? '';
$link_url = $attributes['linkUrl'] ?? '#';
$link_text = $attributes['linkText'] ?? 'LEARN MORE >';
$media_url = $attributes['mediaUrl'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-card-item'
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <a href="<?php echo esc_url($link_url); ?>" class="fc-card-link-wrapper">

        <?php if ($media_url): ?>
            <div class="fc-card-image-wrapper">
                <img src="<?php echo esc_url($media_url); ?>" alt="<?php echo esc_attr($title); ?>" class="fc-card-image" />
            </div>
        <?php else: ?>
            <div class="fc-card-image-placeholder"></div>
        <?php endif; ?>

        <div class="fc-card-content">
            <div class="fc-card-text-group">
                <?php if ($label): ?>
                    <span class="fc-card-label"><?php echo esc_html($label); ?></span>
                <?php endif; ?>

                <?php if ($title): ?>
                    <h3 class="fc-card-title"><?php echo wp_kses_post($title); ?></h3>
                <?php endif; ?>
            </div>

            <span class="fc-card-cta"><?php echo esc_html($link_text); ?></span>
        </div>
    </a>
</div>