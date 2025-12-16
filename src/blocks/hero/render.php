<?php
// render.php
$attributes = $attributes ?? [];
$content = $content ?? ''; // InnerBlocks content

// Extract attributes with defaults matching block.json
$mode = $attributes['mode'] ?? 'static';
$layout = $attributes['layout'] ?? 'bottom-left';
$overlayOpacity = $attributes['overlayOpacity'] ?? 80;
$media = $attributes['media'] ?? [];

// Escape attributes for HTML data output
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'fc-hero-wrapper']);
$props_json = htmlspecialchars(json_encode([
    'mode' => $mode,
    'layout' => $layout,
    'overlayOpacity' => $overlayOpacity,
    'media' => $media
]));

// We render the wrapper.
// The Javascript 'view.js' will hydrate this and mount the React component.
// BUT, for SEO and No-JS, we should output the "Static" version here if possible.
// Because mixing React Logic (Slideshows) with PHP Rendered InnerBlocks is tricky in Hydration (SSR),
// we will use a hybrid approach:
// 1. We render the React Root for the background/overlay.
// 2. We render the InnerBlocks content in a separate container layered on top.
// This avoids needing to hydrate the Content itself, which is cleaner for SEO.

?>
<div <?php echo $wrapper_attributes; ?> style="position: relative;">

    <!-- React Root for Background/Slideshow -->
    <!-- The frontend script will find this and mount the Hero Background logic -->
    <div class="fc-hero-background-root fc-hero__media" data-props="<?php echo $props_json; ?>"
        style="position: absolute; top:0; left:0; width:100%; height:100%; z-index:0;">
        <!-- No-JS Fallback for Background -->
        <?php if (!empty($media[0]['url'])): ?>
            <img src="<?php echo esc_url($media[0]['url']); ?>" style="width:100%; height:100%; object-fit:cover;"
                alt="Hero Background">
            <!-- Static Overlay Fallback -->
            <div class="fc-hero__overlay"
                style="opacity: <?php echo $overlayOpacity / 100; ?>; position:absolute; top:0; left:0; width:100%; height:100%;">
            </div>
        <?php endif; ?>
    </div>

    <!-- InnerBlocks Content (Server Rendered, SEO Friendly) -->
    <!-- We reuse the CSS classes from our component to ensure layout matches -->
    <div class="fc-hero fc-hero--layout-<?php echo esc_attr($layout); ?>"
        style="background:transparent; pointer-events:none; position:relative; z-index:1;">
        <div class="fc-hero__content" style="pointer-events:auto;">
            <?php echo $content; ?>
        </div>
    </div>

</div>