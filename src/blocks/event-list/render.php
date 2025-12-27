<?php
/**
 * Render callback for the Event List block.
 */

$attributes = isset($attributes) ? $attributes : [];
$section_title = isset($attributes['sectionTitle']) ? $attributes['sectionTitle'] : '';
$section_subheader = isset($attributes['sectionSubheader']) ? $attributes['sectionSubheader'] : '';
$view_all_text = isset($attributes['viewAllText']) ? $attributes['viewAllText'] : 'See All Events';
$view_all_link = isset($attributes['viewAllLink']) ? $attributes['viewAllLink'] : '';
$header_color = isset($attributes['headerColor']) ? $attributes['headerColor'] : '';
$corner_radius = isset($attributes['cornerRadius']) ? $attributes['cornerRadius'] : '0px';
$card_gap = isset($attributes['cardGap']) ? $attributes['cardGap'] : '0px';
$view_all_color = isset($attributes['viewAllColor']) ? $attributes['viewAllColor'] : '';

// Style string for caching
$header_style = $header_color ? 'color: ' . esc_attr($header_color) . ';' : '';
$line_style = $header_color ? 'background-color: ' . esc_attr($header_color) . ';' : '';
$view_all_style = $view_all_color ? 'color: ' . esc_attr($view_all_color) . ';' : '';

// Inject CSS variable for radius
$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'fc-event-list',
    'style' => '--fc-event-item-radius: ' . esc_attr($corner_radius) . '; --fc-event-list-gap: ' . esc_attr($card_gap) . ';'
));
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if ($section_title): ?>
        <div class="fc-event-list__header">
            <h2 class="fc-event-list__title" style="<?php echo $header_style; ?>"><?php echo esc_html($section_title); ?>
            </h2>
            <div class="fc-event-list__line" style="<?php echo $line_style; ?>"></div>
            <?php if ($section_subheader): ?>
                <p class="fc-event-list__subheader"><?php echo esc_html($section_subheader); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <!-- InnerBlocks Content (The Event Items) -->
    <div class="fc-event-list__grid">
        <?php echo $content; ?>
    </div>

    <?php if ($view_all_text): // Changed condition to Text instead of Link ?>
        <div class="fc-event-list__footer">
            <?php if ($view_all_link): ?>
                <a href="<?php echo esc_url($view_all_link); ?>" class="fc-view-all-btn" style="<?php echo $view_all_style; ?>">
                    <?php echo esc_html($view_all_text); ?>
                </a>
            <?php else: ?>
                <!-- Render as span if no link provided yet -->
                <span class="fc-view-all-btn"
                    style="<?php echo $view_all_style; ?>"><?php echo esc_html($view_all_text); ?></span>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>