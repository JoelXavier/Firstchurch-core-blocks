<?php
/**
 * Plugin Name: First Church Core Blocks
 * Description: A suite of dynamic, server-side rendered blocks with a Storybook-first development workflow.
 * Version: 1.0.0
 * Author: Antigravity
 * License: GPL-2.0-or-later
 * Text Domain: first-church-core-blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main Plugin Class: FirstChurchBlocks
 * Structured as a Singleton to ensure clean hook registration and asset management.
 */
final class FirstChurchBlocks
{
    private static $instance = null;

    /**
     * Singleton Instance Getter
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct()
    {
        $this->init_hooks();
    }

    /**
     * Centralized Hook Registration
     */
    private function init_hooks()
    {
        // Core Block Registration
        add_action('init', [$this, 'register_blocks'], 10);
        add_filter('block_categories_all', [$this, 'register_category'], 10, 2);

        // Custom Post Types, Taxonomies & Meta
        add_action('init', [$this, 'register_post_types'], 10);
        add_action('init', [$this, 'rename_post_object'], 999);

        // Assets (Global, Admin, Editor)
        add_action('wp_enqueue_scripts', [$this, 'enqueue_global_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_branding']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);

        // Admin Pages & Dashboard
        add_action('admin_menu', [$this, 'register_admin_pages']);
        add_action('admin_menu', [$this, 'rename_post_menu'], 999);
        add_action('admin_bar_menu', [$this, 'update_admin_bar_logo'], 999);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_dashboard_assets']);

        // Block Enhancements
        add_action('init', [$this, 'register_block_patterns'], 10);
        add_action('init', [$this, 'register_block_styles'], 10);
        add_action('init', [$this, 'register_settings'], 10);

        // Theme Configuration
        add_action('after_setup_theme', [$this, 'theme_setup']);
        add_filter('wp_theme_json_data_theme', [$this, 'configure_theme_json']);
        add_filter('should_load_remote_block_patterns', '__return_false');

        // Templates
        add_filter('theme_post_templates', [$this, 'register_templates']);
        add_filter('theme_page_templates', [$this, 'register_templates']);
        add_filter('template_include', [$this, 'load_template']);

        // Auth & Navigation Redirects
        add_filter('login_redirect', [$this, 'handle_login_redirect'], 10, 3);
        add_action('admin_init', [$this, 'handle_dashboard_redirect']);

        // Load Dashboard API logic
        if (file_exists(plugin_dir_path(__FILE__) . 'src/dashboard/api.php')) {
            require_once plugin_dir_path(__FILE__) . 'src/dashboard/api.php';
        }
    }

    /**
     * Register all custom blocks from the build directory.
     */
    public function register_blocks()
    {
        $blocks = [
            'global-nav',
            'sleek-nav',
            'hero',
            'section-header',
            'marquee',
            'location',
            'quote',
            'card-grid',
            'card-item',
            'fundraiser',
            'fundraiser-grid',
            'fundraiser-card',
            'donation-payment',
            'quick-link-item',
            'quick-links',
            'hero-split',
            'listing',
            'event-list',
            'event-item',
            'article-hero',
            'article-body',
            'footer',
            'footer-column',
            'section',
            'breadcrumbs',
            'event-feed',
            'location-feed',
            'magazine-grid',
            'magazine-item',
            'baptism-stats'
        ];

        foreach ($blocks as $block) {
            $block_dir = __DIR__ . '/build/blocks/' . $block;
            if (file_exists($block_dir . '/block.json')) {
                register_block_type($block_dir);
            }
        }
    }

    /**
     * Register the "First Church" Block Category.
     */
    public function register_category($categories, $post)
    {
        return array_merge(
            $categories,
            [
                [
                    'slug' => 'firstchurch',
                    'title' => __('First Church', 'first-church-core-blocks'),
                ]
            ]
        );
    }

    /**
     * Enqueue global styles for the frontend.
     */
    public function enqueue_global_assets()
    {
        wp_enqueue_style(
            'first-church-tokens',
            plugins_url('src/tokens.css', __FILE__),
            [],
            filemtime(plugin_dir_path(__FILE__) . 'src/tokens.css')
        );

        wp_enqueue_style(
            'first-church-global',
            plugins_url('src/assets/global.css', __FILE__),
            ['first-church-tokens'],
            '1.0.0'
        );
    }

