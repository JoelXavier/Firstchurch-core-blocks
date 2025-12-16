<?php
/**
 * Template Name: First Church: Blank Canvas
 * Description: A raw canvas with no theme header or footer.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        body {
            margin: 0;
            padding: 0;
        }

        /* Reset common theme spacing if needed */
        .wp-site-blocks {
            padding: 0 !important;
            margin: 0 !important;
        }
    </style>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <main class="antigravity-canvas">
        <?php
        while (have_posts()):
            the_post();
            the_content();
        endwhile;
        ?>
    </main>

    <?php wp_footer(); ?>
</body>

</html>