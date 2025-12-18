<?php
/**
 * Render callback for the Marquee block.
 */

$attributes = isset($attributes) ? $attributes : [];
$images = isset($attributes['images']) ? $attributes['images'] : [];
$speed = isset($attributes['speed']) ? $attributes['speed'] : 30;
$direction = isset($attributes['direction']) ? $attributes['direction'] : 'left';
$zigzag = isset($attributes['zigzag']) ? $attributes['zigzag'] : false;

if (empty($images)) {
    return;
}

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'fc-marquee fc-marquee--' . esc_attr($direction) . ($zigzag ? ' fc-marquee--zigzag' : ''),
    'style' => '--marquee-speed: ' . esc_attr($speed) . 's;'
));
?>

<div <?php echo $wrapper_attributes; ?>>
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