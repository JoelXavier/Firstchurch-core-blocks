<?php
/**
 * Render callback for the Manual Event Item block.
 */

$attributes = isset($attributes) ? $attributes : [];

$title = isset($attributes['title']) ? $attributes['title'] : '';
$label = isset($attributes['label']) ? $attributes['label'] : '';
$location = isset($attributes['location']) ? $attributes['location'] : '';
$date_start = isset($attributes['dateStart']) ? $attributes['dateStart'] : null;
$date_end = isset($attributes['dateEnd']) ? $attributes['dateEnd'] : null;
$is_canceled = isset($attributes['isCanceled']) ? $attributes['isCanceled'] : false;
$media_url = isset($attributes['mediaUrl']) ? $attributes['mediaUrl'] : '';
$cta_text = isset($attributes['ctaText']) ? $attributes['ctaText'] : 'Get Tickets';
$cta_url = isset($attributes['ctaUrl']) ? $attributes['ctaUrl'] : '#';
$schedule = isset($attributes['schedule']) ? $attributes['schedule'] : [];

// Determine classes
$classes = 'antigravity-event-card';
if ($is_canceled) {
    $classes .= ' is-canceled';
}

$wrapper_attrs = get_block_wrapper_attributes(array('class' => $classes));

// Date Logic (PHP)
$ts_start = $date_start ? strtotime($date_start) : time();
$month_short = date('M', $ts_start);
$day_numeric = date('j', $ts_start);
$time_str = date('g:i A', $ts_start);

// Calculate Date String (Mimic JS Logic)
$date_string = null; // Default to empty (time handled manually via schedule)

if ($date_end) {
    $ts_end = strtotime($date_end);
    $start_day = date('Y-m-d', $ts_start);
    $end_day = date('Y-m-d', $ts_end);

    if ($start_day !== $end_day) {
        // Multi-day range: "Oct 12 - Oct 14"
        $date_string = date('M j', $ts_start) . ' - ' . date('M j', $ts_end);
    }
}

// Display Logic
?>

<article <?php echo $wrapper_attrs; ?>>
    <!-- 1. Media -->
    <?php if (!empty($media_url)): ?>
        <div class="event-media">
            <img src="<?php echo esc_url($media_url); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy" />
        </div>
    <?php endif; ?>

    <!-- 2. Date Badge -->
    <div class="event-date-badge">
        <span class="event-month"><?php echo esc_html($month_short); ?></span>
        <span class="event-day"><?php echo esc_html($day_numeric); ?></span>
    </div>

    <!-- 3. Content -->
    <div class="event-content">
        <?php if ($label): ?>
            <span class="event-label"><?php echo esc_html($label); ?></span>
        <?php endif; ?>

        <h3 class="event-title">
            <a href="<?php echo esc_url($cta_url); ?>" class="event-link"><?php echo esc_html($title); ?></a>
        </h3>

        <div class="event-meta">
            <?php if ($is_canceled): ?>
                <span class="event-status-badge">Canceled</span>
            <?php endif; ?>

            <span class="event-location"><?php echo esc_html($location); ?></span>

            <?php if ($date_string): ?>
                <span class="event-time"> • <?php echo esc_html($date_string); ?></span>
            <?php endif; ?>
        </div>

        <?php if (!empty($schedule)): ?>
            <div class="event-schedule-list">
                <?php foreach ($schedule as $line): ?>
                    <div class="event-schedule-item"><?php echo esc_html($line); ?></div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- 4. Action -->
    <div class="event-action">
        <a href="<?php echo esc_url($cta_url); ?>" class="event-button">
            <?php echo esc_html($cta_text); ?>
        </a>
    </div>
</article>