<?php
/**
 * Title: Article Layout
 * Slug: firstchurch/article-layout
 * Categories: firstchurch
 * Description: A standard layout for articles with a hero, breadcrumbs, and content body.
 */

return [
    'title' => __('Article Layout', 'first-church-core-blocks'),
    'categories' => ['firstchurch'],
    'content' => '
        <!-- wp:firstchurch/article-hero {"title":"Article Headline","subtitle":"Subtitle or Category","imageID":0} /-->

        <!-- wp:firstchurch/breadcrumbs /-->

        <!-- wp:firstchurch/article-body -->
        <div class="wp-block-fc-article-body">
            <!-- wp:paragraph -->
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <!-- /wp:paragraph -->

            <!-- wp:heading -->
            <h2>Section Title</h2>
            <!-- /wp:heading -->

            <!-- wp:paragraph -->
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:firstchurch/article-body -->
    ',
];
