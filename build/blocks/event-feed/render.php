<?php
/**
 * Render callback for the Event Feed block.
 */

// Defensive attribute extraction
$per_page = (int) ($attributes['perPage'] ?? 50);
$columns = (int) ($attributes['columns'] ?? 3);
$filter_style = $attributes['filterStyle'] ?? 'sidebar';
$block_title = $attributes['blockTitle'] ?? '';
$block_subtitle = $attributes['blockSubtitle'] ?? '';
$show_excerpt = (bool) ($attributes['showExcerpt'] ?? false);

// 1. Determine Filtering State
$active_month = isset($_GET['filter_month']) ? sanitize_text_field($_GET['filter_month']) : '';
$active_cat = isset($_GET['filter_category']) ? sanitize_text_field($_GET['filter_category']) : '';

// 2. Fetch Cached Data (ViewModel)
$data = firstchurch_get_event_feed_data(
    ['perPage' => $per_page],
    ['month' => $active_month, 'category' => $active_cat]
);

// Fallback if the function returns null or fails
if (!is_array($data)) {
    $data = [];
}

$events = $data['events'] ?? [];
$months_list = $data['months'] ?? [];
$categories_list = $data['categories'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-listing fc-event-feed layout-' . $filter_style
]);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

    <?php if ($block_title): ?>
        <div class="fc-listing__header">
            <h2 class="fc-listing__title"><?php echo esc_html($block_title); ?></h2>
            <div class="fc-listing__decoration"></div>
            <?php if ($block_subtitle): ?>
                <p class="fc-listing__subtitle"><?php echo esc_html($block_subtitle); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="fc-listing__body <?php echo ('sidebar' === $filter_style) ? 'fc-listing__body--has-sidebar' : ''; ?>">

        <?php if ('sidebar' === $filter_style): ?>
            <div class="fc-listing__sidebar">
                <div class="fc-listing__sidebar-sticky">
                    <div class="fc-listing__filter-group">
                        <h4 class="fc-listing__sidebar-title">
                            <?php esc_html_e('Filter by Month', 'first-church-core-blocks'); ?>
                        </h4>
                        <div class="fc-listing__filter-list">
                            <?php $all_link = remove_query_arg('filter_month'); ?>
                            <a href="<?php echo esc_url($all_link); ?>"
                                class="fc-listing__filter-item <?php echo empty($active_month) ? 'is-active' : ''; ?>">
                                <?php esc_html_e('All Upcoming', 'first-church-core-blocks'); ?>
                            </a>

                            <?php foreach ($months_list as $m):
                                $is_active = ($m['key'] === $active_month);
                                $link = add_query_arg('filter_month', $m['key']);
                                ?>
                                <a href="<?php echo esc_url($link); ?>"
                                    class="fc-listing__filter-item <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <?php echo esc_html($m['label']); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="fc-listing__filter-group">
                        <h4 class="fc-listing__sidebar-title">
                            <?php esc_html_e('Filter by Category', 'first-church-core-blocks'); ?>
                        </h4>
                        <div class="fc-listing__filter-list">
                            <?php $all_cat_link = remove_query_arg('filter_category'); ?>
                            <a href="<?php echo esc_url($all_cat_link); ?>"
                                class="fc-listing__filter-item <?php echo empty($active_cat) ? 'is-active' : ''; ?>">
                                <?php esc_html_e('All Categories', 'first-church-core-blocks'); ?>
                            </a>

                            <?php foreach ($categories_list as $cat):
                                $is_active = ($cat['slug'] === $active_cat);
                                $cat_link = add_query_arg('filter_category', $cat['slug']);
                                ?>
                                <a href="<?php echo esc_url($cat_link); ?>"
                                    class="fc-listing__filter-item <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <?php echo esc_html($cat['name']); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <div class="fc-listing__main">
            <div class="fc-listing__grid" style="--columns: <?php echo (int) $columns; ?>;">
                <?php if (!empty($events)): ?>
                    <?php foreach ($events as $event):
                        $target = $event['cta']['is_external'] ? ' target="_blank" rel="noopener noreferrer"' : '';
                        $card_class = 'fc-event-card' . ($event['is_canceled'] ? ' fc-event-card--canceled' : '');
                        ?>
                        <div class="<?php echo esc_attr($card_class); ?>">
                            <?php if ($event['img_url']): ?>
                                <div class="fc-event-card__media">
                                    <img src="<?php echo esc_url($event['img_url']); ?>"
                                        alt="<?php echo esc_attr($event['title']); ?>">
                                </div>
                            <?php endif; ?>

                            <div class="fc-event-card__date-badge">
                                <span class="fc-event-card__month"><?php echo esc_html($event['date_badge']['month']); ?></span>
                                <span class="fc-event-card__day"><?php echo esc_html($event['date_badge']['day']); ?></span>
                            </div>

                            <div class="fc-event-card__content">
                                <span class="fc-event-card__label"><?php echo esc_html($event['label']); ?></span>
                                <h3 class="fc-event-card__title">
                                    <a href="<?php echo esc_url($event['cta']['url']); ?>" class="fc-event-card__link" <?php echo $target; // phpcs:ignore ?>>
                                        <?php echo esc_html($event['title']); ?>
                                    </a>
                                </h3>

                                <?php if ($event['location']): ?>
                                    <div class="fc-event-card__location"><?php echo esc_html($event['location']); ?></div>
                                <?php endif; ?>

                                <div class="fc-event-card__meta">
                                    <?php if (empty($event['schedule_lines'])): ?>
                                        <?php echo esc_html($event['date_string']); ?>
                                    <?php endif; ?>
                                </div>

                                <?php if (!empty($event['schedule_lines'])): ?>
                                    <div class="fc-event-card__schedule-list">
                                        <?php foreach ($event['schedule_lines'] as $line): ?>
                                            <div class="fc-event-card__schedule-item"><?php echo esc_html($line); ?></div>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <div class="fc-event-card__action">
                                <?php if ($event['is_canceled']): ?>
                                    <span
                                        class="fc-event-card__status-badge"><?php esc_html_e('Canceled', 'first-church-core-blocks'); ?></span>
                                <?php else: ?>
                                    <a href="<?php echo esc_url($event['cta']['url']); ?>" class="fc-event-card__button" <?php echo $target; // phpcs:ignore ?>>
                                        <?php echo esc_html($event['cta']['text']); ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="fc-no-results">
                        <p><?php esc_html_e('No upcoming events found for this period.', 'first-church-core-blocks'); ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>