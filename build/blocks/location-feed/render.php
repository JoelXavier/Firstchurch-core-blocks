<?php
/**
 * Render callback for the Location Feed block.
 */

// Defensive attribute extraction
$per_page = (int) ($attributes['perPage'] ?? 10);
$block_title = $attributes['blockTitle'] ?? __('Our Locations', 'first-church-core-blocks');
$block_subtitle = $attributes['blockSubtitle'] ?? __('Find a temple near you', 'first-church-core-blocks');
$filter_style = $attributes['filterStyle'] ?? 'pills'; // 'pills', 'sidebar', 'none'
$taxonomy = 'location_category';

// 1. Handle Filtering
$current_filter = isset($_GET['loc_filter']) ? sanitize_text_field($_GET['loc_filter']) : '';

// 2. Fetch Cached Data (ViewModel)
$data = firstchurch_get_location_feed_data(
    ['perPage' => $per_page],
    ['loc_filter' => $current_filter]
);

$locations = $data['locations'];
$terms = $data['terms'];
$has_int = $data['has_international']; // Boolean

// 3. Generate Filter HTML Safely (Using Cached Data)
$filter_html = '';
if ('none' !== $filter_style) {
    if (!empty($terms)) {
        $wrapper_class = ('sidebar' === $filter_style) ? 'fc-listing__filter-list' : 'fc-listing__filter--pills';
        $filter_html .= '<div class="' . esc_attr($wrapper_class) . '">';

        // "All" Link
        $all_link = remove_query_arg('loc_filter');
        $active_class = empty($current_filter) ? 'is-active' : '';
        $filter_html .= sprintf(
            '<a href="%s" class="fc-listing__filter-item %s">%s</a>',
            esc_url($all_link),
            esc_attr($active_class),
            esc_html__('All Locations', 'first-church-core-blocks')
        );

        foreach ($terms as $term) {
            $is_active = ($current_filter === $term['slug']) ? 'is-active' : '';
            $term_link = add_query_arg('loc_filter', $term['slug']);
            $filter_html .= sprintf(
                '<a href="%s" class="fc-listing__filter-item %s">%s</a>',
                esc_url($term_link),
                esc_attr($is_active),
                esc_html($term['name'])
            );
        }

        // International Filter
        if ($has_int) {
            $int_active = ('international' === $current_filter) ? 'is-active' : '';
            $int_link = add_query_arg('loc_filter', 'international');
            $filter_html .= sprintf(
                '<a href="%s" class="fc-listing__filter-item %s">%s</a>',
                esc_url($int_link),
                esc_attr($int_active),
                esc_html__('International', 'first-church-core-blocks')
            );
        }

        $filter_html .= '</div>';
    }
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-location-feed'
]);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

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

        <?php if ('pills' === $filter_style): ?>
            <div class="fc-listing__filter-bar">
                <?php echo $filter_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            </div>
        <?php endif; ?>
    </div>

    <div class="fc-listing__body <?php echo ('sidebar' === $filter_style) ? 'fc-listing__body--has-sidebar' : ''; ?>">

        <?php if ('sidebar' === $filter_style): ?>
            <div class="fc-listing__sidebar">
                <div class="fc-listing__sidebar-sticky">
                    <h4 class="fc-listing__sidebar-title">
                        <?php esc_html_e('Filter by Location', 'first-church-core-blocks'); ?>
                    </h4>
                    <?php echo $filter_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                </div>
            </div>
        <?php endif; ?>

        <div class="fc-listing__main">
            <div class="fc-listing__grid" style="--columns: 1; gap: 1.5rem;">
                <?php if (!empty($locations)): ?>
                    <?php foreach ($locations as $loc): ?>

                        <div class="fc-location-card">
                            <div class="fc-location-card__content">
                                <div class="fc-location-card__header">
                                    <div class="fc-location-card__title-group">
                                        <div class="fc-location-card__org-name">
                                            <?php esc_html_e('First Church Of Our Lord Jesus Christ, Inc.', 'first-church-core-blocks'); ?>
                                        </div>
                                        <div class="fc-location-card__location-name"><?php echo esc_html($loc['region'] ?: $loc['title']); ?>
                                        </div>
                                    </div>
                                </div>

                                <?php if ($loc['status']): ?>
                                    <div class="fc-location-card__status"><?php echo esc_html($loc['status']); ?></div>
                                <?php endif; ?>

                                <div class="fc-location-card__info-list">
                                    <?php if ($loc['address']): ?>
                                        <div class="fc-location-card__info-item">
                                            <div class="fc-location-card__icon">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                </svg>
                                            </div>
                                            <span><?php echo esc_html($loc['address']); ?></span>
                                        </div>
                                    <?php endif; ?>

                                    <?php if ($loc['times']): ?>
                                        <div class="fc-location-card__info-item">
                                            <div class="fc-location-card__icon">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />
                                                </svg>
                                            </div>
                                            <span><?php echo esc_html($loc['times']); ?></span>
                                        </div>
                                    <?php endif; ?>

                                    <?php if ($loc['phone']): ?>
                                        <div class="fc-location-card__info-item">
                                            <div class="fc-location-card__icon">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                                </svg>
                                            </div>
                                            <span><?php echo esc_html($loc['phone']); ?></span>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <?php if ($loc['map_html']): ?>
                                <div class="fc-location-card__map">
                                    <?php echo $loc['map_html']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="fc-no-results">
                        <p><?php esc_html_e('No locations found matching your criteria.', 'first-church-core-blocks'); ?>
                        </p>
                        <?php if ($current_filter): ?>
                            <p><a
                                    href="<?php echo esc_url(remove_query_arg('loc_filter')); ?>"><?php esc_html_e('View all locations', 'first-church-core-blocks'); ?></a>
                            </p>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>