<?php
/**
 * Plugin Name: Antigravity Core Blocks
 * Description: A suite of dynamic, server-side rendered blocks with a Storybook-first development workflow.
 * Version: 0.1.0
 * Author: Antigravity
 * License: GPL-2.0-or-later
 * Text Domain: antigravity-core
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Registers all blocks in the plugin.
 */
function antigravity_core_blocks_init()
{
    // Register the Global Navigation block
    register_block_type(__DIR__ . '/build/blocks/global-nav');

    // Register the Hero block
    register_block_type(__DIR__ . '/build/blocks/hero');

    // Register the Location block
    register_block_type(__DIR__ . '/build/blocks/location');

    // Register the Quote block
    register_block_type(__DIR__ . '/build/blocks/quote');

    // Register the Card Grid block (Parent)
    register_block_type(__DIR__ . '/build/blocks/card-grid');

    // Register the Card Item block (Child)
    register_block_type(__DIR__ . '/build/blocks/card-item');

    // Register the Fundraiser block
    register_block_type(__DIR__ . '/build/blocks/fundraiser');

    // Register Quick Links (Parent) and Item (Child)
    register_block_type(__DIR__ . '/build/blocks/quick-link-item');
    register_block_type(__DIR__ . '/build/blocks/quick-links');

    // Register Hero Split
    register_block_type(__DIR__ . '/build/blocks/hero-split');

    // Register Content Listing / Feed
    register_block_type(__DIR__ . '/build/blocks/listing');

    // Register Manual Event List & Item
    register_block_type(__DIR__ . '/build/blocks/event-list');
    register_block_type(__DIR__ . '/build/blocks/event-item');

    // Register Article Blocks
    register_block_type(__DIR__ . '/build/blocks/article-hero');
    register_block_type(__DIR__ . '/build/blocks/article-body');

    // Register Footer Blocks
    register_block_type(__DIR__ . '/build/blocks/footer');
    register_block_type(__DIR__ . '/build/blocks/footer-column');

    // Register Section Block
    register_block_type(__DIR__ . '/build/blocks/section');

    // Register Breadcrumbs
    register_block_type(__DIR__ . '/build/blocks/breadcrumbs');

    // Register Event Feed (Auto)
    register_block_type(__DIR__ . '/build/blocks/event-feed');
}
add_action('init', 'antigravity_core_blocks_init');

/**
 * Register Custom Block Category "FC"
 */
function antigravity_core_blocks_category($categories, $post)
{
    return array_merge(
        $categories,
        [
            [
                'slug' => 'antigravity',
                'title' => 'FC',
            ],
        ]
    );
}
add_filter('block_categories_all', 'antigravity_core_blocks_category', 10, 2);

/**
 * Enqueue Global Assets (Fonts)
 */
