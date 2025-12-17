<?php
/**
 * Render callback for the Card Grid block.
 */

$attributes = $attributes ?? [];
$section_title = $attributes['sectionTitle'] ?? '';
$section_subheader = $attributes['sectionSubheader'] ?? '';
$columns = $attributes['columns'] ?? 3;
$section_title_color = $attributes['sectionTitleColor'] ?? '';
$card_label_color = $attributes['cardLabelColor'] ?? '';
$card_title_color = $attributes['cardTitleColor'] ?? '';
$card_link_color = $attributes['cardLinkColor'] ?? '';

// Inline styles for header elements
$header_style = $section_title_color ? 'color: ' . esc_attr($section_title_color) . ';' : '';

$style_string = "--grid-columns: {$columns};";
if ($section_title_color)
    $style_string .= " --card-section-title-color: {$section_title_color};";
if ($card_label_color)
    $style_string .= " --card-label-color: {$card_label_color};";
if ($card_title_color)
    $style_string .= " --card-title-color: {$card_title_color};";
if ($card_link_color)
    $style_string .= " --card-link-color: {$card_link_color};";

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-card-grid',
    'style' => $style_string
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="fc-card-grid__inner">
        <?php if ($section_title): ?>
            <div class="fc-card-grid__header">
                <h2 class="fc-card-grid__title" style="<?php echo $header_style; ?>">
                    <?php echo wp_kses_post($section_title); ?>
                </h2>
                <div class="fc-card-grid__line"></div>
                <?php if ($section_subheader): ?>
                    <p class="fc-card-grid__subheader"><?php echo wp_kses_post($section_subheader); ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="fc-card-grid__grid">
            <?php echo $content; ?>
        </div>
    </div>
</section>