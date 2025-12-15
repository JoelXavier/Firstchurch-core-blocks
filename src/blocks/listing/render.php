<?php
/**
 * Render callback for the Content Listing block.
 */

$attributes = isset($attributes) ? $attributes : [];
$post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
$per_page = isset($attributes['perPage']) ? $attributes['perPage'] : 3;
$layout = isset($attributes['layout']) ? $attributes['layout'] : 'grid';
$columns = isset($attributes['columns']) ? $attributes['columns'] : 3;

$show_date = isset($attributes['showDate']) ? $attributes['showDate'] : true;
$show_cat = isset($attributes['showCategory']) ? $attributes['showCategory'] : true;
$show_excerpt = isset($attributes['showExcerpt']) ? $attributes['showExcerpt'] : true;

// Query Arguments
$args = array(
    'post_type' => $post_type,
    'posts_per_page' => $per_page,
    'post_status' => 'publish',
);

$query = new WP_Query($args);
$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => "antigravity-listing antigravity-listing--layout-{$layout}",
    'style' => "--columns: {$columns}"
));

if ($query->have_posts()):
    ?>
    <section <?php echo $wrapper_attributes; ?>>
        <?php while ($query->have_posts()):
            $query->the_post();
            $post_id = get_the_ID();
            $title = get_the_title();
            $excerpt = get_the_excerpt();
            $permalink = get_permalink();
            $thumbnail = get_the_post_thumbnail_url($post_id, 'medium_large');
            $date = get_the_date();

            $categories = get_the_category();
            $category_name = !empty($categories) ? $categories[0]->name : '';
            ?>

            <article class="antigravity-card">
                <?php if ($thumbnail): ?>
                    <div class="antigravity-card__media">
                        <img src="<?php echo esc_url($thumbnail); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy" />
                    </div>
                <?php endif; ?>

                <div class="antigravity-card__content">
                    <header class="antigravity-card__header">
                        <?php if ($show_cat && $category_name): ?>
                            <span class="antigravity-card__category"><?php echo esc_html($category_name); ?></span>
                        <?php endif; ?>

                        <?php if ($show_date): ?>
                            <time class="antigravity-card__date"><?php echo esc_html($date); ?></time>
                        <?php endif; ?>

                        <h3 class="antigravity-card__title">
                            <a href="<?php echo esc_url($permalink); ?>"><?php echo esc_html($title); ?></a>
                        </h3>
                    </header>

                    <?php if ($show_excerpt && $excerpt): ?>
                        <div class="antigravity-card__excerpt"><?php echo wp_kses_post($excerpt); ?></div>
                    <?php endif; ?>
                </div>
            </article>

        <?php endwhile; ?>
    </section>
    <?php
    wp_reset_postdata();
else:
    ?>
    <div <?php echo $wrapper_attributes; ?>>
        <p>No posts found.</p>
    </div>
    <?php
endif;