    /**
     * Enqueue assets specifically for the Block Editor.
     */
    public function enqueue_editor_assets()
    {
        // Design Tokens are essential for editor preview
        wp_enqueue_style(
            'first-church-tokens-editor',
            plugins_url('src/tokens.css', __FILE__),
            [],
            filemtime(plugin_dir_path(__FILE__) . 'src/tokens.css')
        );

        // Extensions (Modifications to core blocks)
        $extensions = ['separator', 'event-settings', 'location-settings', 'core-mods'];
        foreach ($extensions as $ext) {
            $path = "build/extensions/{$ext}.js";
            if (file_exists(plugin_dir_path(__FILE__) . $path)) {
                wp_enqueue_script(
                    "first-church-ext-{$ext}",
                    plugins_url($path, __FILE__),
                    ['wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-i18n'],
                    filemtime(plugin_dir_path(__FILE__) . $path),
                    true
                );
            }
        }

        // Extension CSS
        if (file_exists(plugin_dir_path(__FILE__) . 'build/extensions/style-separator.css')) {
            wp_enqueue_style(
                'first-church-ext-separator-css',
                plugins_url('build/extensions/style-separator.css', __FILE__),
                [],
                filemtime(plugin_dir_path(__FILE__) . 'build/extensions/style-separator.css')
            );
        }
    }

    /**
     * Enqueue Admin Branding Assets.
     */
    public function enqueue_admin_assets()
    {
        wp_enqueue_style(
            'first-church-admin-base',
            plugins_url('src/assets/admin.css', __FILE__),
            [],
            '1.0.0'
        );
    }

    public function enqueue_admin_branding()
    {
        wp_enqueue_style(
            'first-church-admin-theme',
            plugins_url('src/admin.css', __FILE__),
            [],
            '1.0.1'
        );
    }

    /**
     * Register Custom Post Types and their taxonomies.
     */
    public function register_post_types()
    {
        // Events
        register_post_type('event', [
            'labels' => [
                'name' => 'Events',
                'singular_name' => 'Event',
                'add_new_item' => 'Add New Event',
                'edit_item' => 'Edit Event',
            ],
            'public' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'menu_icon' => 'dashicons-calendar-alt',
            'has_archive' => true,
            'rewrite' => ['slug' => 'events'],
        ]);

        register_taxonomy('event_category', 'event', [
            'labels' => ['name' => 'Event Categories', 'singular_name' => 'Event Category'],
            'hierarchical' => true,
            'show_in_rest' => true,
            'public' => true,
            'rewrite' => ['slug' => 'event-category'],
        ]);

        // Locations
        register_post_type('location', [
            'labels' => ['name' => 'Locations', 'singular_name' => 'Location'],
            'public' => true,
            'show_in_rest' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'menu_icon' => 'dashicons-location',
            'has_archive' => true,
            'rewrite' => ['slug' => 'locations'],
        ]);

        register_taxonomy('location_category', 'location', [
            'labels' => ['name' => 'Location Categories', 'singular_name' => 'Location Category'],
            'hierarchical' => true,
            'show_in_rest' => true,
            'public' => true,
        ]);

        // Baptismal Reports (Hidden from Admin Menu, Managed via Dashboard)
        register_post_type('fc_baptism_report', [
            'labels' => ['name' => 'Baptism Reports', 'singular_name' => 'Baptism Report'],
            'public' => false, // Internal use only
            'show_in_rest' => true,
            'supports' => ['title', 'custom-fields'], // Title will be Label (e.g. Week 1)
            'show_ui' => false, // Managed via Mission Control
        ]);

        // Meta Registration for REST API
        $this->register_meta_fields();
    }

    /**
     * Register Meta Fields for CPTs to expose to REST/Editor.
     */
    private function register_meta_fields()
    {
        $meta_keys = [
            'event' => [
                '_event_start_date' => 'string',
                '_event_end_date' => 'string',
                '_event_label' => 'string',
                '_event_location' => 'string',
                '_event_cta_url' => 'string',
                '_event_is_canceled' => 'boolean',
            ],
            'location' => [
                '_location_status' => 'string',
                '_location_region' => 'string',
                '_location_address' => 'string',
                '_location_phone' => 'string',
            ],
            'fc_baptism_report' => [
                '_fc_baptism_count' => 'integer',
                '_fc_report_label' => 'string',
                '_fc_report_month' => 'string' // YYYY-MM
            ]
        ];

        foreach ($meta_keys as $post_type => $keys) {
            foreach ($keys as $key => $type) {
                register_post_meta($post_type, $key, [
                    'show_in_rest' => true,
                    'single' => true,
                    'type' => $type,
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    }
                ]);
            }
        }

