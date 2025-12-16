<?php
/**
 * Render callback for the Breadcrumbs block.
 */

$attributes = isset($attributes) ? $attributes : [];
$separator = isset($attributes['separator']) ? $attributes['separator'] : '/';
$show_home = isset($attributes['showHome']) ? $attributes['showHome'] : true;

$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'antigravity-breadcrumbs'
));

// Build the trail
$trail_items = [];

// 1. Home
if ($show_home) {
    $trail_items[] = [
        'title' => 'Home',
        'url' => home_url('/'),
        'current' => false
    ];
}

// 2. Ancestors
global $post;
if (is_page() && $post && $post->post_parent) {
    $ancestors = get_post_ancestors($post->ID);
    $ancestors = array_reverse($ancestors); // Root first
    foreach ($ancestors as $ancestor_id) {
        $trail_items[] = [
            'title' => get_the_title($ancestor_id),
            'url' => get_permalink($ancestor_id),
            'current' => false
        ];
    }
} elseif (is_single()) {
    // For Posts, add Category? Or just Post Type archive?
    // Let's add Post Type Archive if exists
    $post_type = get_post_type();
    $post_type_obj = get_post_type_object($post_type);
    if ($post_type !== 'post' && $post_type_obj->has_archive) {
        $trail_items[] = [
            'title' => $post_type_obj->labels->name,
            'url' => get_post_type_archive_link($post_type),
            'current' => false
        ];
    } else if ($post_type === 'post') {
        $cats = get_the_category();
        if (!empty($cats)) {
            $trail_items[] = [
                'title' => $cats[0]->name,
                'url' => get_category_link($cats[0]->term_id),
                'current' => false
            ];
        }
    }
}

// 3. Current
if (is_singular() || is_page()) {
    $trail_items[] = [
        'title' => get_the_title(),
        'url' => '#',
        'current' => true
    ];
} elseif (is_archive()) {
    $trail_items[] = [
        'title' => get_the_archive_title(),
        'url' => '#',
        'current' => true
    ];
} elseif (is_home()) {
    // Blog home
    $trail_items[] = [
        'title' => 'Articles',
        'url' => '#',
        'current' => true
    ];
}

?>

<nav <?php echo $wrapper_attributes; ?> aria-label="Breadcrumb">
    <?php foreach ($trail_items as $index => $item): ?>
        <?php if ($index > 0): ?>
            <span class="breadcrumb-separator" aria-hidden="true"><?php echo esc_html($separator); ?></span>
        <?php endif; ?>

        <?php if ($item['current']): ?>
            <span class="breadcrumb-item current" aria-current="page">
                <?php echo esc_html($item['title']); ?>
            </span>
        <?php else: ?>
            <a href="<?php echo esc_url($item['url']); ?>" class="breadcrumb-item">
                <?php echo esc_html($item['title']); ?>
            </a>
        <?php endif; ?>
    <?php endforeach; ?>
</nav>