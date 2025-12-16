<?php
/**
 * Render callback for the Event Feed block.
 */

$attributes = isset($attributes) ? $attributes : [];
$per_page = isset($attributes['perPage']) ? $attributes['perPage'] : 9;
$columns = isset($attributes['columns']) ? $attributes['columns'] : 3;
$filter_style = isset($attributes['filterStyle']) ? $attributes['filterStyle'] : 'sidebar';
$block_title = isset($attributes['blockTitle']) ? $attributes['blockTitle'] : '';
$block_subtitle = isset($attributes['blockSubtitle']) ? $attributes['blockSubtitle'] : '';
$show_excerpt = isset($attributes['showExcerpt']) ? $attributes['showExcerpt'] : false;

// 1. Determine Active Month filter from URL ?filter_month=YYYY-MM
$active_month = isset($_GET['filter_month']) ? sanitize_text_field($_GET['filter_month']) : '';

// 2. Build Query
$args = array(
    'post_type' => 'event',
    'posts_per_page' => $per_page,
    'post_status' => 'publish',
    'meta_key' => '_event_start_date',  // We assume this meta key exists
    'orderby' => 'meta_value',
    'order' => 'ASC'
);

// Date filtering logic
if (!empty($active_month)) {
    // Expected format: 2025-10
    $parts = explode('-', $active_month);
    if (count($parts) === 2) {
        $year = intval($parts[0]);
        $month = intval($parts[1]);

        // Start of month
        $start_date = date('Y-m-d H:i:s', mktime(0, 0, 0, $month, 1, $year));
        // End of month
        $end_date = date('Y-m-d H:i:s', mktime(23, 59, 59, $month + 1, 0, $year));

        $args['meta_query'] = array(
            array(
                'key' => '_event_start_date',
                'value' => array($start_date, $end_date),
                'compare' => 'BETWEEN',
                'type' => 'CHAR' // Use CHAR for consistent string comparison
            )
        );
    }
} else {
    // Default: Show only future events?
    // Use start of today to include events happening today
    $args['meta_query'] = array(
        array(
            'key' => '_event_start_date',
            'value' => date('Y-m-d') . 'T00:00:00', // Try strict ISO start of day just in case
            'compare' => '>=',
            'type' => 'CHAR' // Use CHAR to handle the 'T' separator gracefully
        )
    );
}

$query = new WP_Query($args);

// 3. Generate Filter List (Dynamic from Database)
// We need to find all unique months that have events.
// A raw SQL query is most efficient for this.
global $wpdb;
$months_sql = "
    SELECT DISTINCT LEFT(meta_value, 7) as month_str, meta_value 
    FROM $wpdb->postmeta 
    INNER JOIN $wpdb->posts ON $wpdb->posts.ID = $wpdb->postmeta.post_id
    WHERE meta_key = '_event_start_date' 
    AND post_type = 'event' 
    AND post_status = 'publish'
    AND meta_value >= %s
    ORDER BY meta_value ASC
    LIMIT 12
";
// Compare against today's date YYYY-MM-DD to be format agnostic
$raw_months = $wpdb->get_results($wpdb->prepare($months_sql, date('Y-m-d')));
// Result: 2025-10, 2025-11 ...

$months_list = [];
$seen = [];
foreach ($raw_months as $row) {
    // meta_value expected "YYYY-MM-DD HH:MM:SS"
    $ts = strtotime($row->meta_value);
    $key = date('Y-m', $ts);
    $label = date('F Y', $ts);

    if (!in_array($key, $seen)) {
        $months_list[] = ['key' => $key, 'label' => $label];
        $seen[] = $key;
    }
}

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'antigravity-listing-component antigravity-event-feed layout-' . esc_attr($filter_style)
));
?>

