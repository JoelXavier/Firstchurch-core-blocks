<?php
/**
 * Footer Block Template.
 *
 * @param   array $attributes - A keyed array of attributes specified in the block.json.
 * @param   string $content - The InnerBlocks content.
 * @param   WP_Block $block - The block instance.
 */

// Defensive attribute extraction
$logo_url = $attributes['logoUrl'] ?? '';
$logo_text_primary = $attributes['logoTextPrimary'] ?? 'First Church';
$logo_text_secondary = $attributes['logoTextSecondary'] ?? '';
$mission_text = $attributes['missionText'] ?? '';
$copyright_text = $attributes['copyrightText'] ?? '';
$social_links = $attributes['socialLinks'] ?? [];
$use_global_sync = (bool) ($attributes['useGlobalSync'] ?? true);

$global_footer_data = ($use_global_sync) ? get_option('fc_footer_data') : null;

if ($global_footer_data) {
    if (!empty($global_footer_data['logoUrl']))
        $logo_url = $global_footer_data['logoUrl'];
    if (!empty($global_footer_data['logoTextPrimary']))
        $logo_text_primary = $global_footer_data['logoTextPrimary'];
    if (isset($global_footer_data['logoTextSecondary']))
        $logo_text_secondary = $global_footer_data['logoTextSecondary'];
    if (isset($global_footer_data['missionText']))
        $mission_text = $global_footer_data['missionText'];
    if (isset($global_footer_data['copyrightText']))
        $copyright_text = $global_footer_data['copyrightText'];
    if (!empty($global_footer_data['socialLinks']))
        $social_links = $global_footer_data['socialLinks'];
}

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'fc-footer']);
?>

<footer <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="fc-footer__content">

        <!-- Brand Column (Left) -->
        <div class="fc-footer__brand-col">
            <div class="fc-footer__logo">
                <?php if ($logo_url): ?>
                    <img src="<?php echo esc_url($logo_url); ?>" alt="Church Logo" />
                <?php endif; ?>
                <div class="fc-footer__logo-text">
                    <span class="primary"><?php echo esc_html($logo_text_primary); ?></span>
                    <span class="secondary"><?php echo esc_html($logo_text_secondary); ?></span>
                </div>
            </div>
            <?php if ($mission_text): ?>
                <p class="fc-footer__mission"><?php echo esc_html($mission_text); ?></p>
            <?php endif; ?>
        </div>

        <!-- Navigation Grid (Right) -->
        <!-- InnerBlocks Content (Columns) goes here -->
        <div class="fc-footer__nav-grid">
            <?php if ($global_footer_data && !empty($global_footer_data['columns'])): ?>
                <?php foreach ($global_footer_data['columns'] as $column): ?>
                    <div class="fc-footer__nav-col">
                        <h4 class="fc-footer__heading"><?php echo esc_html($column['title']); ?></h4>
                        <ul class="wp-block-list">
                            <?php foreach ($column['links'] as $link): ?>
                                <li><a href="<?php echo esc_url($link['url']); ?>"><?php echo esc_html($link['label']); ?></a></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <?php echo $content; ?>
            <?php endif; ?>
        </div>

    </div>

    <!-- Bottom Bar -->
    <div class="fc-footer__bottom">
        <div class="fc-footer__bottom-inner">
            <div class="fc-footer__copyright"><?php echo esc_html($copyright_text); ?></div>

            <div class="fc-footer__socials">
                <?php foreach ($social_links as $link): ?>
                    <?php if (!empty($link['url']) && $link['url'] !== '#'): ?>
                        <a href="<?php echo esc_url($link['url']); ?>" aria-label="<?php echo esc_attr($link['label']); ?>"
                            class="fc-footer__social-icon">
                            <?php
                            // Derive icon from label if not explicitly set
                            $icon_key = isset($link['icon']) ? $link['icon'] : strtolower($link['label']);

                            // Normalize common names
                            if (strpos($icon_key, 'facebook') !== false)
                                $icon_key = 'facebook';
                            elseif (strpos($icon_key, 'instagram') !== false)
                                $icon_key = 'instagram';
                            elseif (strpos($icon_key, 'youtube') !== false)
                                $icon_key = 'youtube';
                            elseif (strpos($icon_key, 'twitter') !== false || strpos($icon_key, 'x') !== false)
                                $icon_key = 'twitter';

                            if ($icon_key === 'youtube')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
                            elseif ($icon_key === 'twitter')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
                            elseif ($icon_key === 'instagram')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
                            elseif ($icon_key === 'facebook')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>';
                            ?>
                        </a>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</footer>