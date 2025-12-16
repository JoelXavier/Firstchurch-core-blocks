<?php
/**
 * Title: Team Profile
 * Slug: firstchurch/team-profile
 * Categories: firstchurch
 * Description: A grid layout for displaying team members.
 */

return [
    'title' => __('Team Profile', 'first-church-core-blocks'),
    'categories' => ['firstchurch'],
    'content' => '
        <!-- wp:firstchurch/section -->
        <div class="wp-block-fc-section">
            <!-- wp:heading {"textAlign":"center"} -->
            <h2 class="has-text-align-center">Our Team</h2>
            <!-- /wp:heading -->

            <!-- wp:firstchurch/card-grid {"columns":3} -->
            <div class="wp-block-fc-card-grid">
                <!-- wp:firstchurch/card-item {"title":"Jane Doe","subtitle":"Senior Pastor","imageID":0} /-->
                <!-- wp:firstchurch/card-item {"title":"John Smith","subtitle":"Associate Pastor","imageID":0} /-->
                <!-- wp:firstchurch/card-item {"title":"Emily White","subtitle":"Worship Leader","imageID":0} /-->
            </div>
            <!-- /wp:firstchurch/card-grid -->
        </div>
        <!-- /wp:firstchurch/section -->
    ',
];
