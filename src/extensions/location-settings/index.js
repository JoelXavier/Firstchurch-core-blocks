/**
 * Location Settings Sidebar
 * Adds a "Location Details" panel to the Document settings for 'location' post type.
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl, TextareaControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const LocationSettingsPanel = () => {
    // Only show on 'location' post type
    const postType = useSelect((select) => select('core/editor').getCurrentPostType());

    if (postType !== 'location') {
        return null;
    }

    // Connect to Meta
    // Note: 'meta' is nested props, useEntityProp handles it if meta key is registered.
    const [meta, setMeta] = useEntityProp('postType', 'location', 'meta');
    
    // Provide defaults if meta is undefined
    const status = meta['_location_status'] || '';
    const region = meta['_location_region'] || '';
    const address = meta['_location_address'] || '';
    const times = meta['_location_times'] || '';
    const phone = meta['_location_phone'] || '';
    const mapEmbed = meta['_location_map_embed'] || '';

    return (
        <PluginDocumentSettingPanel
            name="firstchurch-location-settings"
            title={__('Location Details', 'first-church-core-blocks')}
            icon="location-alt"
        >
            <PanelRow>
                <div style={{ width: '100%' }}>
                    <p style={{marginBottom: '0.5rem', opacity: 0.8}}>Manage specific details for this location temple card.</p>

                    <TextControl
                        label={__('Region / Title Override', 'first-church-core-blocks')}
                        help={__('e.g. "St. Elizabeth, Jamaica". Overrides the display title if needed.', 'first-church-core-blocks')}
                        value={region}
                        onChange={(newValue) => setMeta({ ...meta, _location_region: newValue })}
                    />
                    
                    <TextControl
                        label={__('Status Message', 'first-church-core-blocks')}
                        help={__('Appears in RED. e.g. "Temporarily Closed due to Hurricane"', 'first-church-core-blocks')}
                        value={status}
                        onChange={(newValue) => setMeta({ ...meta, _location_status: newValue })}
                    />

                    <TextareaControl
                        label={__('Address', 'first-church-core-blocks')}
                        help={__('e.g. "Main Street Lacovia, St. Elizabeth"', 'first-church-core-blocks')}
                        value={address}
                        onChange={(newValue) => setMeta({ ...meta, _location_address: newValue })}
                    />

                     <TextControl
                        label={__('Phone', 'first-church-core-blocks')}
                        value={phone}
                        onChange={(newValue) => setMeta({ ...meta, _location_phone: newValue })}
                    />

                    <TextareaControl
                        label={__('Service Times', 'first-church-core-blocks')}
                        help={__('e.g. "Wednesday @ 6:30pm & Sunday @ 11:00am"', 'first-church-core-blocks')}
                        value={times}
                        onChange={(newValue) => setMeta({ ...meta, _location_times: newValue })}
                    />

                    <TextareaControl
                        label={__('Google Map Embed URL', 'first-church-core-blocks')}
                        help={__('Paste the "src" URL from the Google Maps Embed iframe.', 'first-church-core-blocks')}
                        value={mapEmbed}
                        onChange={(newValue) => setMeta({ ...meta, _location_map_embed: newValue })}
                    />

                </div>
            </PanelRow>
        </PluginDocumentSettingPanel>
    );
};

registerPlugin('firstchurch-location-settings', {
    render: LocationSettingsPanel,
    icon: 'location-alt'
});
