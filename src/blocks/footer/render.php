<?php
/**
 * Footer Block Template.
 *
 * @param   array $attributes - A keyed array of attributes specified in the block.json.
 * @param   string $content - The InnerBlocks content.
 * @param   WP_Block $block - The block instance.
 */

$logo_url = isset($attributes['logoUrl']) ? $attributes['logoUrl'] : ''; // OR fallback from plugin asset if we passed it (complex)
// Note: In PHP we might not have easy access to the asset in 'src/assets', so we rely on user upload or fallback logic if needed.
// For now, if no logo is uploaded, we might want to hide it or show a placeholder text.

$logo_text_primary = isset($attributes['logoTextPrimary']) ? $attributes['logoTextPrimary'] : 'First Church';
$logo_text_secondary = isset($attributes['logoTextSecondary']) ? $attributes['logoTextSecondary'] : '';
$mission_text = isset($attributes['missionText']) ? $attributes['missionText'] : '';
$copyright_text = isset($attributes['copyrightText']) ? $attributes['copyrightText'] : '';
$social_links = isset($attributes['socialLinks']) ? $attributes['socialLinks'] : [];

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'fc-footer']);
?>

<footer <?php echo $wrapper_attributes; ?>>
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
            <?php echo $content; ?>
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
                            // Simple switch for icons
                            $icon = $link['icon'];
                            if ($icon === 'youtube')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
                            elseif ($icon === 'twitter')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
                            elseif ($icon === 'instagram')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>';
                            elseif ($icon === 'facebook')
                                echo '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>';
                            ?>
                        </a>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</footer>