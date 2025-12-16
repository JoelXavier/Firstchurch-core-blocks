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
    'class' => 'antigravity-card-item'
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <a href="<?php echo esc_url($link_url); ?>" class="card-link-wrapper">

        <?php if ($media_url): ?>
            <div class="card-image-container">
                <img src="<?php echo esc_url($media_url); ?>" alt="<?php echo esc_attr($title); ?>" class="card-image" />
            </div>
        <?php else: ?>
            <div class="card-image-placeholder"></div>
        <?php endif; ?>

        <div class="card-content">
            <div class="card-text-group">
                <?php if ($label): ?>
                    <span class="card-label"><?php echo esc_html($label); ?></span>
                <?php endif; ?>

                <?php if ($title): ?>
                    <h3 class="card-title"><?php echo wp_kses_post($title); ?></h3>
                <?php endif; ?>
            </div>

            <span class="card-cta"><?php echo esc_html($link_text); ?></span>

            <div class="card-bottom-border"></div>
        </div>
    </a>
</div>