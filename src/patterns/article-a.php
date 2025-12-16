<?php
/**
 * Title: Article A (Standard)
 * Slug: firstchurch/article-a
 * Categories: firstchurch
 * Description: Standard layout with Navigation, Hero, Body, and Footer. Best used with "Blank Canvas" template.
 */

return [
    'title' => __('Article A (Standard)', 'first-church-core-blocks'),
    'categories' => ['firstchurch/articles'],
    'content' => '
        <!-- wp:firstchurch/global-nav /-->

        <!-- wp:firstchurch/article-hero {"title":"Article Headline","subtitle":"Category • Date","imageID":0} /-->

        <!-- wp:firstchurch/breadcrumbs /-->

        <!-- wp:firstchurch/article-body -->
        <div class="wp-block-fc-article-body">
            <!-- wp:paragraph -->
            <p>Start writing your standard article here...</p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:firstchurch/article-body -->

        <!-- wp:firstchurch/footer /-->
    ',
];
