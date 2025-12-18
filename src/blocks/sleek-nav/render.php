<?php
/**
 * Render for Sleek Navigation Block
 */

$attributes = isset($attributes) ? $attributes : [];

$logo_url = isset($attributes['logoUrl']) ? $attributes['logoUrl'] : '';
$site_name = isset($attributes['siteName']) ? $attributes['siteName'] : 'First Church';
$hamburger_color = isset($attributes['hamburgerColor']) ? $attributes['hamburgerColor'] : 'currentColor';

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'fc-sleek-nav'
));

// Global Menu Logic
$use_global_menu = $attributes['useGlobalMenu'] ?? true;
$menu_data = $attributes['menuData'] ?? [];

if ($use_global_menu) {
    $global_menu_data = get_option('fc_mega_menu_data');
    if ($global_menu_data) {
        $menu_data = $global_menu_data;
    }
}

// Extract specific menu sections
$main_links = $menu_data['mainLinks'] ?? [];
$news_items = $menu_data['newsItems'] ?? [];
$quick_links = $menu_data['quickLinks'] ?? [];

?>
<header <?php echo $wrapper_attributes; ?>>
    <div class="fc-sleek-nav__container">
        <div class="fc-sleek-nav__brand">
            <?php if ($logo_url): ?>
                <div class="fc-sleek-nav__logo-preview">
                    <img src="<?php echo esc_url($logo_url); ?>" alt="<?php echo esc_attr($site_name); ?>" />
                </div>
            <?php endif; ?>
            <div class="fc-sleek-nav__text">
                <h1 class="fc-sleek-nav__site-name"><?php echo wp_kses_post($site_name); ?></h1>
            </div>
        </div>

        <div class="fc-sleek-nav__hamburger" style="color: <?php echo esc_attr($hamburger_color); ?>">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
    </div>

    <div class="fc-sleek-nav__overlay fc-full-page-menu"
        data-menu-data='<?php echo esc_attr(wp_json_encode($menu_data)); ?>'>
        <div class="fc-menu-logo">
            <?php if ($logo_url): ?>
                <img src="<?php echo esc_url($logo_url); ?>" alt="Logo" style="height: 80px; width: auto;" />
            <?php endif; ?>
        </div>

        <div class="fc-sleek-nav__close fc-menu-close-btn">&times;</div>

        <div class="fc-full-page-menu__container">
            <!-- Column 1: Main Navigation (The Church) -->
            <div class="fc-full-page-menu__col menu-col-main">
                <h4 class="fc-menu-heading">THE CHURCH</h4>
                <ul class="fc-full-nav-list">
                    <?php
                    foreach ($main_links as $link):
                        ?>
                        <li><a href="<?php echo esc_url($link['url']); ?>"><?php echo esc_html($link['label']); ?></a></li>
                    <?php endforeach; ?>
                </ul>

            </div>

            <!-- Column 2: News (From The Temple) -->
            <div class="fc-full-page-menu__col menu-col-news">
                <h4 class="fc-menu-heading">FROM THE TEMPLE</h4>
                <div class="fc-news-grid">
                    <?php
                    foreach ($news_items as $news):
                        ?>
                        <div class="fc-news-item">
                            <?php if (!empty($news['image'])): ?>
                                <div class="fc-news-image">
                                    <img src="<?php echo esc_url($news['image']); ?>" alt="" />
                                </div>
                            <?php endif; ?>
                            <span class="fc-news-cat"><?php echo esc_html($news['category']); ?></span>
                            <h5 class="fc-news-title"><?php echo esc_html($news['title']); ?></h5>
                            <a href="<?php echo esc_url($news['link']); ?>" class="fc-news-read-more">READ MORE</a>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Column 3: Quick Links -->
            <div class="fc-full-page-menu__col menu-col-quick text-right">
                <h4 class="fc-menu-heading">QUICK LINKS</h4>
                <ul class="fc-quick-nav-list">
                    <?php
                    foreach ($quick_links as $link):
                        ?>
                        <li><a href="<?php echo esc_url($link['url']); ?>"><?php echo esc_html($link['label']); ?></a></li>
                    <?php endforeach; ?>
                </ul>

                <!-- Social Icons -->
                <div class="fc-menu-socials">
                    <a href="#" aria-label="YouTube" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="X (Twitter)" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="Instagram" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="#" aria-label="Facebook" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</header>