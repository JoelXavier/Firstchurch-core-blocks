<?php
/**
 * Title: Article B (With Image)
 * Slug: firstchurch/article-b
 * Categories: firstchurch
 * Description: Visual layout with Split Hero (Image Left/Right), Body, and Footer. Best used with "Blank Canvas" template.
 */

return [
    'title' => __('Article B (With Image)', 'first-church-core-blocks'),
    'categories' => ['firstchurch/articles'],
    'content' => '
        <!-- wp:firstchurch/global-nav /-->

        <!-- wp:firstchurch/hero-split {"title":"Visual Story","subtitle":"Featured Image Layout","content":"A brief introduction or summary of the article goes here.","inverse":false} /-->

        <!-- wp:firstchurch/breadcrumbs /-->

        <!-- wp:firstchurch/article-body -->
        <div class="wp-block-fc-article-body">
            <!-- wp:paragraph -->
            <p>Start writing your visual article here...</p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:firstchurch/article-body -->

        <!-- wp:firstchurch/footer /-->
    ',
];
