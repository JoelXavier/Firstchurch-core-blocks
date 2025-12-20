<?php
/**
 * Render for Baptism Stats Block
 */

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'fc-baptism-stats']);

// Retrieve cached data
$data = firstchurch_get_baptism_stats_data();
$grouped = $data['grouped'];
$grand_total = $data['grand_total'];
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php if (empty($grouped)): ?>
        <p class="fc-baptism-stats__empty"><?php esc_html_e('No baptism reports found.', 'first-church-core-blocks'); ?></p>
    <?php else: ?>
        <div class="fc-baptism-stats__grand-total">
            <span
                class="fc-baptism-stats__grand-label"><?php esc_html_e('Total Baptized', 'first-church-core-blocks'); ?></span>
            <span class="fc-baptism-stats__grand-number"><?php echo esc_html(number_format($grand_total)); ?></span>
        </div>

        <div class="fc-baptism-stats__grid">
            <?php foreach ($grouped as $month => $data):
                $dateObj = DateTime::createFromFormat('Y-m', $month);
                $monthName = $dateObj ? $dateObj->format('F Y') : $month;
                ?>
                <div class="fc-baptism-stats__month-card">
                    <header class="fc-baptism-stats__header">
                        <h3 class="fc-baptism-stats__month"><?php echo esc_html($monthName); ?></h3>
                        <div class="fc-baptism-stats__total">
                            <span class="fc-baptism-stats__count"><?php echo esc_html($data['total']); ?></span>
                            <span
                                class="fc-baptism-stats__label"><?php esc_html_e('Souls', 'first-church-core-blocks'); ?></span>
                        </div>
                    </header>

                    <div class="fc-baptism-stats__reports">
                        <?php foreach ($data['items'] as $item): ?>
                            <div class="fc-baptism-stats__report-item">
                                <span class="fc-baptism-stats__report-label"><?php echo esc_html($item['label']); ?></span>
                                <span class="fc-baptism-stats__report-count"><?php echo esc_html($item['count']); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>