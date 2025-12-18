<?php
/**
 * Render callback for the Location Feed block.
 */

$attributes = isset($attributes) ? $attributes : [];
$per_page = isset($attributes['perPage']) ? $attributes['perPage'] : 10;
$block_title = isset($attributes['blockTitle']) ? $attributes['blockTitle'] : 'Our Locations';
$block_subtitle = isset($attributes['blockSubtitle']) ? $attributes['blockSubtitle'] : 'Find a temple near you';
$filter_style = isset($attributes['filterStyle']) ? $attributes['filterStyle'] : 'pills'; // 'pills', 'sidebar', 'none'
$selected_taxonomy = 'location_category'; // Hardcoded for this block

// Handle Filtering via URL
$current_filter = isset($_GET['loc_filter']) ? sanitize_text_field($_GET['loc_filter']) : '';

// Render Filter HTML
$filter_html = '';
if ($filter_style !== 'none') {
    $terms = get_terms(array(
        'taxonomy' => $selected_taxonomy,
        'hide_empty' => true,
    ));

    if (!empty($terms) && !is_wp_error($terms)) {
        // Wrapper class depends on style
        $wrapper_class = ($filter_style === 'sidebar') ? 'fc-listing__filter-list' : 'fc-listing__filter--pills';

        $filter_html .= '<div class="' . esc_attr($wrapper_class) . '">';

        // "All" Link
        $active_class = empty($current_filter) ? 'is-active' : '';
        $all_link = remove_query_arg('loc_filter');
        $filter_html .= sprintf(
            '<a href="%s" class="fc-listing__filter-item %s">%s</a>',
            esc_url($all_link),
            $active_class,
            __('All Locations', 'first-church-core-blocks')
        );

        foreach ($terms as $term) {
            $is_active = ($current_filter === $term->slug) ? 'is-active' : '';
            $term_link = add_query_arg('loc_filter', $term->slug);

            $filter_html .= sprintf(
                '<a href="%s" class="fc-listing__filter-item %s">%s</a>',
                esc_url($term_link),
                $is_active,
                esc_html($term->name)
            );
        }

        // Add International Pill if relevant
        // We only show this if there ARE international locations, or unconditionally?
        // Let's check if any international locations exist to avoid empty states
        $params_int = array(
            'post_type' => 'location',
            'meta_key' => '_location_is_international',
            'meta_value' => '1',
            'numberposts' => 1
        );
        $has_int = get_posts($params_int);

        if ($has_int) {
            $int_active = ($current_filter === 'international') ? 'is-active' : '';
            $int_link = add_query_arg('loc_filter', 'international');
            $filter_html .= sprintf(
                '<a href="%s" class="fc-listing__filter-item %s">%s</a>',
                esc_url($int_link),
                $int_active,
                __('International', 'first-church-core-blocks')
            );
        }

        $filter_html .= '</div>';
    }
}

// Query Locations
$args = array(
    'post_type' => 'location',
    'posts_per_page' => $per_page,
    'post_status' => current_user_can('read_private_posts') ? array('publish', 'private') : 'publish',
    'orderby' => 'title',
    'order' => 'ASC',
    'suppress_filters' => false
);

// Apply Filter
if (!empty($current_filter)) {
    if ($current_filter === 'international') {
        // Handle International Filter
        $args['meta_query'] = array(
            array(
                'key' => '_location_is_international',
                'value' => '1',
                'compare' => '='
            )
        );
    } else {
        // Handle Taxonomy Filter
        $args['tax_query'] = array(
            array(
                'taxonomy' => $selected_taxonomy,
                'field' => 'slug',
                'terms' => $current_filter,
            ),
        );
    }
} else {
    // Default (All): Exclude international? Or include all?
    // User asked to "sort them out". Typically this implies they want them separate.
    // Let's keep 'All' as truly ALL for now unless specified otherwise, 
    // but the pill exists for quick access.
}

$query = new WP_Query($args);

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'fc-location-feed'
));
?>

