<?php
/**
 * Title: Mission Component
 * Slug: firstchurch/mission-statement
 * Categories: firstchurch
 * Description: A section highlighting the church mission statement.
 */

return [
    'title' => __('Mission Component', 'first-church-core-blocks'),
    'categories' => ['firstchurch'],
    'content' => '
        <!-- wp:firstchurch/section {"backgroundColor":"neutral-100"} -->
        <div class="wp-block-fc-section has-neutral-100-background-color">
            <!-- wp:heading {"textAlign":"center","level":3} -->
            <h3 class="has-text-align-center">Our Mission</h3>
            <!-- /wp:heading -->

            <!-- wp:firstchurch/quote {"quote":"To love God, love people, and make disciples of Jesus Christ."} /-->
            
            <!-- wp:paragraph {"align":"center"} -->
            <p class="has-text-align-center">Join us in our journey to bring light and hope to our community.</p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:firstchurch/section -->
    ',
];