        // Special handling for iframe (Map Embed)
        register_post_meta('location', '_location_map_embed', [
            'show_in_rest' => true,
            'single' => true,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
            'sanitize_callback' => function ($value) {
                return wp_kses($value, [
                    'iframe' => [
                        'src' => true,
                        'width' => true,
                        'height' => true,
                        'frameborder' => true,
                        'style' => true,
                        'allowfullscreen' => true,
                        'loading' => true
                    ]
                ]);
            }
        ]);
    }

    /**
     * Register Admin Sidebar Pages.
     */
    public function register_admin_pages()
    {
        add_menu_page(
            __('Mission Control', 'first-church-core-blocks'),
            __('Mission Control', 'first-church-core-blocks'),
            'edit_posts',
            'firstchurch-dashboard',
            [$this, 'render_admin_dashboard'],
            'dashicons-chart-pie',
            3
        );
    }

    /**
     * Render the Mission Control Dashboard wrapper.
     */
    public function render_admin_dashboard()
    {
        echo '<div id="fc-dashboard-root"></div>';
    }

    /**
     * Enqueue Dashboard-specific React assets.
     */
    public function enqueue_dashboard_assets($hook)
    {
        if (strpos($hook, 'firstchurch-dashboard') === false) {
            return;
        }

        $asset_path = plugin_dir_path(__FILE__) . 'build/dashboard.asset.php';
        if (file_exists($asset_path)) {
            $asset_file = include($asset_path);

            wp_enqueue_media(); // Required for 'Edit Banner' functionality

            wp_enqueue_script(
                'first-church-dashboard-script',
                plugins_url('build/dashboard.js', __FILE__),
                $asset_file['dependencies'],
                $asset_file['version'],
                true
            );

            // Ensure tokens are available for dashboard
            wp_enqueue_style(
                'first-church-tokens',
                plugins_url('src/tokens.css', __FILE__),
                [],
                filemtime(plugin_dir_path(__FILE__) . 'src/tokens.css')
            );

            wp_enqueue_style(
                'first-church-dashboard-style',
                plugins_url('build/style-dashboard.css', __FILE__),
                ['wp-components', 'first-church-tokens'],
                $asset_file['version']
            );
        }
    }

    /**
     * Register Block Patterns.
     */
    public function register_block_patterns()
    {
        $categories = [
            'firstchurch' => __('First Church', 'first-church-core-blocks'),
            'firstchurch/articles' => __('First Church: Articles', 'first-church-core-blocks'),
            'firstchurch/microsites' => __('First Church: Microsites', 'first-church-core-blocks'),
            'firstchurch/events' => __('First Church: Events', 'first-church-core-blocks'),
            'firstchurch/locations' => __('First Church: Locations', 'first-church-core-blocks'),
        ];

        foreach ($categories as $slug => $label) {
            register_block_pattern_category($slug, ['label' => $label]);
        }

        $patterns = ['article-a', 'article-b', 'article-c', 'mission-statement', 'team-profile'];
        foreach ($patterns as $slug) {
            $path = __DIR__ . "/src/patterns/{$slug}.php";
            if (file_exists($path)) {
                $data = require $path;
                register_block_pattern(
                    $data['slug'] ?? "firstchurch/{$slug}",
                    $data
                );
            }
        }
    }

    /**
     * Register Custom Block Styles.
     */
    public function register_block_styles()
    {
        $styles = [
            'core/group' => [
                ['name' => 'magazine-featured', 'label' => __('Magazine Featured', 'first-church-core-blocks')],
                ['name' => 'magazine-cardless', 'label' => __('Magazine Cardless', 'first-church-core-blocks')],
            ],
            'firstchurch/magazine-item' => [
                ['name' => 'magazine-list', 'label' => __('Magazine List View', 'first-church-core-blocks')],
            ]
        ];

        foreach ($styles as $block => $configs) {
            foreach ($configs as $config) {
                register_block_style($block, $config);
            }
        }
    }

    /**
     * Register Site Settings via REST API.
     */
    public function register_settings()
    {
        $settings = ['fc_mega_menu_data', 'fc_footer_data'];
        foreach ($settings as $opt) {
            register_setting('firstchurch_settings', $opt, [
                'type' => 'object',
                'show_in_rest' => ['schema' => ['type' => 'object']],
            ]);
        }
    }

    /**
     * Rename default "Posts" to "Articles".
     */
    public function rename_post_object()
    {
        global $wp_post_types;
        if (!isset($wp_post_types['post']))
            return;

        $labels = &$wp_post_types['post']->labels;
        $labels->name = 'Articles';
        $labels->singular_name = 'Article';
        $labels->menu_name = 'Articles';
        $labels->name_admin_bar = 'Article';
    }

    public function rename_post_menu()
    {
        global $menu, $submenu;
        if (isset($menu[5])) {
            $menu[5][0] = 'Articles';
            if (isset($submenu['edit.php'][5]))
                $submenu['edit.php'][5][0] = 'Articles';
        }
    }

    /**
     * Update Admin Bar Branding with Church Logo.
     */
    public function update_admin_bar_logo($wp_admin_bar)
    {
        $wp_admin_bar->remove_node('wp-logo');
        $logo = plugins_url('src/assets/church-logo.png', __FILE__);

        $wp_admin_bar->add_node([
            'id' => 'firstchurch-logo',
            'title' => '<img src="' . esc_url($logo) . '" alt="First Church" style="height:24px; vertical-align:middle;">',
            'href' => admin_url('admin.php?page=firstchurch-dashboard'),
        ]);
    }

    /**
     * Handle Blank Canvas Templates.
     */
    public function register_templates($templates)
    {
        $templates['firstchurch_blank_canvas'] = __('First Church: Blank Canvas', 'first-church-core-blocks');
        return $templates;
    }

    public function load_template($template)
    {
        $id = get_the_ID();
        if ($id && get_post_meta($id, '_wp_page_template', true) === 'firstchurch_blank_canvas') {
            $file = plugin_dir_path(__FILE__) . 'templates/blank-canvas.php';
            if (file_exists($file))
                return $file;
        }
        return $template;
    }

    /**
     * Theme Setup logic (Disable default patterns).
     */
    public function theme_setup()
    {
        remove_theme_support('core-block-patterns');

        // Restore Theme Colors (Classic/Hybrid Support)
        add_theme_support('editor-color-palette', [
            ['name' => 'Cardinal', 'slug' => 'cardinal', 'color' => '#8A1C26'],
            ['name' => 'Burgundy', 'slug' => 'burgundy', 'color' => '#560D1A'],
            ['name' => 'Divine Gold', 'slug' => 'divine-gold', 'color' => '#B08D55'],
            ['name' => 'Sandwood', 'slug' => 'sandwood', 'color' => '#F3F0E6'],
            ['name' => 'Ink Black', 'slug' => 'ink-black', 'color' => '#1A1A1A'],
            ['name' => 'Navy Grey', 'slug' => 'navy-grey', 'color' => '#344152'],
            ['name' => 'Cloud Blue', 'slug' => 'cloud-blue', 'color' => '#E3F4F6'],
            ['name' => 'Platinum', 'slug' => 'platinum', 'color' => '#f4f5f6'],
        ]);

    }

    /**
     * Configure Theme JSON settings (Color Palette).
     */
    public function configure_theme_json($theme_json)
    {
        $palette = [
            'settings' => [
                'color' => [
                    'palette' => [
                        ['name' => 'Cardinal', 'slug' => 'cardinal', 'color' => '#8A1C26'],
                        ['name' => 'Burgundy', 'slug' => 'burgundy', 'color' => '#560D1A'],
                        ['name' => 'Divine Gold', 'slug' => 'divine-gold', 'color' => '#B08D55'],
                        ['name' => 'Sandwood', 'slug' => 'sandwood', 'color' => '#F3F0E6'],
                        ['name' => 'Ink Black', 'slug' => 'ink-black', 'color' => '#1A1A1A'],
                    ]
                ],
                'spacing' => ['appearanceTools' => true]
            ]
        ];
        return $theme_json->update_with($palette);
    }

    /**
     * Login Redirect to Mission Control.
     */
    public function handle_login_redirect($url, $request, $user)
    {
        if (isset($user->roles) && is_array($user->roles)) {
            return admin_url('admin.php?page=firstchurch-dashboard');
        }
        return $url;
    }

    /**
     * Dashboard Redirect to Mission Control.
     */
    public function handle_dashboard_redirect()
    {
        $screen = get_current_screen();
        if ($screen && $screen->base === 'dashboard') {
            wp_redirect(admin_url('admin.php?page=firstchurch-dashboard'));
            exit;
        }
    }
}

/**
 * Bootstrap the Plugin
 */
FirstChurchBlocks::get_instance();
