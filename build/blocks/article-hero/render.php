<?php
/**
 * Render for Article Hero Block
 */

$attributes = isset($attributes) ? $attributes : [];

$variant = isset($attributes['variant']) ? $attributes['variant'] : 'standard';
$title = isset($attributes['title']) ? $attributes['title'] : 'Article Title';
$author_name = isset($attributes['authorName']) ? $attributes['authorName'] : '';
$category = isset($attributes['category']) ? $attributes['category'] : '';
$date = isset($attributes['date']) ? $attributes['date'] : '';
$image_url = isset($attributes['heroImageUrl']) ? $attributes['heroImageUrl'] : '';

// Variant CSS overrides
$header_style = '';
$image_style = '';
$overlay_class = '';

if ($variant === 'immersive') {
    // Immersive: Image is background of the header
    if ($image_url) {
        $header_style = "background-image: url('" . esc_url($image_url) . "');";
    }
}
// Map attributes to CSS classes (matching BEM from SCSS)
// Map attributes to CSS classes (matching BEM from SCSS)
$wrapper_class = 'fc-article-hero fc-article-hero--' . esc_attr($variant);

?>
<header class="<?php echo esc_attr($wrapper_class); ?>">

    <?php if ($variant === 'immersive' && $image_url): ?>
        <div class="fc-article-hero__bg">
            <img src="<?php echo esc_url($image_url); ?>" alt="" />
            <div class="fc-article-hero__overlay"></div>
        </div>
    <?php endif; ?>

    <div class="fc-article-hero__container">
        <div class="fc-article-hero__content">
            <div class="fc-article-hero__meta-top">
                <?php if ($category): ?>
                    <span class="fc-article-hero__category"><?php echo esc_html($category); ?></span>
                <?php endif; ?>
                <?php if ($date): ?>
                    <span class="fc-article-hero__date"><?php echo esc_html($date); ?></span>
                <?php endif; ?>
            </div>

            <h1 class="fc-article-hero__title"><?php echo esc_html($title); ?></h1>

            <div class="fc-article-hero__meta-bottom">
                <?php if ($author_name): ?>
                    <span class="fc-article-hero__byline">By <span
                            class="fc-article-hero__author"><?php echo esc_html($author_name); ?></span></span>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php if ($variant === 'standard' && $image_url): ?>
        <div class="fc-article-hero__standard-media">
            <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($title); ?>" />
        </div>
    <?php endif; ?>

</header>