<?php
/**
 * Render callback for the Content Listing block (Feed Engine).
 */

$attributes = isset($attributes) ? $attributes : [];
$post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
$per_page = isset($attributes['perPage']) ? $attributes['perPage'] : 3;
$layout = isset($attributes['layout']) ? $attributes['layout'] : 'grid';
$columns = isset($attributes['columns']) ? $attributes['columns'] : 3;

// Display Settings
$show_date = isset($attributes['showDate']) ? $attributes['showDate'] : true;
$show_cat = isset($attributes['showCategory']) ? $attributes['showCategory'] : true;
$show_excerpt = isset($attributes['showExcerpt']) ? $attributes['showExcerpt'] : true;
$show_media = isset($attributes['showMedia']) ? $attributes['showMedia'] : true;

// Engine Settings
$card_type = isset($attributes['cardType']) ? $attributes['cardType'] : 'standard';
$taxonomy = isset($attributes['selectedTaxonomy']) ? $attributes['selectedTaxonomy'] : '';
$term_ids = isset($attributes['selectedTermIds']) ? $attributes['selectedTermIds'] : [];

// 1. Build Query
$args = array(
    'post_type' => $post_type,
    'posts_per_page' => $per_page,
    'post_status' => 'publish',
);

// Taxonomy Filter
if (!empty($taxonomy) && !empty($term_ids)) {
    $args['tax_query'] = array(
        array(
            'taxonomy' => $taxonomy,
            'field' => 'term_id',
            'terms' => $term_ids,
        ),
    );
}

$query = new WP_Query($args);

// 2. Determine Wrapper Classes
$wrapper_classes = "antigravity-listing antigravity-listing--layout-{$layout}";
if ($card_type === 'event') {
    $wrapper_classes .= " antigravity-listing--event-feed";
    // Force specific layout for events? Or let user choose List/Grid?
    // User requested "stack vertically", so if layout is 'list', it works.
}

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => $wrapper_classes,
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
            $thumbnail = get_the_post_thumbnail_url($post_id, 'medium_large'); // 3:2 or similar
    
            // Standard Meta
            $date = get_the_date();
            $categories = get_the_category();
            $category_name = !empty($categories) ? $categories[0]->name : '';

            // --- RENDER LOGIC SWITCH ---
            if ($card_type === 'event'):
                // [EVENT CARD]
    
                // For now, map standard post data to "Event" slots
                // In Phase 2, we hook up real ACF/Meta fields here.
    
                // Date logic helpers (PHP equivalents of JS)
                $ts = get_post_time('U', true);
                $month_short = date('M', $ts);
                $day_numeric = date('j', $ts);
                $time_str = date('g:i A', $ts);
                $location = "Location TBD"; // Placeholder until meta field exists
    
                $label = !empty($category_name) ? $category_name : 'Event';
                ?>
                <article class="antigravity-event-card">
                    <!-- 1. Date Badge -->
                    <div class="event-date-badge">
                        <span class="event-month"><?php echo esc_html($month_short); ?></span>
                        <span class="event-day"><?php echo esc_html($day_numeric); ?></span>
                    </div>

                    <!-- 2. Media -->
                    <?php if ($show_media && $thumbnail): ?>
                        <div class="event-media">
                            <img src="<?php echo esc_url($thumbnail); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy" />
                        </div>
                    <?php endif; ?>

                    <!-- 3. Content -->
                    <div class="event-content">
                        <?php if ($show_cat): ?>
                            <span class="event-label"><?php echo esc_html($label); ?></span>
                        <?php endif; ?>

                        <h3 class="event-title">
                            <a href="<?php echo esc_url($permalink); ?>" class="event-link"><?php echo esc_html($title); ?></a>
                        </h3>

                        <div class="event-meta">
                            <span class="event-location"><?php echo esc_html($location); ?></span>
                            <?php if ($show_date): ?>
                                <span class="event-time"> • <?php echo esc_html($time_str); ?></span>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- 4. Action -->
                    <div class="event-action">
                        <a href="<?php echo esc_url($permalink); ?>" class="event-button">
                            Get Tickets
                        </a>
                    </div>
                </article>

            <?php else:
                // [STANDARD CARD]
                ?>
                <article class="antigravity-card">
                    <?php if ($show_media && $thumbnail): ?>
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
            <?php endif; ?>

        <?php endwhile; ?>
    </section>
    <?php
    wp_reset_postdata();
else:
    ?>
    <div <?php echo $wrapper_attributes; ?>>
        <!-- Fallback / Placeholder for Editor -->
        <?php
        // Check if we are in the Block Editor context
        $is_editor = (defined('REST_REQUEST') && REST_REQUEST) || (isset($_GET['context']) && $_GET['context'] === 'edit');

        if ($is_editor):
            ?>
            <!-- Show MOCK Data in Editor so user can see design even with no posts -->
            <?php for ($i = 0; $i < $columns; $i++): ?>
                <?php if ($card_type === 'event'): ?>
                    <article class="antigravity-event-card">
                        <div class="event-date-badge">
                            <span class="event-month">OCT</span>
                            <span class="event-day"><?php echo 12 + $i; ?></span>
                        </div>
                        <?php if ($show_media): ?>
                            <div class="event-media" style="background: #eee;"></div>
                        <?php endif; ?>
                        <div class="event-content">
                            <?php if ($show_cat): ?><span class="event-label">Preview Event</span><?php endif; ?>
                            <h3 class="event-title"><a href="#" class="event-link">Example Event Title</a></h3>
                            <div class="event-meta">
                                <span class="event-location">City, State</span>
                                <?php if ($show_date): ?><span class="event-time"> • 7:00 PM</span><?php endif; ?>
                            </div>
                        </div>
                        <div class="event-action"><a href="#" class="event-button">Get Tickets</a></div>
                    </article>
                <?php else: ?>
                    <article class="antigravity-card">
                        <?php if ($show_media): ?>
                            <div class="antigravity-card__media" style="background:#ddd; height:200px;"></div><?php endif; ?>
                        <div class="antigravity-card__content">
                            <header class="antigravity-card__header">
                                <?php if ($show_cat): ?><span class="antigravity-card__category">Category</span><?php endif; ?>
                                <h3 class="antigravity-card__title">Example Post Title</h3>
                            </header>
                            <?php if ($show_excerpt): ?>
                                <div class="antigravity-card__excerpt">This is a placeholder excerpt to show you how the design looks.</div>
                            <?php endif; ?>
                        </div>
                    </article>
                <?php endif; ?>
            <?php endfor; ?>
        <?php else: ?>
            <p>No content found.</p>
        <?php endif; ?>
    </div>
    <?php
endif;
