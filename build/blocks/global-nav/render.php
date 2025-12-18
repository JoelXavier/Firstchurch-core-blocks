<?php
/**
 * Render callback for the Global Navigation block.
 *
 * @param array $attributes Block attributes.
 */

// Generate a unique ID for this block instance
$block_id = 'fc-global-nav-' . uniqid();

// Logic for Global Mega Menu Sync
$use_global_menu = $attributes['useGlobalMenu'] ?? true;
if ($use_global_menu) {
    $global_menu_data = get_option('fc_mega_menu_data');
    if ($global_menu_data) {
        $attributes['menuData'] = $global_menu_data;
    }
}

// Encode attributes to pass to React
$attributes_json = wp_json_encode($attributes);

?>
<div id="<?php echo esc_attr($block_id); ?>" class="fc-global-nav-root"
    data-attributes="<?php echo esc_attr($attributes_json); ?>">
    <!-- Content will be hydrated by React -->
    <noscript>
        <nav>
            <!-- Basic fallback for SEO/No-JS (Optional: Expand with PHP loop if needed later) -->
            <ul>
                <?php foreach (($attributes['items'] ?? []) as $item): ?>
                    <li><a
                            href="<?php echo esc_url($item['url'] ?? '#'); ?>"><?php echo esc_html($item['label'] ?? ''); ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </nav>
    </noscript>
</div>