const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		'blocks/global-nav/index': path.resolve( process.cwd(), 'src/blocks/global-nav/index.js' ),
		'blocks/global-nav/view': path.resolve( process.cwd(), 'src/blocks/global-nav/view.js' ),
		'blocks/hero/index': path.resolve( process.cwd(), 'src/blocks/hero/index.js' ),
		'blocks/hero/index': path.resolve( process.cwd(), 'src/blocks/hero/index.js' ),
		'blocks/hero/view': path.resolve( process.cwd(), 'src/blocks/hero/view.js' ),
		// Location Block
		'blocks/location/index': path.resolve( process.cwd(), 'src/blocks/location/index.js' ),
		'blocks/quote/index': path.resolve( process.cwd(), 'src/blocks/quote/index.js' ),
		// Cards
		'blocks/card-grid/index': path.resolve( process.cwd(), 'src/blocks/card-grid/index.js' ),
		'blocks/card-item/index': path.resolve( process.cwd(), 'src/blocks/card-item/index.js' ),
		// Fundraiser
		'blocks/fundraiser/index': path.resolve( process.cwd(), 'src/blocks/fundraiser/index.js' ),
		// Quick Links
		'blocks/quick-links/index': path.resolve( process.cwd(), 'src/blocks/quick-links/index.js' ),
		'blocks/quick-link-item/index': path.resolve( process.cwd(), 'src/blocks/quick-link-item/index.js' ),
		// Hero Split
		'blocks/hero-split/index': path.resolve( process.cwd(), 'src/blocks/hero-split/index.js' ),
		// Listing / Feed
		'blocks/listing/index': path.resolve( process.cwd(), 'src/blocks/listing/index.js' ),
		// Manual Events
		'blocks/event-list/index': path.resolve( process.cwd(), 'src/blocks/event-list/index.js' ),
		// Article Suite
		'blocks/article-hero/index': path.resolve( process.cwd(), 'src/blocks/article-hero/index.js' ),
		'blocks/article-body/index': path.resolve( process.cwd(), 'src/blocks/article-body/index.js' ),
        // Footer (New)
        'blocks/footer/index': path.resolve( process.cwd(), 'src/blocks/footer/index.js' ),
        'blocks/footer-column/index': path.resolve( process.cwd(), 'src/blocks/footer-column/index.js' ),

        // Global Extensions
        'extensions/separator/index': path.resolve( process.cwd(), 'src/extensions/separator/index.js' ),
	},
    output: {
        path: path.resolve( process.cwd(), 'build' ),
        filename: '[name].js',
    }
};
