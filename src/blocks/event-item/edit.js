import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, Button, DatePicker } from '@wordpress/components';
import { EventCard } from '../../components/EventCard/EventCard';
import './style.scss'; // Ensure styles load in editor

export default function Edit({ attributes, setAttributes }) {
    const { 
        title, label, location, dateStart, dateEnd, isCanceled, 
        mediaUrl, mediaId, ctaText, ctaUrl, schedule 
    } = attributes;

    const onSelectMedia = (media) => {
        setAttributes({
            mediaUrl: media.url,
            mediaId: media.id,
        });
    };

    // Helper to parse newline text into array for schedule
    const updateSchedule = (val) => {
        setAttributes({ schedule: val.split('\n') });
    };

    // Parse schedule array back to string for textarea
    const scheduleString = (schedule || []).join('\n');

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Event Details', 'antigravity-core-blocks')}>
                    <TextControl
                        label="Label (Type)"
                        value={label}
                        onChange={(val) => setAttributes({ label: val })}
                        help="e.g. Convocation, Worship, Community"
                    />
                    <TextControl
                        label="Title"
                        value={title}
                        onChange={(val) => setAttributes({ title: val })}
                    />
                    <TextControl
                        label="Location"
                        value={location}
                        onChange={(val) => setAttributes({ location: val })}
                    />
                    <ToggleControl
                        label="Is Canceled?"
                        checked={isCanceled}
                        onChange={(val) => setAttributes({ isCanceled: val })}
                    />
                </PanelBody>

                <PanelBody title={__('Date Selection', 'antigravity-core-blocks')} initialOpen={false}>
                    <p><strong>Start Date</strong></p>
                    <DatePicker
                        currentDate={dateStart}
                        onChange={(val) => setAttributes({ dateStart: val })}
                    />
                    <hr />
                    <ToggleControl
                        label="Add End Date (Range)"
                        checked={!!dateEnd}
                        onChange={(val) => setAttributes({ dateEnd: val ? dateStart : null })} 
                    />
                    {dateEnd && (
                        <>
                            <p style={{ marginTop: '10px' }}><strong>End Date</strong></p>
                            <DatePicker
                                currentDate={dateEnd}
                                onChange={(val) => setAttributes({ dateEnd: val })}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Complex Schedule', 'antigravity-core-blocks')} initialOpen={false}>
                     <TextareaControl
                        label="Schedule Lines"
                        value={scheduleString}
                        onChange={updateSchedule}
                        help="Enter each schedule item on a new line (e.g. 'Fri 7pm - Worship'). Replaces standard time display."
                        rows={5}
                     />
                </PanelBody>

                <PanelBody title={__('Media (Optional)', 'antigravity-core-blocks')} initialOpen={false}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectMedia}
                            value={mediaId}
                            allowedTypes={['image']}
                            render={({ open }) => (
                                <Button variant="secondary" onClick={open}>
                                    {mediaId ? 'Replace Image' : 'Select Image'}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    {mediaUrl && (
                        <div style={{ marginTop: '10px' }}>
                             <img src={mediaUrl} alt="preview" style={{ maxWidth: '100%' }} />
                             <Button isLink isDestructive onClick={() => setAttributes({ mediaId: 0, mediaUrl: '' })}>Remove</Button>
                        </div>
                    )}
                </PanelBody>

                <PanelBody title={__('Action / Link', 'antigravity-core-blocks')} initialOpen={false}>
                    <TextControl
                        label="Button Text"
                        value={ctaText}
                        onChange={(val) => setAttributes({ ctaText: val })}
                    />
                    <TextControl
                        label="Button URL"
                        value={ctaUrl}
                        onChange={(val) => setAttributes({ ctaUrl: val })}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Live Preview using the Shared Component */}
            <EventCard
                title={title}
                label={label}
                location={location}
                startDate={dateStart || new Date().toISOString()} // Fallback for preview
                endDate={dateEnd}
                isCanceled={isCanceled}
                mediaUrl={mediaUrl}
                linkText={ctaText}
                linkUrl="#" // Disable links in editor
                schedule={schedule}
            />
        </div>
    );
}
