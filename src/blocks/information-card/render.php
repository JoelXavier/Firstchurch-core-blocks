<?php
/**
 * Render for Information Card
 */

$label = isset($attributes['label']) ? (string) $attributes['label'] : 'INFO';
$title = isset($attributes['title']) ? (string) $attributes['title'] : '';
$description = isset($attributes['description']) ? (string) $attributes['description'] : '';
$linkText = isset($attributes['linkText']) ? (string) $attributes['linkText'] : 'LEARN MORE';
$linkUrl = isset($attributes['linkUrl']) ? (string) $attributes['linkUrl'] : '#';
$showLink = isset($attributes['showLink']) ? (bool) $attributes['showLink'] : true;

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-information-card'
]);

?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="fc-information-card__inner">
        <?php if (!empty($label)): ?>
            <span class="fc-information-card__label"><?php echo esc_html($label); ?></span>
        <?php endif; ?>

        <h3 class="fc-information-card__title"><?php echo esc_html($title); ?></h3>

        <?php if (!empty($description)): ?>
            <p class="fc-information-card__description"><?php echo esc_html($description); ?></p>
        <?php endif; ?>

        <?php if ($showLink): ?>
            <div class="fc-information-card__footer">
                <a href="<?php echo esc_url($linkUrl); ?>" class="fc-information-card__button">
                    <?php echo esc_html($linkText); ?>
                </a>
            </div>
        <?php else: ?>
            <div class="fc-information-card__bottom-bar"></div>
        <?php endif; ?>
    </div>
</div>