<div <?php echo $wrapper_attributes; ?>>

    <!-- Header Section -->
    <div class="fc-listing__header">
        <div class="fc-listing__header-content">
            <?php if ($block_title): ?>
                <h2 class="fc-listing__title"><?php echo esc_html($block_title); ?></h2>
            <?php endif; ?>
            <?php if ($block_subtitle): ?>
                <p class="fc-listing__subtitle"><?php echo esc_html($block_subtitle); ?></p>
            <?php endif; ?>
            <div class="fc-listing__decoration"></div>
        </div>

        <!-- If Pills, render here (aligned right or bottom of header) -->
        <?php if ($filter_style === 'pills'): ?>
            <div class="fc-listing__filter-bar">
                <?php echo $filter_html; ?>
            </div>
        <?php endif; ?>
    </div>

    <div class="fc-listing__body <?php echo ($filter_style === 'sidebar') ? 'fc-listing__body--has-sidebar' : ''; ?>">

        <!-- Sidebar Filter -->
        <?php if ($filter_style === 'sidebar'): ?>
            <div class="fc-listing__sidebar">
                <div class="fc-listing__sidebar-sticky">
                    <h4 class="fc-listing__sidebar-title"><?php _e('Filter by Location', 'first-church-core-blocks'); ?>
                    </h4>
                    <?php echo $filter_html; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Main Content -->
        <div class="fc-listing__main">
            <div class="fc-listing__grid" style="--columns: 1; gap: 1.5rem;">
                <?php if ($query->have_posts()): ?>
                    <?php while ($query->have_posts()):
                        $query->the_post();
                        $pid = get_the_ID();
                        $title = get_the_title();

                        // Retrieve Meta
                        $status = get_post_meta($pid, '_location_status', true);
                        $region = get_post_meta($pid, '_location_region', true);
                        $address = get_post_meta($pid, '_location_address', true);
                        $times = get_post_meta($pid, '_location_times', true);
                        $phone = get_post_meta($pid, '_location_phone', true);
                        $map_embed = get_post_meta($pid, '_location_map_embed', true);


                        ?>

                        <!-- Location Card -->
                        <div class="fc-location-card">

                            <div class="fc-location-card__content">
                                <!-- Header -->
                                <div class="fc-location-card__header">
                                    <div class="fc-location-card__title-group">
                                        <div class="fc-location-card__org-name">First Church Of Our Lord Jesus Christ, Inc.
                                        </div>
                                        <div class="fc-location-card__location-name"><?php echo esc_html($region ?: $title); ?>
                                        </div>
                                    </div>
                                </div>

                                <!-- Status -->
                                <?php if ($status): ?>
                                    <div class="fc-location-card__status">
                                        <?php echo esc_html($status); ?>
                                    </div>
                                <?php endif; ?>

                                <!-- Info List -->
                                <div class="fc-location-card__info-list">
                                    <?php if ($address): ?>
                                        <div class="fc-location-card__info-item">
                                            <div class="fc-location-card__icon">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                </svg>
                                            </div>
                                            <span><?php echo esc_html($address); ?></span>
                                        </div>
                                    <?php endif; ?>

                                    <?php if ($times): ?>
                                        <div class="fc-location-card__info-item">
                                            <div class="fc-location-card__icon">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />
                                                </svg>
                                            </div>
                                            <span><?php echo esc_html($times); ?></span>
                                        </div>
                                    <?php endif; ?>

                                    <?php if ($phone): ?>
                                        <div class="fc-location-card__info-item">
                                            <div class="fc-location-card__icon">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                                </svg>
                                            </div>
                                            <span><?php echo esc_html($phone); ?></span>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <!-- Map Embed -->
                            <?php if ($map_embed): ?>
                                <div class="fc-location-card__map">
                                    <?php
                                    // Check if it's a full iframe tag
                                    if (strpos($map_embed, '<iframe') !== false) {
                                        echo $map_embed;
                                    } else {
                                        // Assume URL
                                        echo '<iframe src="' . esc_url($map_embed) . '" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
                                    }
                                    ?>
                                </div>
                            <?php endif; ?>

                        </div>

                    <?php endwhile;
                    wp_reset_postdata(); ?>
                <?php else: ?>
                    <div class="fc-no-results">
                        <p><?php _e('No locations found matching your criteria.', 'first-church-core-blocks'); ?></p>
                        <?php if (!empty($current_filter)): ?>
                            <p><a
                                    href="<?php echo esc_url(remove_query_arg('loc_filter')); ?>"><?php _e('View all locations', 'first-church-core-blocks'); ?></a>
                            </p>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>