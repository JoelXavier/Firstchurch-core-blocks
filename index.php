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
}
add_action('init', 'antigravity_core_blocks_init');

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
/* DISABLED: Handing control to WP Font Library (User Request)
add_filter('wp_theme_json_data_theme', function ($theme_json) {
    $new_data = [
        'version' => 2,
        'settings' => [
            'typography' => [
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
        ],
    ];

    return $theme_json->update_with($new_data);
});
*/

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
