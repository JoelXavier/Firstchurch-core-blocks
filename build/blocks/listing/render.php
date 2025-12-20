<?php
/**
 * Render callback for the Content Listing block (SSR / PHP Version).
 * Matches the HTML structure of Listing.jsx for consistent styling.
 */

// Defensive attribute extraction
$post_type = $attributes['postType'] ?? 'post';
$per_page = (int) ($attributes['perPage'] ?? 9);
$layout = $attributes['layout'] ?? 'grid';
$columns = (int) ($attributes['columns'] ?? 3);

// Block specific attribs
$filter_style = $attributes['filterStyle'] ?? 'sidebar';
$block_title = $attributes['blockTitle'] ?? '';
$block_subtitle = $attributes['blockSubtitle'] ?? '';
$card_type = $attributes['cardType'] ?? 'standard';

// Display Settings
$show_date = (bool) ($attributes['showDate'] ?? true);
$show_cat = (bool) ($attributes['showCategory'] ?? true);
$show_excerpt = (bool) ($attributes['showExcerpt'] ?? true);
$show_media = (bool) ($attributes['showMedia'] ?? true);

// 1. Fetch Cached Data (Dynamic Pattern Matching)
// Note: We pass 'postType' explicitly to enable dynamic version keys
$data = firstchurch_get_listing_data(
    [
        'postType' => $post_type,
        'perPage' => $per_page,
        'termIds' => $term_ids ?? [],
        'taxonomy' => $taxonomy ?? 'category'
    ],
    ['filter_cat' => isset($_GET['filter_cat']) ? absint($_GET['filter_cat']) : 0]
);

$posts = $data['posts'];
$filter_terms = $data['terms'];
$active_cat_id = $data['active_cat_id'];

?>

<?php
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'fc-listing layout-' . $filter_style
]);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

    <!-- Header Section -->
    <div class="fc-listing__header">
        <?php if ($block_title): ?>
            <h2 class="fc-listing__title"><?php echo esc_html($block_title); ?></h2>
        <?php endif; ?>
        <?php if ($block_subtitle): ?>
            <p class="fc-listing__subtitle"><?php echo esc_html($block_subtitle); ?></p>
        <?php endif; ?>
        <div class="fc-listing__decoration"></div>
    </div>

    <div class="fc-listing__body">

        <!-- Sidebar (Left) -->
        <?php if ($filter_style === 'sidebar'): ?>
            <div class="fc-listing__sidebar">
                <div class="fc-listing__sidebar-sticky">
                    <div class="fc-listing__filters fc-listing__filters--sidebar">

                        <!-- 'All' Button -->
                        <?php $all_link = remove_query_arg('filter_cat'); ?>
                        <a href="<?php echo esc_url($all_link); ?>"
                            class="fc-filter-btn <?php echo ($active_cat_id === 0) ? 'is-active' : ''; ?>">
                            <span class="fc-filter-label">All</span>
                        </a>

                        <?php if (!empty($filter_terms)): ?>
                            <?php foreach ($filter_terms as $term):
                                $is_active = ($term['term_id'] === $active_cat_id);
                                $link = add_query_arg('filter_cat', $term['term_id']);
                                ?>
                                <a href="<?php echo esc_url($link); ?>"
                                    class="fc-filter-btn <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <span class="fc-filter-label"><?php echo esc_html($term['name']); ?></span>
                                </a>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Main Content -->
        <div class="fc-listing__main">

            <!-- Pills Top Level -->
            <?php if ($filter_style === 'pills'): ?>
                <div class="fc-listing__top-bar">
                    <div class="fc-listing__filters fc-listing__filters--pills">
                        <!-- 'All' Button -->
                        <?php $all_link = remove_query_arg('filter_cat'); ?>
                        <a href="<?php echo esc_url($all_link); ?>"
                            class="fc-filter-btn <?php echo ($active_cat_id === 0) ? 'is-active' : ''; ?>">
                            <span class="fc-filter-label">All</span>
                        </a>

                        <?php if (!empty($filter_terms)): ?>
                            <?php foreach ($filter_terms as $term):
                                $is_active = ($term['term_id'] === $active_cat_id);
                                $link = add_query_arg('filter_cat', $term['term_id']);
                                ?>
                                <a href="<?php echo esc_url($link); ?>"
                                    class="fc-filter-btn <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <span class="fc-filter-label"><?php echo esc_html($term['name']); ?></span>
                                </a>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Grid -->
            <div class="fc-listing__grid" style="--columns: <?php echo esc_attr($columns); ?>">
                <?php if (!empty($posts)): ?>
                    <?php foreach ($posts as $post): ?>
                        <div class="fc-card-item">
                            <a href="<?php echo esc_url($post['permalink']); ?>" class="fc-card-link-wrapper">
                                <?php if ($show_media && $post['thumb']): ?>
                                    <div class="fc-card-image-wrapper">
                                        <img src="<?php echo esc_url($post['thumb']); ?>"
                                            alt="<?php echo esc_attr($post['title']); ?>" class="fc-card-image" />
                                    </div>
                                <?php endif; ?>

                                <div class="fc-card-content">
                                    <div class="fc-card-text-group">
                                        <?php if ($show_cat): ?>
                                            <span
                                                class="fc-card-label"><?php echo esc_html($card_type === 'event' ? 'Event' : $post['cat_name']); ?></span>
                                        <?php endif; ?>

                                        <h3 class="fc-card-title"><?php echo esc_html($post['title']); ?></h3>

                                        <?php if ($show_excerpt && $post['excerpt']): ?>
                                            <div class="fc-card-excerpt"><?php echo wp_kses_post($post['excerpt']); ?></div>
                                        <?php endif; ?>
                                    </div>

                                    <span class="fc-card-cta">LEARN MORE ></span>
                                </div>
                            </a>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="fc-no-results">
                        <p>No content found.</p>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Pagination (Visual) -->
            <div class="fc-listing__pagination">
                <button class="fc-pagination-btn is-active">1</button>
                <button class="fc-pagination-btn">Next &gt;</button>
            </div>

        </div>