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

    // 4. Format Output (Remove empty groups)
    foreach ($groups as $group) {
        if (!empty($group['templates'])) {
            $response[] = $group;
        }
    }

    return $response;
}