function antigravity_core_blocks_assets()
{
    // Load Google Fonts globally for all blocks
    // DISABLED: We now rely on the native WordPress Font Library (Site Editor) to handle this.
    // This prevents conflicts where our hardcoded fonts override the user's Editor choices.
    /*
    wp_enqueue_style(
        'antigravity-google-fonts',
        'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Tangerine:wght@400;700&family=Inter:wght@400;500;600&display=swap',
        [],
        null
    );
    */

    // Enqueue Design Tokens globally (Crucial for Editor variable support)
    // We use plugins_url to point to the source file for now, ensuring :root isn't wrapped
    wp_enqueue_style(
        'antigravity-design-tokens',
        plugins_url('src/tokens.css', __FILE__),
        [],
        '1.0.0'
    );

    // Enqueue Global Extensions (Block Styles)
    // JS for Editor
    wp_enqueue_script(
        'antigravity-separator-style',
        plugins_url('build/extensions/separator/index.js', __FILE__),
        ['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
        filemtime(plugin_dir_path(__FILE__) . 'build/extensions/separator/index.js'),
        true
    );

    // Event Settings Extension
    wp_enqueue_script(
        'antigravity-event-settings',
        plugins_url('build/extensions/event-settings/index.js', __FILE__),
        ['wp-plugins', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-core-data', 'wp-i18n'],
        filemtime(plugin_dir_path(__FILE__) . 'build/extensions/event-settings/index.js'),
        true
    );

    // CSS for Frontend & Editor
    wp_enqueue_style(
        'antigravity-separator-style-css',
        plugins_url('build/extensions/separator/style-index.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'build/extensions/separator/style-index.css')
    );
}
add_action('wp_enqueue_scripts', 'antigravity_core_blocks_assets');
add_action('enqueue_block_editor_assets', 'antigravity_core_blocks_assets'); // Ensure fonts load in editor too

/**
 * Register custom font families in the Block Editor.
 *
 * @param array $settings Default editor settings.
 * @return array Filtered settings.
 */
/**
 * Register custom font families via Theme JSON API.
 * This ensures they appear in the editor controls cleanly.
 */
/**
 * Register custom font families via Theme JSON API.
 * This ensures they appear in the editor controls cleanly.
 */
add_filter('wp_theme_json_data_theme', function ($theme_json) {
    $new_data = [
        'version' => 2,
        'settings' => [
            'typography' => [
                'lineHeight' => true, // Explicitly enable Line Height control
                'fontFamilies' => [
                    [
                        'name' => 'Merriweather',
                        'slug' => 'merriweather',
                        'fontFamily' => '"Merriweather", serif',
                    ],
                    [
                        'name' => 'Playfair Display',
                        'slug' => 'playfair-display',
                        'fontFamily' => '"Playfair Display", serif',
                    ],
                    [
                        'name' => 'Inter',
                        'slug' => 'inter',
                        'fontFamily' => '"Inter", sans-serif',
                    ],
                    [
                        'name' => 'Tangerine',
                        'slug' => 'tangerine',
                        'fontFamily' => '"Tangerine", cursive',
                    ],
                ],
                'fontSizes' => [
                    [
                        'name' => 'Small',
                        'slug' => 'small',
                        'size' => 'var(--wp--preset--font-size--caption)'
                    ],
                    [
                        'name' => 'Medium',
                        'slug' => 'medium',
                        'size' => 'var(--wp--preset--font-size--body)'
                    ],
                    [
                        'name' => 'Large',
                        'slug' => 'large',
                        'size' => 'var(--wp--preset--font-size--h4)'
                    ],
                    [
                        'name' => 'Extra Large',
                        'slug' => 'x-large',
                        'size' => 'var(--wp--preset--font-size--h3)'
                    ],
                    [
                        'name' => 'Hero',
                        'slug' => 'hero',
                        'size' => 'var(--wp--preset--font-size--h1)'
                    ]
                ]
            ],
            // Enable all appearance tools (spacing, etc.) to ensure comprehensive control
            'appearanceTools' => true,
        ],
    ];

    return $theme_json->update_with($new_data);
});

/**
 * Curator Mode: Disable Default Patterns
 * 
 * 1. Remove core patterns provided by WordPress natively.
 * 2. Disable the official patterns that load remotely from wordpress.org.
 */
add_action('after_setup_theme', function () {
    remove_theme_support('core-block-patterns');
});

add_filter('should_load_remote_block_patterns', '__return_false');

/**
 * Cleanup Default Theme Elements
 * Hides standard headers, footers, and widget areas that "Blank" themes might still output.
 */
add_action('wp_head', function () {
    ?>
    <style>
        /* Hide Default Theme Header/Footer and common "fallback" blocks */
        header#masthead,
        footer#colophon,
        #header,
        #footer,
        #sidebar,
        #comments,
        .comments-area,
        .post-navigation,
        .site-header,
        .site-footer,
        .site-info,
        .entry-header,
        .entry-footer,
        .widget-area,
        .wp-block-site-title,
        .wp-block-site-tagline,
        .wp-block-search,
        .wp-block-page-list,
        .page-title,
        .post-edit-link,
        header.header,
        h1.entry-title {
            display: none !important;
        }

        /* Ensure our blocks take full width if theme constrains them */
        .site-content,
        .entry-content {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
        }
    </style>
    <?php
});

/**
 * Register Custom Post Types (Events, Locations)
 */
function antigravity_register_cpts()
{
    // Events
    register_post_type('event', array(
        'labels' => array(
            'name' => 'Events',
            'singular_name' => 'Event',
            'add_new_item' => 'Add New Event',
            'edit_item' => 'Edit Event',
        ),
        'public' => true,
        'show_in_rest' => true, // Essential for Block Editor
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'menu_icon' => 'dashicons-calendar-alt',
        'has_archive' => true,
        'rewrite' => array('slug' => 'events'),
    ));

    // Locations
    register_post_type('location', array(
        'labels' => array(
            'name' => 'Locations',
            'singular_name' => 'Location',
            'add_new' => 'Add New',
            'add_new_item' => 'Add New Location',
            'edit_item' => 'Edit Location',
            'new_item' => 'New Location',
            'view_item' => 'View Location',
            'view_items' => 'View Locations',
            'search_items' => 'Search Locations',
            'not_found' => 'No locations found',
            'not_found_in_trash' => 'No locations found in Trash',
            'all_items' => 'All Locations',
            'archives' => 'Location Archives',
            'attributes' => 'Location Attributes',
            'insert_into_item' => 'Insert into location',
            'uploaded_to_this_item' => 'Uploaded to this location',
        ),
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'menu_icon' => 'dashicons-location',
        'has_archive' => true,
        'rewrite' => array('slug' => 'locations'),
    ));

    // Register Event Meta (Start Date) for Querying
    register_post_meta('event', '_event_start_date', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string', // Stored as YYYY-MM-DD HH:MM:SS
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_post_meta('event', '_event_end_date', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    register_post_meta('event', '_event_schedule', array(
        'show_in_rest' => array(
            'schema' => array(
                'type' => 'array',
                'items' => array(
                    'type' => 'object',
                    'properties' => array(
                        'time' => array('type' => 'string'),
                        'activity' => array('type' => 'string'),
                    ),
                ),
            ),
        ),
        'single' => true,
        'type' => 'array',
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    // Remaining Event Meta
    $meta_keys = [
        '_event_label' => 'string',
        '_event_location' => 'string',
        '_event_cta_text' => 'string',
        '_event_cta_url' => 'string',
        '_event_is_canceled' => 'boolean',
    ];

    foreach ($meta_keys as $key => $type) {
        register_post_meta('event', $key, array(
            'show_in_rest' => true,
            'single' => true,
            'type' => $type,
            'auth_callback' => function () {
                return current_user_can('edit_posts'); }
        ));
    }
}
add_action('init', 'antigravity_register_cpts');

/**
 * Rename "Posts" to "Articles" in Admin Menu
 */
function antigravity_rename_post_menu()
{
    global $menu, $submenu;

    $menu[5][0] = 'Articles';
    $submenu['edit.php'][5][0] = 'Articles';
    $submenu['edit.php'][10][0] = 'Add New Article';
}
add_action('admin_menu', 'antigravity_rename_post_menu', 999);

/**
 * Rename "Posts" to "Articles" in Post Type Labels
 */
function antigravity_rename_post_object()
{
    global $wp_post_types;

    if (empty($wp_post_types['post'])) {
        return;
    }

    $labels = &$wp_post_types['post']->labels;
    $labels->name = 'Articles';
    $labels->singular_name = 'Article';
    $labels->add_new = 'Add New Article';
    $labels->add_new_item = 'Add New Article';
    $labels->edit_item = 'Edit Article';
    $labels->new_item = 'New Article';
    $labels->view_item = 'View Article';
    $labels->search_items = 'Search Articles';
    $labels->not_found = 'No articles found';
    $labels->not_found_in_trash = 'No articles found in Trash';
    $labels->all_items = 'All Articles';
    $labels->menu_name = 'Articles';
    $labels->name_admin_bar = 'Article';
}
add_action('init', 'antigravity_rename_post_object', 999);

/**
 * Admin Dashboard Branding
 * Styles the WordPress Admin (Sidebar, Top Bar) to match the Antigravity Brand.
 */
function antigravity_enqueue_admin_branding()
{
    wp_enqueue_style(
        'antigravity-admin-theme',
        plugins_url('src/admin.css', __FILE__),
        [],
        '1.0.0'
    );
}
add_action('admin_enqueue_scripts', 'antigravity_enqueue_admin_branding');

/**
 * Register "Blank Canvas" Template for Posts (Articles) & Pages
 * Since this is a plugin, we must manually inject the template into the dropdown.
 */
function antigravity_register_templates($templates)
{
    $templates['antigravity_blank_canvas'] = 'First Church: Blank Canvas';
    return $templates;
}
add_filter('theme_post_templates', 'antigravity_register_templates');
add_filter('theme_page_templates', 'antigravity_register_templates');

/**
 * Load the "Blank Canvas" Template file
 */
function antigravity_load_template($template)
{
    $post_id = get_the_ID();
    if (!$post_id) {
        return $template;
    }

    $slug = get_post_meta($post_id, '_wp_page_template', true);

    if ($slug === 'antigravity_blank_canvas') {
        $file = plugin_dir_path(__FILE__) . 'templates/blank-canvas.php';
        if (file_exists($file)) {
            return $file;
        }
    }

    return $template;
}
add_filter('template_include', 'antigravity_load_template');
