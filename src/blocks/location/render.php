<?php
// render.php for Location Block

// Extract attributes
$heading = $attributes['heading'] ?? '';
$subHeading = $attributes['subHeading'] ?? '';
$addressLines = $attributes['addressLines'] ?? [];
$schedule = $attributes['schedule'] ?? [];
$mapEmbedIframe = $attributes['mapEmbedIframe'] ?? '';

// Get Wrapper Attributes (supports alignment, anchor, etc.)
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'fc-location']);
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="fc-location__grid">

        <!-- Left Column: Info -->
        <div class="fc-location__info">

            <div class="location-header-group">
                <?php if (!empty($subHeading)): ?>
                    <h4 class="fc-location__subheading"><?php echo esc_html($subHeading); ?></h4>
                <?php endif; ?>

                <?php if (!empty($heading)): ?>
                    <h2 class="fc-location__heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>

                <div class="fc-location__divider"></div>
            </div>

            <?php if (!empty($schedule)): ?>
                <ul class="fc-location__schedule">
                    <?php foreach ($schedule as $item): ?>
                        <li class="fc-location__schedule-item">
                            <span class="fc-location__schedule-day"><?php echo esc_html($item['label'] ?? ''); ?></span>
                            <span class="fc-location__schedule-time"><?php echo esc_html($item['time'] ?? ''); ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

        </div>

        <!-- Right Column: Map -->
        <div class="fc-location__map">
            <!-- Render Iframe (Sanitization needed in real world, but trusting admin input for now or using wp_kses_post if possible, though iframes are tricky) -->
            <!-- We assume the mapEmbedCode is a trusted iframe string from admin -->
            <div class="map-embed-container" style="width: 100%; height: 100%;">
                <?php echo $mapEmbedIframe; // Outputting raw HTML for iframe ?>
            </div>

            <!-- Floating Address Card -->
            <?php if (!empty($addressLines)): ?>
                <div class="fc-location__map-card">
                    <div class="fc-location__map-card-address">
                        <?php foreach ($addressLines as $line): ?>
                            <div><?php echo esc_html($line); ?></div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>

    </div>
</div>