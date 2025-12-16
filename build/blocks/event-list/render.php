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
    'class' => 'antigravity-event-list'
));
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if ($section_title) : ?>
    <div class="antigravity-event-list-header">
        <h2 class="section-title"><?php echo esc_html($section_title); ?></h2>
        <div class="section-line"></div>
        <?php if ($section_subheader) : ?>
            <p class="section-subheader"><?php echo esc_html($section_subheader); ?></p>
        <?php endif; ?>
    </div>
    <?php endif; ?>

    <!-- InnerBlocks Content (The Event Items) -->
    <div class="antigravity-event-list-grid">
        <?php echo $content; ?>
    </div>

    <?php if ($view_all_link) : ?>
        <div class="antigravity-event-list-footer">
            <a href="<?php echo esc_url($view_all_link); ?>" class="view-all-button">
                <?php echo esc_html($view_all_text); ?>
            </a>
        </div>
    <?php endif; ?>
</div>