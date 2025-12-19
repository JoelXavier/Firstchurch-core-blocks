<?php
/**
 * Render callback for the Event Feed block.
 */

$attributes = isset($attributes) ? $attributes : [];
$per_page = isset($attributes['perPage']) ? $attributes['perPage'] : 50; // Increased default to show all events
$columns = isset($attributes['columns']) ? $attributes['columns'] : 3;
$filter_style = isset($attributes['filterStyle']) ? $attributes['filterStyle'] : 'sidebar';
$block_title = isset($attributes['blockTitle']) ? $attributes['blockTitle'] : '';
$block_subtitle = isset($attributes['blockSubtitle']) ? $attributes['blockSubtitle'] : '';
$show_excerpt = isset($attributes['showExcerpt']) ? $attributes['showExcerpt'] : false;

// 1. Determine Active Month filter from URL ?filter_month=YYYY-MM
$active_month = isset($_GET['filter_month']) ? sanitize_text_field($_GET['filter_month']) : '';
$active_cat = isset($_GET['filter_category']) ? sanitize_text_field($_GET['filter_category']) : '';

// 2. Build Query
$args = array(
    'post_type' => 'event',
    'posts_per_page' => $per_page,
    'post_status' => 'publish',
    'meta_key' => '_event_start_date', // Main sort key
    'orderby' => 'meta_value',
    'order' => 'ASC'
);

// Date filtering logic
// If specific Month is selected:
if ($active_month) {
    // ... (This logic remains the same, verified it works for ranges)
    $month_parts = explode('-', $active_month);
    if (count($month_parts) === 2) {
        $year = intval($month_parts[0]);
        $month = intval($month_parts[1]);

        $start_date = date('Y-m-d 00:00:00', mktime(0, 0, 0, $month, 1, $year));
        $end_date = date('Y-m-d 23:59:59', mktime(23, 59, 59, $month + 1, 0, $year));

        // Logic: Event is visible if it overlaps with the month
        $args['meta_query'] = array(
            'relation' => 'AND',
            array(
                'key' => '_event_start_date',
                'value' => $end_date,
                'compare' => '<=',
                'type' => 'DATETIME'
            ),
            array(
                'relation' => 'OR',
                array(
                    'key' => '_event_end_date',
                    'value' => $start_date,
                    'compare' => '>=',
                    'type' => 'DATETIME'
                ),
                array(
                    'key' => '_event_start_date',
                    'value' => $start_date,
                    'compare' => '>=',
                    'type' => 'DATETIME'
                )
            )
        );
    }
} else {
    // Default: Show upcoming (or ongoing) events
    $today = date('Y-m-d H:i:s');
    $args['meta_query'] = array(
        'relation' => 'OR',
        array(
            'key' => '_event_end_date',
            'value' => $today,
            'compare' => '>=',
            'type' => 'DATETIME'
        ),
        array(
            'key' => '_event_start_date',
            'value' => $today,
            'compare' => '>=',
            'type' => 'DATETIME'
        )
    );
}

// Category filtering logic
if (!empty($active_cat)) {
    $args['tax_query'] = array(
        array(
            'taxonomy' => 'event_category',
            'field' => 'slug',
            'terms' => $active_cat,
        ),
    );
}

$query = new WP_Query($args);

// Debugging section removed


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

// 3.5 Generate Category List (Dynamic from currently upcoming events)
$categories_list = get_terms(array(
    'taxonomy' => 'event_category',
    'hide_empty' => true,
));

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'fc-listing fc-event-feed layout-' . esc_attr($filter_style)
));
?>

