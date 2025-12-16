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
$wrapper_class = 'antigravity-article-hero variant-' . esc_attr($variant);

?>
<header class="<?php echo esc_attr($wrapper_class); ?>">

    <?php if ($variant === 'immersive' && $image_url): ?>
        <div class="article-hero-bg">
            <img src="<?php echo esc_url($image_url); ?>" alt="" />
            <div class="article-hero-overlay"></div>
        </div>
    <?php endif; ?>

    <div class="article-hero-container">
        <div class="article-hero-content">
            <div class="article-meta-top">
                <?php if ($category): ?>
                    <span class="article-category"><?php echo esc_html($category); ?></span>
                <?php endif; ?>
                <?php if ($date): ?>
                    <span class="article-date"><?php echo esc_html($date); ?></span>
                <?php endif; ?>
            </div>

            <h1 class="article-title"><?php echo esc_html($title); ?></h1>

            <div class="article-meta-bottom">
                <?php if ($author_name): ?>
                    <span class="article-byline">By <span
                            class="author-name"><?php echo esc_html($author_name); ?></span></span>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php if ($variant === 'standard' && $image_url): ?>
        <div class="article-hero-standard-image">
            <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($title); ?>" />
        </div>
    <?php endif; ?>

</header>