<?php
/**
 * Render callback for the Video Card Item block.
 */

$attributes = $attributes ?? [];
$label = $attributes['label'] ?? '';
$title = $attributes['title'] ?? '';
$link_url = $attributes['linkUrl'] ?? '#';
$link_text = $attributes['linkText'] ?? 'WATCH NOW >';
$video_url = $attributes['videoUrl'] ?? '';
$video_id = $attributes['videoId'] ?? '';
$card_label_color = $attributes['cardLabelColor'] ?? '';
$card_title_color = $attributes['cardTitleColor'] ?? '';
$card_link_color = $attributes['cardLinkColor'] ?? '';

// Fallback if videoId wasn't saved but we have a URL (backward compatibility / direct PHP usage)
if (empty($video_id) && !empty($video_url)) {
    if (preg_match('/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/', $video_url, $matches)) {
        if (isset($matches[7]) && strlen($matches[7]) === 11) {
            $video_id = $matches[7];
        }
    }
}

$style_string = "";
if ($card_label_color)
    $style_string .= " --local-card-label-color: {$card_label_color};";
if ($card_title_color)
    $style_string .= " --local-card-title-color: {$card_title_color};";
if ($card_link_color)
    $style_string .= " --local-card-link-color: {$card_link_color};";

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-card-item fc-video-card-item',
    'style' => $style_string
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="fc-card-link-wrapper"> <!-- Kept as div for layout, removed href to check invalid nesting -->

        <div class="fc-card-image-wrapper">
            <?php if ($video_id): ?>
                <iframe src="https://www.youtube.com/embed/<?php echo esc_attr($video_id); ?>"
                    title="<?php echo esc_attr($title); ?>" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
            <?php else: ?>
                <div class="fc-card-image-placeholder"
                    style="background: #000; display: flex; align-items: center; justify-content: center; color: white;">
                    <span>NO VIDEO</span>
                </div>
            <?php endif; ?>
        </div>

        <a href="<?php echo esc_url($link_url); ?>" class="fc-card-content"
            style="text-decoration: none; color: inherit;">
            <div class="fc-card-text-group">
                <?php if ($label): ?>
                    <span class="fc-card-label"><?php echo esc_html($label); ?></span>
                <?php endif; ?>

                <?php if ($title): ?>
                    <h3 class="fc-card-title"><?php echo wp_kses_post($title); ?></h3>
                <?php endif; ?>
            </div>

            <span class="fc-card-cta"><?php echo esc_html($link_text); ?></span>
        </a>
    </div>
</div>