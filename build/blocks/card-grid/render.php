<?php
/**
 * Render callback for the Card Grid block.
 */

$attributes = $attributes ?? [];
$section_title = $attributes['sectionTitle'] ?? '';
$columns = $attributes['columns'] ?? 3;
$section_title_color = $attributes['sectionTitleColor'] ?? '';
$card_label_color = $attributes['cardLabelColor'] ?? '';
$card_title_color = $attributes['cardTitleColor'] ?? '';
$card_link_color = $attributes['cardLinkColor'] ?? '';

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
    'class' => 'antigravity-card-grid',
    'style' => $style_string
]);
?>

<section <?php echo $wrapper_attributes; ?>>
    <div class="container">
        <!-- Note: "className" was used in edit.js JSX but implies "class" in PHP. 
         However, the original JSX used 'container' div. Let's match it structurally. -->
        <?php if ($section_title): ?>
            <div class="card-grid-header">
                <h2 class="section-title"><?php echo wp_kses_post($section_title); ?></h2>
                <div class="section-line"></div>
            </div>
        <?php endif; ?>

        <div class="card-grid-container">
            <?php echo $content; ?>
        </div>
    </div>
</section>