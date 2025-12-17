const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        ...defaultConfig.entry(),
        dashboard: './src/dashboard/index.js',
        'extensions/separator': './src/extensions/separator/index.js',
        'extensions/event-settings': './src/extensions/event-settings/index.js',
        'extensions/location-settings': './src/extensions/location-settings/index.js',
    },
};
