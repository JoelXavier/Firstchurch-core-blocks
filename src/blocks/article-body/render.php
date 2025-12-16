<?php
/**
 * Render for Article Body Block
 */

$attributes = isset($attributes) ? $attributes : [];
$content = isset($content) ? $content : ''; // InnerBlocks content

$show_author = isset($attributes['showAuthor']) ? $attributes['showAuthor'] : true;
$author_name = isset($attributes['authorName']) ? $attributes['authorName'] : '';
$author_team = isset($attributes['authorTeam']) ? $attributes['authorTeam'] : '';
$author_location = isset($attributes['authorLocation']) ? $attributes['authorLocation'] : '';
$author_image_url = isset($attributes['authorImageUrl']) ? $attributes['authorImageUrl'] : '';
$dropcap_color = isset($attributes['dropCapColor']) ? $attributes['dropCapColor'] : '';

$wrapper_class = 'fc-article-body';
$style_string = '';

if ($dropcap_color) {
    $style_string = '--dropcap-color: ' . esc_attr($dropcap_color) . ';';
}

// Support for custom background color (block supports)
$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => $wrapper_class,
    'style' => $style_string
));

?>
<section <?php echo $wrapper_attributes; ?>>
    <div class="fc-article-body__grid">

        <?php if ($show_author): ?>
            <aside class="fc-article-body__sidebar">
                <div class="fc-article-body__sticky">
                    <!-- Author Card -->
                    <div class="fc-author-card">
                        <div class="fc-author-card__media">
                            <?php if ($author_image_url): ?>
                                <img src="<?php echo esc_url($author_image_url); ?>"
                                    alt="<?php echo esc_attr($author_name); ?>" />
                            <?php else: ?>
                                <div class="fc-author-card__placeholder"><?php echo esc_html(substr($author_name, 0, 1)); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class="fc-author-card__info">
                            <span class="fc-author-card__name"><?php echo esc_html($author_name); ?></span>
                            <span class="fc-author-card__team"><?php echo esc_html($author_team); ?></span>
                            <span class="fc-author-card__location"><?php echo esc_html($author_location); ?></span>
                        </div>
                    </div>

                    <!-- Share Button -->
                    <button class="fc-article-body__share"
                        onclick="navigator.share ? navigator.share({title: document.title, url: window.location.href}) : navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))"
                        aria-label="Share Article">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                </div>
            </aside>
        <?php endif; ?>

        <!-- Main Content (Center) -->
        <article class="fc-article-body__content">
            <!-- InnerBlocks Content -->
            <div class="fc-article-body__typography">
                <?php echo $content; ?>

                <!-- Tombstone -->
                <div class="fc-article-body__tombstone">
                    <span class="fc-article-body__tombstone-icon">❖</span>
                </div>
            </div>
        </article>

        <!-- Empty Right Column for Balance -->
        <div class="fc-article-body__spacer"></div>

    </div>
</section>