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
}
add_action('rest_api_init', 'firstchurch_register_dashboard_api');

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
        'footerData' => get_option('fc_footer_data')
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

        $response[] = [
            'id' => $p->ID,
            'title' => $p->post_title,
            'status' => $p->post_status,
            'meta' => $flat_meta
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

    if (!$post_id || !get_post($post_id)) {
        return new WP_Error('invalid_post', 'Post not found', ['status' => 404]);
    }

    foreach ($meta as $key => $value) {
        // Only allow certain keys for security
        if (strpos($key, '_event_') === 0 || strpos($key, '_location_') === 0) {
            update_post_meta($post_id, $key, $value);
        }
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
        update_post_meta($post_id, '_event_start_date', date('Y-m-d\TH:i:s'));
        update_post_meta($post_id, '_event_label', 'Event');
    }

    return [
        'id' => $post_id,
        'title' => $title,
        'status' => 'draft',
        'meta' => [
            '_event_start_date' => date('Y-m-d\TH:i:s'),
            '_event_label' => 'Event'
        ]
    ];
}