<div <?php echo $wrapper_attributes; ?>>

    <!-- Header -->
    <?php if ($block_title): ?>
        <div class="listing-header">
            <h2 class="listing-title"><?php echo esc_html($block_title); ?></h2>
            <div class="listing-decoration"></div>
            <?php if ($block_subtitle): ?>
                <p class="listing-subtitle"><?php echo esc_html($block_subtitle); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="listing-body">

        <!-- Sidebar Filters -->
        <?php if ($filter_style === 'sidebar'): ?>
            <div class="listing-sidebar">
                <div class="listing-sidebar-sticky">
                    <div class="listing-filters listing-filters--sidebar">
                        <!-- 'All Upcoming' Button -->
                        <?php
                        // Robust link generation: Use current page URL to avoid 'home' redirection issues
                        global $wp;
                        $current_url = home_url(add_query_arg([], $wp->request));
                        // Ensure trailing slash for cleanness if not file ext
                        if (substr($current_url, -1) !== '/' && strpos($current_url, '?') === false) {
                            $current_url .= '/';
                        }

                        $all_link = remove_query_arg('filter_month', $current_url);
                        ?>
                        <a href="<?php echo esc_url($all_link); ?>"
                            class="filter-btn <?php echo empty($active_month) ? 'is-active' : ''; ?>">
                            <span class="filter-label">All Upcoming</span>
                        </a>

                        <h4 class="filter-group-title">By Month</h4>

                        <?php foreach ($months_list as $m):
                            $is_active = ($m['key'] === $active_month);
                            $link = add_query_arg('filter_month', $m['key'], $current_url);
                            ?>
                            <a href="<?php echo esc_url($link); ?>"
                                class="filter-btn <?php echo $is_active ? 'is-active' : ''; ?>">
                                <span class="filter-label"><?php echo esc_html($m['label']); ?></span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Main Grid -->
        <div class="listing-main">
            <div class="listing-grid" style="--columns: <?php echo esc_attr($columns); ?>">
                <?php if ($query->have_posts()): ?>
                    <?php while ($query->have_posts()):
                        $query->the_post();
                        $pid = get_the_ID();
                        $title = get_the_title();
                        $permalink = get_permalink();
                        $img_url = get_the_post_thumbnail_url($pid, 'large');
                        $start_date = get_post_meta($pid, '_event_start_date', true);
                        $end_date = get_post_meta($pid, '_event_end_date', true);
                        $schedule = get_post_meta($pid, '_event_schedule', true);

                        // Parse Date
                        $day = '';
                        $month_short = '';
                        $date_str = '';
                        if ($start_date) {
                            $ts = strtotime($start_date);
                            $day = date('d', $ts);
                            $month_short = date('M', $ts);
                            $date_str = date('F j, Y', $ts);

                            // Handle Range
                            if ($end_date) {
                                $ts_end = strtotime($end_date);
                                // If same year
                                if (date('Y', $ts) === date('Y', $ts_end)) {
                                    // If same month
                                    if (date('m', $ts) === date('m', $ts_end)) {
                                        $date_str = date('F j', $ts) . ' - ' . date('j, Y', $ts_end);
                                    } else {
                                        $date_str = date('F j', $ts) . ' - ' . date('F j, Y', $ts_end);
                                    }
                                } else {
                                    $date_str = date('F j, Y', $ts) . ' - ' . date('F j, Y', $ts_end);
                                }
                            }
                        }

                        // Meta Fields
                        $label = get_post_meta($pid, '_event_label', true) ?: 'Event';
                        $location = get_post_meta($pid, '_event_location', true);
                        $cta_text = get_post_meta($pid, '_event_cta_text', true) ?: 'Get Tickets';
                        $cta_url = get_post_meta($pid, '_event_cta_url', true);
                        $is_canceled = get_post_meta($pid, '_event_is_canceled', true);

                        // If external URL is set, use it. Otherwise permalink.
                        $link_url = $cta_url ?: $permalink;
                        $target_attr = $cta_url ? 'target="_blank" rel="noopener noreferrer"' : '';
                        ?>
                        <!-- Event Card Markup (Matches EventCard.scss) -->
                        <div class="antigravity-event-card <?php echo $is_canceled ? 'is-canceled' : ''; ?>">
                            <a href="<?php echo esc_url($link_url); ?>" class="event-card-link" style="display:contents;" <?php echo $target_attr; ?>>
                                <!-- 1. Media -->
                                <?php if ($img_url): ?>
                                    <div class="event-media">
                                        <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($title); ?>">
                                    </div>
                                <?php endif; ?>

                                <!-- 2. Date Badge -->
                                <div class="event-date-badge">
                                    <span class="event-month"><?php echo esc_html($month_short); ?></span>
                                    <span class="event-day"><?php echo esc_html($day); ?></span>
                                </div>

                                <!-- 3. Content -->
                                <div class="event-content">
                                    <span class="event-label"><?php echo esc_html($label); ?></span>
                                    <h3 class="event-title">
                                        <span class="event-link"><?php echo esc_html($title); ?></span>
                                    </h3>
                                    <?php if (!empty($location)): ?>
                                        <div class="event-location"
                                            style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                                            <?php echo esc_html($location); ?>
                                        </div>
                                    <?php endif; ?>
                                    <div class="event-meta">
                                        <?php echo esc_html($date_str); ?>
                                    </div>

                                    <!-- Schedule List -->
                                    <?php if (!empty($schedule) && is_array($schedule)): ?>
                                        <div class="event-schedule-list">
                                            <?php foreach ($schedule as $item): ?>
                                                <?php if (!empty($item['time']) || !empty($item['activity'])): ?>
                                                    <div class="event-schedule-item">
                                                        <strong><?php echo esc_html($item['time']); ?></strong>
                                                        <?php echo esc_html($item['activity']); ?>
                                                    </div>
                                                <?php endif; ?>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>

                                <!-- 4. Action -->
                                <div class="event-action">
                                    <?php if ($is_canceled): ?>
                                        <span class="event-status-badge">Canceled</span>
                                    <?php else: ?>
                                        <span class="event-button"><?php echo esc_html($cta_text); ?></span>
                                    <?php endif; ?>
                                </div>
                            </a>
                        </div>
                    <?php endwhile;
                    wp_reset_postdata(); ?>
                <?php else: ?>
                    <div class="no-results">
                        <p>No upcoming events found for this period.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>

    </div>
</div>