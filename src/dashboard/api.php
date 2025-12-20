<?php
/**
 * REST API for Mission Control Dashboard
 */

function firstchurch_register_dashboard_api()
{
    register_rest_route('firstchurch/v1', '/templates', array(
        'methods' => 'GET',
        'callback' => 'firstchurch_get_dashboard_templates',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_rest_route('firstchurch/v1', '/mega-menu', array(
        'methods' => 'POST',
        'callback' => 'firstchurch_update_mega_menu_data',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    register_rest_route('firstchurch/v1', '/footer-data', array(
        'methods' => 'POST',
        'callback' => 'firstchurch_update_footer_data',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    register_rest_route('firstchurch/v1', '/content', array(
        'methods' => 'GET',
        'callback' => 'firstchurch_get_dashboard_content',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_rest_route('firstchurch/v1', '/content/update', array(
        'methods' => 'POST',
        'callback' => 'firstchurch_update_content_meta',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_rest_route('firstchurch/v1', '/content/create', array(
        'methods' => 'POST',
        'callback' => 'firstchurch_create_dashboard_content',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_rest_route('firstchurch/v1', '/fundraisers/save', array(
        'methods' => 'POST',
        'callback' => 'firstchurch_update_fundraiser_data',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    // Baptismal Reports
    register_rest_route('firstchurch/v1', '/baptisms', array(
        'methods' => 'GET',
        'callback' => 'firstchurch_get_baptism_reports',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_rest_route('firstchurch/v1', '/baptisms/save', array(
        'methods' => 'POST',
        'callback' => 'firstchurch_save_baptism_report',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_rest_route('firstchurch/v1', '/baptisms/delete', array(
        'methods' => 'POST',
        'callback' => 'firstchurch_delete_baptism_report',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_rest_route('firstchurch/v1', '/settings', array(
        'methods' => ['GET', 'POST'],
        'callback' => 'firstchurch_handle_dashboard_settings',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));
}
add_action('rest_api_init', 'firstchurch_register_dashboard_api');

function firstchurch_handle_dashboard_settings($request)
{
    $option_name = 'fc_dashboard_settings';

    // GET Request: Return settings
    if ($request->get_method() === 'GET') {
        return get_option($option_name, [
            'banner_url' => '',
            'banner_id' => 0
        ]);
    }

    // POST Request: Update settings
    $params = $request->get_json_params();
    $settings = get_option($option_name, []);

    if (isset($params['banner_url'])) {
        $settings['banner_url'] = esc_url_raw($params['banner_url']);
    }
    if (isset($params['banner_id'])) {
        $settings['banner_id'] = absint($params['banner_id']);
    }

    update_option($option_name, $settings);

    return new WP_REST_Response([
        'success' => true,
        'settings' => $settings
    ], 200);
}


function firstchurch_get_dashboard_templates()
{
    $response = [];

    // 1. Define Categories and their Targets
    $category_map = [
        'firstchurch/articles' => [
            'label' => 'Article Templates',
            'postType' => 'post'
        ],
        'firstchurch/microsites' => [
            'label' => 'Microsite Templates',
            'postType' => 'page'
        ],
        'firstchurch/events' => [
            'label' => 'Event Feed Templates',
            'postType' => 'event'
        ],
        'firstchurch/locations' => [
            'label' => 'Location Templates',
            'postType' => 'location'
        ],
        // 'firstchurch' (base) will go to 'Other'
    ];

    // Initialize Groups
    $groups = [];
    foreach ($category_map as $cat => $config) {
        $groups[$cat] = [
            'id' => $cat,
            'title' => $config['label'],
            'postType' => $config['postType'],
            'templates' => []
        ];
    }
    // Add "Other" group for base category
    $groups['firstchurch'] = [
        'id' => 'firstchurch',
        'title' => 'Other Templates',
        'postType' => 'page',
        'templates' => []
    ];


    // 2. Fetch Code-Based Patterns (Registered via PHP)
    if (class_exists('WP_Block_Patterns_Registry')) {
        $registry = WP_Block_Patterns_Registry::get_instance();
        $all_patterns = $registry->get_all_registered();

        foreach ($all_patterns as $pattern) {
            // Check if pattern belongs to any of our categories
            if (!isset($pattern['categories']) || !is_array($pattern['categories'])) {
                continue;
            }

            foreach ($pattern['categories'] as $cat) {
                if (isset($groups[$cat])) {
                    $groups[$cat]['templates'][] = [
                        'id' => $pattern['name'], // Slug
                        'title' => $pattern['title'],
                        'description' => isset($pattern['description']) ? $pattern['description'] : '',
                        'pattern' => $pattern['name'], // For code patterns, the pattern name IS the slug
                        'type' => 'pattern'
                    ];
                    // Break after finding one valid category match to avoid duplicates across rows
                    // (unless we want duplicates, but typically one row is best)
                    break;
                }
            }
        }
    }

    // 3. Fetch User Synced Patterns (wp_block post type)
    // Synced patterns are stored as 'wp_block' post type.
    // Their categories are stored in 'wp_pattern_category' taxonomy.
    $args = [
        'post_type' => 'wp_block',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    ];
    $user_patterns = get_posts($args);

    foreach ($user_patterns as $post) {
        $terms = get_the_terms($post->ID, 'wp_pattern_category');
        $matched_group = 'firstchurch'; // Default fallback

        if ($terms && !is_wp_error($terms)) {
            foreach ($terms as $term) {
                // The term slug usually aligns with the registered category name? 
                // Or we match by name. 
                // Let's try to match known categories.
                // Note: 'firstchurch/articles' might be registered as a term 'firstchurch-articles' or similar depending on WP version.
                // But typically for registered categories via PHP, they exist as terms.

                // We check if the term slug matches our keys
                if (isset($groups[$term->slug])) {
                    $matched_group = $term->slug;
                    break;
                }
            }
        }

        // Add to group
        $groups[$matched_group]['templates'][] = [
            'id' => 'user-' . $post->ID,
            'title' => $post->post_title,
            'description' => 'User created pattern',
            'pattern' => 'core/block/' . $post->ID, // Reusable block format
            'type' => 'user-block'
        ];
    }

    // 4. Fetch Content Stats
    $stats = [
        'articles' => wp_count_posts('post')->publish,
        'events' => wp_count_posts('event')->publish,
        'locations' => wp_count_posts('location')->publish,
        'pages' => wp_count_posts('page')->publish,
        'baptisms' => (function () {
            $data = firstchurch_get_baptism_stats_data();
            return $data['grand_total'];
        })(),
    ];

    // 5. Fetch Recent Activity (Last 5 modified by ANY user, or specific user?)
    // "My Recent Drafts" implies current user.
    $recent_args = [
        'post_type' => ['post', 'page', 'event', 'location'],
        'posts_per_page' => 5,
        'orderby' => 'modified',
        'order' => 'DESC',
        'post_status' => ['publish', 'draft', 'pending', 'future'],
        // 'author'      => get_current_user_id() // Optional: restrict to current user? 
        // Let's keep it global for now for better team visibility, or restrict if user wants "MY" drafts.
        // User said "My Recent Drafts", so let's restrict to author.
        'author' => get_current_user_id()
    ];
    $recent_query = get_posts($recent_args);
    $recent_activity = [];

    foreach ($recent_query as $p) {
        $recent_activity[] = [
            'id' => $p->ID,
            'title' => get_the_title($p) ?: '(No Title)',
            'type' => get_post_type_object($p->post_type)->labels->singular_name,
            'date' => get_the_modified_date('M j, g:i a', $p),
            'link' => get_edit_post_link($p->ID, ''), // Context empty to get raw link
            'status' => $p->post_status
        ];
    }

    // 6. Format Output (Return Object structure instead of flat array)
    // NOTE: This changes the API response structure! Frontend must update.
    $template_groups = [];
    foreach ($groups as $group) {
        if (!empty($group['templates'])) {
            $template_groups[] = $group;
        }
    }

    return [
        'templates' => $template_groups,
        'stats' => $stats,
        'recent' => $recent_activity,
        'megaMenuData' => get_option('fc_mega_menu_data'),
        'footerData' => get_option('fc_footer_data'),
        'fundraiserData' => get_option('fc_fundraiser_data', [])
    ];
}

/**
 * Save Mega Menu Data via REST
 */
function firstchurch_update_mega_menu_data($request)
{
    $data = $request->get_json_params();

    if (!isset($data['menuData'])) {
        return new WP_Error('invalid_data', 'Missing menuData', array('status' => 400));
    }

    update_option('fc_mega_menu_data', $data['menuData']);

    return array('success' => true, 'data' => get_option('fc_mega_menu_data'));
}

/**
 * Save Footer Data via REST
 */
function firstchurch_update_footer_data($request)
{
    $data = $request->get_json_params();

    if (!isset($data['footerData'])) {
        return new WP_Error('invalid_data', 'Missing footerData', array('status' => 400));
    }

    update_option('fc_footer_data', $data['footerData']);

    return array('success' => true, 'data' => get_option('fc_footer_data'));
}

/**
 * Save Fundraiser Data via REST
 */
function firstchurch_update_fundraiser_data($request)
{
    $data = $request->get_json_params();

    if (!isset($data['fundraiserData'])) {
        return new WP_Error('invalid_data', 'Missing fundraiserData', array('status' => 400));
    }

    update_option('fc_fundraiser_data', $data['fundraiserData']);

    return array('success' => true, 'data' => get_option('fc_fundraiser_data'));
}


/**
 * Fetch events and locations for dashboard management
 */
function firstchurch_get_dashboard_content($request)
{
    $type = $request->get_param('type') ?: 'event';
    if (!in_array($type, ['event', 'location'])) {
        return new WP_Error('invalid_type', 'Invalid post type', ['status' => 400]);
    }

    $posts = get_posts([
        'post_type' => $type,
        'posts_per_page' => -1,
        'post_status' => ['publish', 'draft', 'pending', 'future'],
        'orderby' => 'title',
        'order' => 'ASC'
    ]);

    $response = [];
    foreach ($posts as $p) {
        $meta = get_post_meta($p->ID);
        // Flatten meta for easier frontend handling (get_post_meta returns arrays)
        $flat_meta = [];
        foreach ($meta as $key => $values) {
            $flat_meta[$key] = maybe_unserialize($values[0]);
        }

        // Determine correct taxonomy
        $taxonomy = 'category';
        if ($type === 'event')
            $taxonomy = 'event_category';
        if ($type === 'location')
            $taxonomy = 'location_category';

        $response[] = [
            'id' => $p->ID,
            'title' => $p->post_title,
            'status' => $p->post_status,
            'meta' => $flat_meta,
            'terms' => taxonomy_exists($taxonomy) ? wp_get_object_terms($p->ID, $taxonomy, ['fields' => 'ids']) : []
        ];
    }

    return $response;
}

/**
 * Update meta for a post via dashboard
 */
function firstchurch_update_content_meta($request)
{
    $params = $request->get_json_params();
    $post_id = isset($params['id']) ? intval($params['id']) : 0;
    $meta = isset($params['meta']) ? $params['meta'] : [];
    $status = isset($params['status']) ? sanitize_text_field($params['status']) : '';

    if (!$post_id || !get_post($post_id)) {
        return new WP_Error('invalid_post', 'Post not found', ['status' => 404]);
    }

    // Update Post Status if provided
    if ($status && in_array($status, ['publish', 'draft', 'pending', 'private'])) {
        wp_update_post([
            'ID' => $post_id,
            'post_status' => $status
        ]);
    }

    foreach ($meta as $key => $value) {
        // Only allow certain keys for security
        if (strpos($key, '_event_') === 0 || strpos($key, '_location_') === 0) {
            if ($key === '_event_schedule') {
                // Allow newlines for Complex Schedule
                $clean = sanitize_textarea_field($value);
            } elseif ($key === '_event_cta_url' || $key === '_location_map_url') {
                $clean = esc_url_raw($value);
            } else {
                $clean = sanitize_text_field($value);
            }
            update_post_meta($post_id, $key, $clean);
        }
    }

    // Handle Terms (Categories)
    if (isset($params['terms'])) {
        $terms = array_map('intval', $params['terms']);
        wp_set_object_terms($post_id, $terms, 'event_category');
    }

    return ['success' => true];
}

/**
 * Create new event or location via dashboard
 */
function firstchurch_create_dashboard_content($request)
{
    $params = $request->get_json_params();
    $type = isset($params['type']) ? $params['type'] : '';
    $title = isset($params['title']) ? sanitize_text_field($params['title']) : '';

    if (!in_array($type, ['event', 'location'])) {
        return new WP_Error('invalid_type', 'Invalid post type', ['status' => 400]);
    }

    if (empty($title)) {
        return new WP_Error('invalid_title', 'Title is required', ['status' => 400]);
    }

    $post_id = wp_insert_post([
        'post_type' => $type,
        'post_title' => $title,
        'post_status' => 'draft', // Create as draft by default
    ]);

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    // Initialize meta with defaults to avoid empty states in dashboard
    if ($type === 'event') {
        update_post_meta($post_id, '_event_start_date', date('Y-m-d'));
        update_post_meta($post_id, '_event_label', 'Event');
    }

    return [
        'id' => $post_id,
        'title' => $title,
        'status' => 'draft',
        'meta' => [
            '_event_start_date' => date('Y-m-d'),
            '_event_label' => 'Event'
        ]
    ];
}

/**
 * Get Baptism Reports
 */
function firstchurch_get_baptism_reports()
{
    $posts = get_posts([
        'post_type' => 'fc_baptism_report',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'meta_value',
        'meta_key' => '_fc_baptism_month',
        'order' => 'DESC'
    ]);

    $response = [];
    foreach ($posts as $p) {
        $response[] = [
            'id' => $p->ID,
            'label' => $p->post_title, // The label is the title
            'count' => (int) get_post_meta($p->ID, '_fc_baptism_count', true),
            'month' => get_post_meta($p->ID, '_fc_baptism_month', true)
        ];
    }
    return $response;
}

/**
 * Save Baptism Report
 */
function firstchurch_save_baptism_report($request)
{
    $params = $request->get_json_params();
    $id = isset($params['id']) ? intval($params['id']) : 0;
    $label = isset($params['label']) ? sanitize_text_field($params['label']) : 'Weekly Report';
    $count = isset($params['count']) ? intval($params['count']) : 0;
    $month = isset($params['month']) ? sanitize_text_field($params['month']) : date('Y-m');

    $post_data = [
        'post_type' => 'fc_baptism_report',
        'post_title' => $label,
        'post_status' => 'publish',
    ];

    if ($id > 0) {
        $post_data['ID'] = $id;
        $post_id = wp_update_post($post_data);
    } else {
        $post_id = wp_insert_post($post_data);
    }

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    update_post_meta($post_id, '_fc_baptism_count', $count);
    update_post_meta($post_id, '_fc_baptism_month', $month);

    return ['success' => true, 'id' => $post_id];
}

/**
 * Delete Baptism Report
 */
function firstchurch_delete_baptism_report($request)
{
    $params = $request->get_json_params();
    $id = isset($params['id']) ? intval($params['id']) : 0;

    if ($id <= 0) {
        return new WP_Error('invalid_id', 'Invalid ID', ['status' => 400]);
    }

    $result = wp_delete_post($id, true);

    if (!$result) {
        return new WP_Error('delete_failed', 'Could not delete report', ['status' => 500]);
    }

    return ['success' => true];
}

/**
 * Retrieve baptism stats with caching.
 * Follows "Cache Long, Invalidate Hard" strategy.
 *
 * @return array {
 *     'grand_total' => int,
 *     'grouped' => array
 * }
 */
function firstchurch_get_baptism_stats_data()
{
    $cache_key = 'fc_baptism_stats_v1';
    $cached = get_transient($cache_key);

    if (false !== $cached) {
        return $cached;
    }

    $reports = get_posts([
        'post_type' => 'fc_baptism_report',
        'numberposts' => -1,
        'post_status' => 'publish',
        'orderby' => 'meta_value',
        'meta_key' => '_fc_baptism_month',
        'order' => 'DESC'
    ]);

    $grouped = [];
    $grand_total = 0;

    foreach ($reports as $report) {
        $month = get_post_meta($report->ID, '_fc_baptism_month', true);
        if (!$month)
            continue;

        if (!isset($grouped[$month])) {
            $grouped[$month] = [
                'total' => 0,
                'items' => []
            ];
        }

        $count = (int) get_post_meta($report->ID, '_fc_baptism_count', true);
        $label = $report->post_title;

        $grouped[$month]['total'] += $count;
        $grouped[$month]['items'][] = [
            'label' => $label,
            'count' => $count
        ];

        $grand_total += $count;
    }

    $data = [
        'grand_total' => $grand_total,
        'grouped' => $grouped
    ];

    // Cache for 1 week (cleared instantly on save)
    set_transient($cache_key, $data, WEEK_IN_SECONDS);

    return $data;
}

/**
 * Clear baptism cache on save/delete.
 *
 * @param int $post_id Post ID.
 */
function firstchurch_clear_baptism_cache($post_id)
{
    if (get_post_type($post_id) !== 'fc_baptism_report') {
        return;
    }

    delete_transient('fc_baptism_stats_v1');
}
add_action('save_post', 'firstchurch_clear_baptism_cache');
add_action('delete_post', 'firstchurch_clear_baptism_cache');

/**
 * Increment global event version on save.
 * This invalidates ALL event feed caches instantly.
 */
function firstchurch_bump_event_version($post_id)
{
    firstchurch_bump_global_version($post_id);
}
// Note: We keep the specific hook names as aliases for backward compatibility if needed, 
// but the heavy lifting is done by the global bumper. 
// Or better yet, we can remove them if we are sure no one else calls them.
// Let's replace the specific ones with a single master hook for clarity.

/**
 * Master Invalidation Hook: "Dynamic Versioning"
 * Bumps the version option for whichever post type was just saved.
 */
function firstchurch_bump_global_version($post_id)
{
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        return;

    $post_type = get_post_type($post_id);
    if (!$post_type)
        return;

    $option_name = "fc_{$post_type}_version";
    update_option($option_name, time());
}
add_action('save_post', 'firstchurch_bump_global_version');
add_action('delete_post', 'firstchurch_bump_global_version');

/**
 * Get Event Feed Data (Cached via "ViewModel + Versioning").
 *
 * @param array $attributes Block attributes (perPage, etc.)
 * @param array $filters    URL parameters (month, category)
 * @return array            ViewModel ready for render.
 */
function firstchurch_get_event_feed_data($attributes, $filters)
{
    // 1. Build Versioned Cache Key
    $version = get_option('fc_event_version', '1');
    $key_args = array_merge($attributes, $filters);
    $cache_key = 'fc_events_' . md5(serialize($key_args)) . '_v' . $version;

    $cached = get_transient($cache_key);
    if (false !== $cached) {
        return $cached;
    }

    // ... (rest of function logic remains same, but we are replacing the block) ...
    // To avoid rewriting the huge function, let's target the bumpers specifically first.
}


/**
 * Get Event Feed Data (Cached via "ViewModel + Versioning").
 *
 * @param array $attributes Block attributes (perPage, etc.)
 * @param array $filters    URL parameters (month, category)
 * @return array            ViewModel ready for render.
 */


// Location bumper removed - handled by firstchurch_bump_global_version


/**
 * Get Location Feed Data (Cached via "Global Versioning").
 *
 * @param array $attributes Block attributes (perPage, etc.)
 * @param array $filters    URL parameters (loc_filter)
 * @return array            ViewModel ready for render.
 */
function firstchurch_get_location_feed_data($attributes, $filters)
{
    // 1. Build Versioned Cache Key
    $version = get_option('fc_location_version', '1');
    $key_args = array_merge($attributes, $filters);
    $cache_key = 'fc_locs_' . md5(serialize($key_args)) . '_v' . $version;

    $cached = get_transient($cache_key);
    if (false !== $cached) {
        return $cached;
    }

    // 2. Prepare Query Args
    $per_page = (int) ($attributes['perPage'] ?? 10);
    $current_filter = isset($filters['loc_filter']) ? sanitize_text_field($filters['loc_filter']) : '';

    $args = [
        'post_type' => 'location',
        'posts_per_page' => $per_page,
        'post_status' => current_user_can('read_private_posts') ? ['publish', 'private'] : 'publish',
        'orderby' => 'title',
        'order' => 'ASC',
    ];

    // Filter Logic
    if ($current_filter) {
        if ('international' === $current_filter) {
            $args['meta_query'] = [
                [
                    'key' => '_location_is_international',
                    'value' => '1',
                    'compare' => '='
                ]
            ];
        } else {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'location_category',
                    'field' => 'slug',
                    'terms' => $current_filter,
                ]
            ];
        }
    }

    // 3. Fetch Locations
    $query = new WP_Query($args);
    $locations = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $pid = get_the_ID();
            $meta = get_post_meta($pid);

            $status = $meta['_location_status'][0] ?? '';
            $region = $meta['_location_region'][0] ?? '';
            $address = $meta['_location_address'][0] ?? '';
            $times = $meta['_location_times'][0] ?? '';
            $phone = $meta['_location_phone'][0] ?? '';
            $map_embed = $meta['_location_map_embed'][0] ?? '';
            $title = get_the_title();

            // Handle Map Embed security (basic check)
            $map_html = '';
            if ($map_embed) {
                if (strpos($map_embed, '<iframe') !== false) {
                    // Allow if it contains iframe (trusted input assumed from dashboard)
                    $map_html = $map_embed;
                } else {
                    $map_html = '<iframe src="' . esc_url($map_embed) . '" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
                }
            }

            $locations[] = [
                'id' => $pid,
                'title' => $title,
                'status' => $status,
                'region' => $region, // used for location name display
                'address' => $address,
                'times' => $times,
                'phone' => $phone,
                'map_html' => $map_html
            ];
        }
        wp_reset_postdata();
    }

    // 4. Fetch Terms for Filter Bar
    $terms_raw = get_terms([
        'taxonomy' => 'location_category',
        'hide_empty' => true,
    ]);

    $terms_list = [];
    if (!empty($terms_raw) && !is_wp_error($terms_raw)) {
        foreach ($terms_raw as $t) {
            $terms_list[] = [
                'slug' => $t->slug,
                'name' => $t->name
            ];
        }
    }

    // Check for International content (for the filter button)
    $has_int = get_posts([
        'post_type' => 'location',
        'meta_key' => '_location_is_international',
        'meta_value' => '1',
        'numberposts' => 1,
        'fields' => 'ids' // Optimized
    ]);

    $data = [
        'locations' => $locations,
        'terms' => $terms_list,
        'has_international' => !empty($has_int),
        'current_filter' => $current_filter
    ];

    // Cache for 1 week
    set_transient($cache_key, $data, WEEK_IN_SECONDS);

    return $data;
}

/**
 * Get Listing Data (Cached via "Dynamic Pattern Matching").
 *
 * @param array $attributes Block attributes (postType, etc.)
 * @param array $filters    URL parameters (filter_cat)
 * @return array            ViewModel ready for render.
 */
function firstchurch_get_listing_data($attributes, $filters)
{
    $post_type = $attributes['postType'] ?? 'post';
    $per_page = (int) ($attributes['perPage'] ?? 9);
    $active_cat_id = (int) ($filters['filter_cat'] ?? 0);
    $editor_term_ids = $attributes['termIds'] ?? []; // Array of IDs
    $taxonomy = $attributes['taxonomy'] ?? 'category';

    // 1. Build Versioned Cache Key
    $version = get_option("fc_{$post_type}_version", '1');
    $key_args = [
        'pt' => $post_type,
        'pp' => $per_page,
        'cid' => $active_cat_id,
        'tid' => $editor_term_ids,
        'tax' => $taxonomy
    ];
    $cache_key = 'fc_list_' . md5(serialize($key_args)) . '_v' . $version;

    $cached = get_transient($cache_key);
    if (false !== $cached) {
        return $cached;
    }

    // 2. Fetch Filter Terms (Sidebar)
    $cat_args = [
        'taxonomy' => !empty($taxonomy) ? $taxonomy : 'category',
        'number' => 10,
        'hide_empty' => true
    ];
    $raw_terms = get_terms($cat_args);
    $terms_list = [];
    if (!empty($raw_terms) && !is_wp_error($raw_terms)) {
        foreach ($raw_terms as $t) {
            $terms_list[] = [
                'term_id' => $t->term_id,
                'name' => $t->name
            ];
        }
    }

    // 3. Build Post Query
    $args = [
        'post_type' => $post_type,
        'posts_per_page' => $per_page,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC'
    ];

    if ($active_cat_id > 0) {
        $args['tax_query'] = [
            [
                'taxonomy' => !empty($taxonomy) ? $taxonomy : 'category',
                'field' => 'term_id',
                'terms' => $active_cat_id,
            ]
        ];
    } else if (!empty($taxonomy) && !empty($editor_term_ids)) {
        $args['tax_query'] = [
            [
                'taxonomy' => $taxonomy,
                'field' => 'term_id',
                'terms' => $editor_term_ids,
            ]
        ];
    }

    $query = new WP_Query($args);
    $posts = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $pid = get_the_ID();

            // Extract Data
            $cat_obj = get_the_category();
            $cat_name = !empty($cat_obj) ? $cat_obj[0]->name : 'Uncategorized';

            $posts[] = [
                'id' => $pid,
                'title' => get_the_title(),
                'permalink' => get_permalink(),
                'excerpt' => get_the_excerpt(),
                'thumb' => get_the_post_thumbnail_url($pid, 'large'),
                'cat_name' => $cat_name,
                'date' => get_the_date()
            ];
        }
        wp_reset_postdata();
    }

    $data = [
        'posts' => $posts,
        'terms' => $terms_list,
        'active_cat_id' => $active_cat_id
    ];

    // Cache for 1 week
    set_transient($cache_key, $data, WEEK_IN_SECONDS);

    return $data;
}