<div <?php echo $wrapper_attributes; ?>>

    <!-- Header -->
    <?php if ($block_title): ?>
        <div class="fc-listing__header">
            <h2 class="fc-listing__title"><?php echo esc_html($block_title); ?></h2>
            <div class="fc-listing__decoration"></div>
            <?php if ($block_subtitle): ?>
                <p class="fc-listing__subtitle"><?php echo esc_html($block_subtitle); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="fc-listing__body <?php echo ($filter_style === 'sidebar') ? 'fc-listing__body--has-sidebar' : ''; ?>">

        <!-- Sidebar Filters -->
        <?php if ($filter_style === 'sidebar'): ?>
            <div class="fc-listing__sidebar">
                <div class="fc-listing__sidebar-sticky">
                    <div class="fc-listing__filter-group">
                        <h4 class="fc-listing__sidebar-title"><?php _e('Filter by Month', 'first-church-core-blocks'); ?>
                        </h4>
                        <div class="fc-listing__filter-list">
                            <?php
                            $all_link = remove_query_arg('filter_month');
                            ?>
                            <a href="<?php echo esc_url($all_link); ?>"
                                class="fc-listing__filter-item <?php echo empty($active_month) ? 'is-active' : ''; ?>">
                                <?php _e('All Upcoming', 'first-church-core-blocks'); ?>
                            </a>

                            <?php foreach ($months_list as $m):
                                $is_active = ($m['key'] === $active_month);
                                // add_query_arg automatically maintains other query params like filter_category
                                $link = add_query_arg('filter_month', $m['key']);
                                ?>
                                <a href="<?php echo esc_url($link); ?>"
                                    class="fc-listing__filter-item <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <?php echo esc_html($m['label']); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="fc-listing__filter-group">
                        <h4 class="fc-listing__sidebar-title"><?php _e('Filter by Category', 'first-church-core-blocks'); ?>
                        </h4>
                        <div class="fc-listing__filter-list">
                            <?php
                            $all_cat_link = remove_query_arg('filter_category');
                            ?>
                            <a href="<?php echo esc_url($all_cat_link); ?>"
                                class="fc-listing__filter-item <?php echo empty($active_cat) ? 'is-active' : ''; ?>">
                                <?php _e('All Categories', 'first-church-core-blocks'); ?>
                            </a>

                            <?php foreach ($categories_list as $cat):
                                $is_active = ($cat->slug === $active_cat);
                                $cat_link = add_query_arg('filter_category', $cat->slug);
                                ?>
                                <a href="<?php echo esc_url($cat_link); ?>"
                                    class="fc-listing__filter-item <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <?php echo esc_html($cat->name); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Main Grid -->
        <div class="fc-listing__main">
            <div class="fc-listing__grid" style="--columns: <?php echo esc_attr($columns); ?>">
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
                        $label = get_post_meta($pid, '_event_label', true);
                        if (empty($label)) {
                            $terms = get_the_terms($pid, 'event_category');
                            if ($terms && !is_wp_error($terms)) {
                                $label = $terms[0]->name;
                            }
                        }
                        if (empty($label)) {
                            $label = 'Event';
                        }

                        $location = get_post_meta($pid, '_event_location', true);
                        $cta_text = get_post_meta($pid, '_event_cta_text', true) ?: 'Get Tickets';
                        $cta_url = get_post_meta($pid, '_event_cta_url', true);
                        $is_canceled = get_post_meta($pid, '_event_is_canceled', true);

                        // If external URL is set, use it. Otherwise permalink.
                        $link_url = $cta_url ?: $permalink;
                        $target_attr = $cta_url ? 'target="_blank" rel="noopener noreferrer"' : '';
                        ?>
                        <!-- Event Card Markup (Matches EventCard.scss) -->
                        <div class="fc-event-card <?php echo $is_canceled ? 'fc-event-card--canceled' : ''; ?>">
                            <a href="<?php echo esc_url($link_url); ?>" class="event-card-link" style="display:contents;"
                                <?php echo $target_attr; ?>>
                                <!-- 1. Media -->
                                <?php if ($img_url): ?>
                                    <div class="fc-event-card__media">
                                        <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($title); ?>">
                                    </div>
                                <?php endif; ?>

                                <!-- 2. Date Badge -->
                                <div class="fc-event-card__date-badge">
                                    <span class="fc-event-card__month"><?php echo esc_html($month_short); ?></span>
                                    <span class="fc-event-card__day"><?php echo esc_html($day); ?></span>
                                </div>

                                <!-- 3. Content -->
                                <div class="fc-event-card__content">
                                    <span class="fc-event-card__label"><?php echo esc_html($label); ?></span>
                                    <h3 class="fc-event-card__title">
                                        <span class="fc-event-card__link"><?php echo esc_html($title); ?></span>
                                    </h3>
                                    <?php if (!empty($location)): ?>
                                        <div class="fc-event-card__location"
                                            style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                                            <?php echo esc_html($location); ?>
                                        </div>
                                    <?php endif; ?>
                                    <div class="fc-event-card__meta">
                                        <?php if (empty($schedule) || !is_string($schedule)): ?>
                                            <?php echo esc_html($date_str); ?>
                                        <?php endif; ?>
                                    </div>

                                    <!-- Schedule List -->
                                    <?php if (!empty($schedule) && is_string($schedule)):
                                        $lines = explode("\n", $schedule);
                                        ?>
                                        <div class="fc-event-card__schedule-list">
                                            <?php foreach ($lines as $line):
                                                if (trim($line)): ?>
                                                    <div class="fc-event-card__schedule-item"><?php echo esc_html($line); ?></div>
                                                <?php endif; endforeach; ?>
                                        </div>
                                    <?php elseif (!empty($schedule) && is_array($schedule)): ?>
                                        <div class="fc-event-card__schedule-list">
                                            <?php foreach ($schedule as $item): ?>
                                                <?php if (!empty($item['time']) || !empty($item['activity'])): ?>
                                                    <div class="fc-event-card__schedule-item">
                                                        <strong><?php echo esc_html($item['time']); ?></strong>
                                                        <?php echo esc_html($item['activity']); ?>
                                                    </div>
                                                <?php endif; ?>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>

                                <!-- 4. Action -->
                                <div class="fc-event-card__action">
                                    <?php if ($is_canceled): ?>
                                        <span class="fc-event-card__status-badge">Canceled</span>
                                    <?php else: ?>
                                        <span class="fc-event-card__button"><?php echo esc_html($cta_text); ?></span>
                                    <?php endif; ?>
                                </div>
                            </a>
                        </div>
                    <?php endwhile;
                    wp_reset_postdata(); ?>
                <?php else: ?>
                    <div class="fc-no-results">
                        <p>No upcoming events found for this period.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>

    </div>
</div>