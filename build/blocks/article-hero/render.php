<?php
/**
 * Render for Article Hero Block
 */

// Defensive attribute extraction
$variant = $attributes['variant'] ?? 'standard';
$title = $attributes['title'] ?? 'Article Title';
$author_name = $attributes['authorName'] ?? '';
$category = $attributes['category'] ?? '';
$date = $attributes['date'] ?? '';
$image_url = $attributes['heroImageUrl'] ?? '';

// Build Wrapper Attributes
$wrapper_attributes = get_block_wrapper_attributes([
    'tagName' => 'header',
    'class' => 'fc-article-hero fc-article-hero--' . $variant
]);

?>
<header <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

    <?php if ('immersive' === $variant && $image_url): ?>
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
                    <span class="fc-article-hero__byline">
                        <?php esc_html_e('By', 'first-church-core-blocks'); ?>
                        <span class="fc-article-hero__author"><?php echo esc_html($author_name); ?></span>
                    </span>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php if ('standard' === $variant && $image_url): ?>
        <div class="fc-article-hero__standard-media">
            <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($title); ?>" />
        </div>
    <?php endif; ?>

</header>