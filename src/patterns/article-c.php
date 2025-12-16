<?php
/**
 * Title: Article C (Immersive)
 * Slug: firstchurch/article-c
 * Categories: firstchurch
 * Description: Immersive layout with Full-Bleed Hero, Body, and Footer. Best used with "Blank Canvas" template.
 */

return [
    'title' => __('Article C (Immersive)', 'first-church-core-blocks'),
    'categories' => ['firstchurch/articles'],
    'content' => '
        <!-- wp:firstchurch/global-nav /-->

        <!-- wp:firstchurch/article-hero {"title":"Immersive Experience","subtitle":"Full Width Hero","imageID":0,"isImmersive":true} /-->

        <!-- wp:firstchurch/breadcrumbs /-->

        <!-- wp:firstchurch/article-body -->
        <div class="wp-block-fc-article-body">
            <!-- wp:paragraph -->
            <p>Start writing your immersive article here...</p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:firstchurch/article-body -->

        <!-- wp:firstchurch/footer /-->
    ',
];
