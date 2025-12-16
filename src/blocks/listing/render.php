<?php
/**
 * Render callback for the Content Listing block (SSR / PHP Version).
 * Matches the HTML structure of Listing.jsx for consistent styling.
 */

$attributes = isset($attributes) ? $attributes : [];
$post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
$per_page = isset($attributes['perPage']) ? $attributes['perPage'] : 9;
$layout = isset($attributes['layout']) ? $attributes['layout'] : 'grid';
$columns = isset($attributes['columns']) ? $attributes['columns'] : 3;

// Block specific attribs
$filter_style = isset($attributes['filterStyle']) ? $attributes['filterStyle'] : 'sidebar';
$block_title = isset($attributes['blockTitle']) ? $attributes['blockTitle'] : '';
$block_subtitle = isset($attributes['blockSubtitle']) ? $attributes['blockSubtitle'] : '';
$card_type = isset($attributes['cardType']) ? $attributes['cardType'] : 'standard';

// Display Settings
$show_date = isset($attributes['showDate']) ? $attributes['showDate'] : true;
$show_cat = isset($attributes['showCategory']) ? $attributes['showCategory'] : true;
$show_excerpt = isset($attributes['showExcerpt']) ? $attributes['showExcerpt'] : true;
$show_media = isset($attributes['showMedia']) ? $attributes['showMedia'] : true;

// 1. Determine "Active" category from URL ?filter_cat=ID or fallback to 'all'
$active_cat_id = isset($_GET['filter_cat']) ? intval($_GET['filter_cat']) : 0;

// Filter Terms
$cat_args = [
    'taxonomy' => !empty($taxonomy) ? $taxonomy : 'category',
    'number' => 10,
    'hide_empty' => true
];
$filter_terms = get_terms($cat_args);

// 2. Build Query
$args = array(
    'post_type' => $post_type,
    'posts_per_page' => $per_page,
    'post_status' => 'publish',
    'orderby' => 'date',
    'order' => 'DESC'
);

// If URL has filter, use that.
if ($active_cat_id > 0) {
    $args['tax_query'] = array(
        array(
            'taxonomy' => !empty($taxonomy) ? $taxonomy : 'category',
            'field' => 'term_id',
            'terms' => $active_cat_id,
        ),
    );
}
// Else if Editor defined a preset filter, use that (only if URL param isn't overriding)
else if (!empty($taxonomy) && !empty($term_ids)) {
    $args['tax_query'] = array(
        array(
            'taxonomy' => $taxonomy,
            'field' => 'term_id',
            'terms' => $term_ids,
        ),
    );
}

$query = new WP_Query($args);
?>

<?php
$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'antigravity-listing-component layout-' . esc_attr($filter_style)
));
?>

<div <?php echo $wrapper_attributes; ?>>

    <!-- Header Section -->
    <div class="listing-header">
        <?php if ($block_title): ?>
            <h2 class="listing-title"><?php echo esc_html($block_title); ?></h2>
        <?php endif; ?>
        <?php if ($block_subtitle): ?>
            <p class="listing-subtitle"><?php echo esc_html($block_subtitle); ?></p>
        <?php endif; ?>
        <div class="listing-decoration"></div>
    </div>

    <div class="listing-body">

        <!-- Sidebar (Left) -->
        <?php if ($filter_style === 'sidebar'): ?>
            <div class="listing-sidebar">
                <div class="listing-sidebar-sticky">
                    <div class="listing-filters listing-filters--sidebar">

                        <!-- 'All' Button -->
                        <?php $all_link = remove_query_arg('filter_cat'); ?>
                        <a href="<?php echo esc_url($all_link); ?>"
                            class="filter-btn <?php echo ($active_cat_id === 0) ? 'is-active' : ''; ?>">
                            <span class="filter-label">All</span>
                        </a>

                        <?php if (!empty($filter_terms) && !is_wp_error($filter_terms)): ?>
                            <?php foreach ($filter_terms as $term):
                                $is_active = ($term->term_id === $active_cat_id);
                                $link = add_query_arg('filter_cat', $term->term_id);
                                ?>
                                <a href="<?php echo esc_url($link); ?>"
                                    class="filter-btn <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <span class="filter-label"><?php echo esc_html($term->name); ?></span>
                                </a>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Main Content -->
        <div class="listing-main">

            <!-- Pills Top Level -->
            <?php if ($filter_style === 'pills'): ?>
                <div class="listing-top-bar">
                    <div class="listing-filters listing-filters--pills">
                        <!-- 'All' Button -->
                        <?php $all_link = remove_query_arg('filter_cat'); ?>
                        <a href="<?php echo esc_url($all_link); ?>"
                            class="filter-btn <?php echo ($active_cat_id === 0) ? 'is-active' : ''; ?>">
                            <span class="filter-label">All</span>
                        </a>

                        <?php if (!empty($filter_terms) && !is_wp_error($filter_terms)): ?>
                            <?php foreach ($filter_terms as $term):
                                $is_active = ($term->term_id === $active_cat_id);
                                $link = add_query_arg('filter_cat', $term->term_id);
                                ?>
                                <a href="<?php echo esc_url($link); ?>"
                                    class="filter-btn <?php echo $is_active ? 'is-active' : ''; ?>">
                                    <span class="filter-label"><?php echo esc_html($term->name); ?></span>
                                </a>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Grid -->
            <div class="listing-grid" style="--columns: <?php echo esc_attr($columns); ?>">
                <?php if ($query->have_posts()): ?>
                    <?php while ($query->have_posts()):
                        $query->the_post();
                        $pid = get_the_ID();
                        $title = get_the_title();
                        $permalink = get_permalink();
                        $excerpt = get_the_excerpt();
                        $thumb = get_the_post_thumbnail_url($pid, 'large');
                        $cat_obj = get_the_category();
                        $cat_name = !empty($cat_obj) ? $cat_obj[0]->name : 'Uncategorized';

                        // Render standard card HTML
                        ?>
                        <div class="antigravity-card-item">
                            <a href="<?php echo esc_url($permalink); ?>" class="card-link-wrapper">
                                <?php if ($show_media && $thumb): ?>
                                    <div class="card-image-wrapper">
                                        <img src="<?php echo esc_url($thumb); ?>" alt="<?php echo esc_attr($title); ?>" />
                                    </div>
                                <?php endif; ?>

                                <div class="card-content">
                                    <div class="card-text-group">
                                        <?php if ($show_cat): ?>
                                            <span
                                                class="card-label"><?php echo esc_html($card_type === 'event' ? 'Event' : $cat_name); ?></span>
                                        <?php endif; ?>

                                        <h3 class="card-title"><?php echo esc_html($title); ?></h3>

                                        <?php if ($show_excerpt && $excerpt): ?>
                                            <div class="card-excerpt"><?php echo wp_kses_post($excerpt); ?></div>
                                        <?php endif; ?>
                                    </div>

                                    <span class="card-cta">LEARN MORE ></span>
                                </div>
                            </a>
                        </div>
                    <?php endwhile;
                    wp_reset_postdata(); ?>
                <?php else: ?>
                    <div class="no-results">
                        <p>No content found.</p>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Pagination (Visual) -->
            <div class="listing-pagination">
                <button class="pagination-btn is-active">1</button>
                <span class="pagination-ellipsis">...</span>
                <button class="pagination-btn">Next &gt;</button>
            </div>

        </div>
    </div>
</div>