<?php
/**
 * Render callback for local-nav block
 */

$title = $attributes['title'] ?? '';
$links = $attributes['links'] ?? [];
$hide_title_desktop = $attributes['hideTitleDesktop'] ?? false;

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'fc-local-nav']);
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="fc-local-nav__header">
        <?php if ($title): ?>
            <h4 class="fc-local-nav__title <?php echo $hide_title_desktop ? 'fc-hide-desktop' : ''; ?>">
                <?php echo esc_html($title); ?>
            </h4>
        <?php endif; ?>

        <button class="fc-local-nav__toggle" aria-expanded="false"
            aria-label="<?php esc_attr_e('Toggle Navigation', 'first-church-core-blocks'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
    </div>

    <?php if (!empty($links)): ?>
        <nav class="fc-local-nav__menu">
            <ul class="fc-local-nav__list">
                <?php foreach ($links as $link):
                    $label = $link['label'] ?? '';
                    $url = $link['url'] ?? '#';
                    $is_external = !empty($link['isExternal']);
                    $target = $is_external ? 'target="_blank" rel="noopener noreferrer"' : '';

                    if (!$label)
                        continue;
                    ?>
                    <li class="fc-local-nav__item">
                        <a href="<?php echo esc_url($url); ?>" class="fc-local-nav__link" <?php echo $target; ?>>
                            <?php echo esc_html($label); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </nav>
    <?php endif; ?>
</div>