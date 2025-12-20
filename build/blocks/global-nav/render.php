<?php
/**
 * Render callback for the Global Navigation block.
 *
 * @param array $attributes Block attributes.
 */

// Generate a unique ID for this block instance (safer than uniqid)
$block_id = 'fc-global-nav-' . wp_rand();

// Logic for Global Mega Menu Sync
$use_global_menu = (bool) ($attributes['useGlobalMenu'] ?? true);
if ($use_global_menu) {
    $global_menu_data = get_option('fc_mega_menu_data');
    if ($global_menu_data) {
        $attributes['menuData'] = $global_menu_data;
    }
}

// Encode attributes to pass to React
$attributes_json = wp_json_encode($attributes);

$wrapper_attributes = get_block_wrapper_attributes([
    'id' => $block_id,
    'class' => 'fc-global-nav-root',
    'data-attributes' => $attributes_json
]);

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
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