<?php
/**
 * Render callback for the Marquee block.
 */

// Defensive attribute extraction
$images = $attributes['images'] ?? [];
$speed = (int) ($attributes['speed'] ?? 30);
$direction = $attributes['direction'] ?? 'left';
$zigzag = (bool) ($attributes['zigzag'] ?? false);
$grayscale = (bool) ($attributes['grayscale'] ?? true);

if (empty($images)) {
    return;
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-marquee fc-marquee--' . $direction . ($zigzag ? ' fc-marquee--zigzag' : '') . ($grayscale ? ' fc-marquee--grayscale' : ''),
    'style' => '--marquee-speed: ' . $speed . 's;'
]);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="fc-marquee__container">
        <!-- Track 1 -->
        <div class="fc-marquee__track">
            <?php foreach ($images as $img): ?>
                <div class="fc-marquee__item">
                    <img src="<?php echo esc_url($img['url']); ?>" alt="<?php echo esc_attr($img['alt']); ?>" loading="lazy"
                        width="<?php echo esc_attr($img['width']); ?>" height="<?php echo esc_attr($img['height']); ?>" />
                </div>
            <?php endforeach; ?>

            <!-- Duplicate for Loop (Seamless) -->
            <?php foreach ($images as $img): ?>
                <div class="fc-marquee__item">
                    <img src="<?php echo esc_url($img['url']); ?>" alt="<?php echo esc_attr($img['alt']); ?>" loading="lazy"
                        width="<?php echo esc_attr($img['width']); ?>" height="<?php echo esc_attr($img['height']); ?>" />
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>