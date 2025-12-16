/**
 * Event Settings Sidebar
 * Adds a "Event Details" panel to the Document settings for 'event' post type.
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, DateTimePicker, TextControl, ToggleControl, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const EventSettingsPanel = () => {
    // Only show on 'event' post type
    const postType = useSelect((select) => select('core/editor').getCurrentPostType());

    if (postType !== 'event') {
        return null;
    }

    // Connect to Meta
    // Note: 'meta' is nested props, useEntityProp handles it if meta key is registered.
    const [meta, setMeta] = useEntityProp('postType', 'event', 'meta');
    
    const startDate = meta['_event_start_date'];

    return (
        <PluginDocumentSettingPanel
            name="firstchurch-event-settings"
            title={__('Event Settings', 'first-church-core-blocks')}
            icon="calendar-alt"
        >
            <PanelRow>
                <div style={{ width: '100%' }}>
                    <p><strong>{__('Start Date & Time', 'first-church-core-blocks')}</strong></p>
                    <DateTimePicker
                        currentDate={startDate}
                        onChange={(newDate) => setMeta({ ...meta, _event_start_date: newDate })}
                        is12Hour={true}
                    />
                </div>
            </PanelRow>

            <PanelRow>
                <div style={{ width: '100%' }}>
                    <p><strong>{__('End Date & Time (Optional)', 'first-church-core-blocks')}</strong></p>
                    <DateTimePicker
                        currentDate={meta['_event_end_date']}
                        onChange={(newDate) => setMeta({ ...meta, _event_end_date: newDate })}
                        is12Hour={true}
                    />
                </div>
            </PanelRow>

            <PanelRow>
                <TextControl
                    label={__('Event Label', 'first-church-core-blocks')}
                    help={__('e.g. "Worship", "Concert", "Outreach"', 'first-church-core-blocks')}
                    value={meta['_event_label'] || ''}
                    onChange={(newValue) => setMeta({ ...meta, _event_label: newValue })}
                />
            </PanelRow>

            <PanelRow>
                <TextControl
                    label={__('Location', 'first-church-core-blocks')}
                    value={meta['_event_location'] || ''}
                    onChange={(newValue) => setMeta({ ...meta, _event_location: newValue })}
                />
            </PanelRow>

            <PanelRow>
                <TextControl
                    label={__('CTA Text', 'first-church-core-blocks')}
                    help={__('Button text. Default: "Get Tickets"', 'first-church-core-blocks')}
                    value={meta['_event_cta_text'] || ''}
                    onChange={(newValue) => setMeta({ ...meta, _event_cta_text: newValue })}
                />
            </PanelRow>

             <PanelRow>
                <TextControl
                    label={__('CTA URL', 'first-church-core-blocks')}
                    help={__('External link for tickets. If empty, links to the event page.', 'first-church-core-blocks')}
                    value={meta['_event_cta_url'] || ''}
                    onChange={(newValue) => setMeta({ ...meta, _event_cta_url: newValue })}
                />
            </PanelRow>



            <PanelRow>
                <div style={{ width: '100%', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                    <p><strong>{__('Event Schedule', 'first-church-core-blocks')}</strong></p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Add specific times for multi-day events.</p>
                    
                    {/* Schedule Repeater */}
                    {(meta['_event_schedule'] || []).map((item, index) => (
                        <div key={index} style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                            <TextControl
                                label="Time"
                                value={item.time}
                                onChange={(val) => {
                                    const newSchedule = [...(meta['_event_schedule'] || [])];
                                    newSchedule[index] = { ...newSchedule[index], time: val };
                                    setMeta({ ...meta, _event_schedule: newSchedule });
                                }}
                            />
                            <TextControl
                                label="Activity"
                                value={item.activity}
                                onChange={(val) => {
                                    const newSchedule = [...(meta['_event_schedule'] || [])];
                                    newSchedule[index] = { ...newSchedule[index], activity: val };
                                    setMeta({ ...meta, _event_schedule: newSchedule });
                                }}
                            />
                            <Button 
                                isDestructive 
                                variant="link"
                                onClick={() => {
                                    const newSchedule = [...(meta['_event_schedule'] || [])];
                                    newSchedule.splice(index, 1);
                                    setMeta({ ...meta, _event_schedule: newSchedule });
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    <Button 
                        variant="secondary" 
                        onClick={() => {
                            const newSchedule = [...(meta['_event_schedule'] || []), { time: '', activity: '' }];
                            setMeta({ ...meta, _event_schedule: newSchedule });
                        }}
                    >
                        + Add Schedule Item
                    </Button>
                </div>
            </PanelRow>
        </PluginDocumentSettingPanel>
    );
};

registerPlugin('firstchurch-event-settings', {
    render: EventSettingsPanel,
    icon: 'calendar-alt'
});
