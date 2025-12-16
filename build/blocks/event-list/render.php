<?php
/**
 * Render callback for the Event List block.
 */

$attributes = isset($attributes) ? $attributes : [];
$section_title = isset($attributes['sectionTitle']) ? $attributes['sectionTitle'] : '';
$section_subheader = isset($attributes['sectionSubheader']) ? $attributes['sectionSubheader'] : '';
$view_all_text = isset($attributes['viewAllText']) ? $attributes['viewAllText'] : 'See All Events';
$view_all_link = isset($attributes['viewAllLink']) ? $attributes['viewAllLink'] : '';

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'fc-event-list'
));
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if ($section_title): ?>
        <div class="fc-event-list__header">
            <h2 class="fc-event-list__title"><?php echo esc_html($section_title); ?></h2>
            <div class="fc-event-list__line"></div>
            <?php if ($section_subheader): ?>
                <p class="fc-event-list__subheader"><?php echo esc_html($section_subheader); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <!-- InnerBlocks Content (The Event Items) -->
    <div class="fc-event-list__grid">
        <?php echo $content; ?>
    </div>

    <?php if ($view_all_link): ?>
        <div class="fc-event-list__footer">
            <a href="<?php echo esc_url($view_all_link); ?>" class="fc-view-all-btn">
                <?php echo esc_html($view_all_text); ?>
            </a>
        </div>
    <?php endif; ?>
</div>