import { addFilter } from '@wordpress/hooks';

/**
 * Modify Core Quote block metadata
 * Renames core/quote to "Article Quote" and moves it to the "firstchurch" category.
 */
function modifyCoreQuoteBlock(settings, name) {
    if (name === 'core/quote') {
        return {
            ...settings,
            title: 'Article Quote',
            category: 'firstchurch',
        };
    }
    return settings;
}

addFilter(
    'blocks.registerBlockType',
    'firstchurch/core-quote-rename',
    modifyCoreQuoteBlock
);
