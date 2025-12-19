<?php
/**
 * Magazine Item Block Renderer
 */

$media_url = isset($attributes['mediaUrl']) ? $attributes['mediaUrl'] : '';
$layout = isset($attributes['layout']) ? $attributes['layout'] : 'vertical';
$block_props = get_block_wrapper_attributes([
    'class' => 'fc-magazine-item is-layout-' . $layout
]);

?>
<div <?php echo $block_props; ?>>
    <div class="fc-magazine-item__image-wrapper">
        <?php if ($media_url): ?>
            <img src="<?php echo esc_url($media_url); ?>" alt="">
        <?php endif; ?>
    </div>
    <div class="fc-magazine-item__content">
        <?php echo $content; ?>
    </div>
</div>