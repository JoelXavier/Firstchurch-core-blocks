import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, BaseControl } from '@wordpress/components';
import { Location } from '../../components/Location/Location';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { heading, subHeading, addressLines, schedule, mapEmbedIframe } = attributes;

    // Helper to update specific address line
    const updateAddressLine = (index, value) => {
        const newAddress = [...addressLines];
        newAddress[index] = value;
        setAttributes({ addressLines: newAddress });
    };

    // Helper to add address line
    const addAddressLine = () => {
        setAttributes({ addressLines: [...addressLines, ''] });
    };

    // Helper to remove address line
    const removeAddressLine = (index) => {
        const newAddress = [...addressLines];
        newAddress.splice(index, 1);
        setAttributes({ addressLines: newAddress });
    };

    // Helper to update schedule item
    const updateScheduleItem = (index, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setAttributes({ schedule: newSchedule });
    };

    // Helper to add schedule item
    const addScheduleItem = () => {
        setAttributes({ 
            schedule: [...schedule, { label: 'Day', time: 'Time' }] 
        });
    };

    // Helper to remove schedule item
    const removeScheduleItem = (index) => {
        const newSchedule = [...schedule];
        newSchedule.splice(index, 1);
        setAttributes({ schedule: newSchedule });
    };

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Location Content', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Heading', 'first-church-core-blocks')}
                        value={heading}
                        onChange={(val) => setAttributes({ heading: val })}
                    />
                    <TextControl
                        label={__('Sub Heading', 'first-church-core-blocks')}
                        value={subHeading}
                        onChange={(val) => setAttributes({ subHeading: val })}
                    />
                </PanelBody>

                <PanelBody title={__('Address', 'first-church-core-blocks')}>
                    {addressLines.map((line, index) => (
                        <div key={index} style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
                            <TextControl
                                value={line}
                                onChange={(val) => updateAddressLine(index, val)}
                            />
                            <Button isDestructive isSmall onClick={() => removeAddressLine(index)}>X</Button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={addAddressLine}>Add Line</Button>
                </PanelBody>

                <PanelBody title={__('Schedule', 'first-church-core-blocks')}>
                    {schedule.map((item, index) => (
                        <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
                            <TextControl
                                label="Day / Label"
                                value={item.label}
                                onChange={(val) => updateScheduleItem(index, 'label', val)}
                            />
                            <TextControl
                                label="Time / Details"
                                value={item.time}
                                onChange={(val) => updateScheduleItem(index, 'time', val)}
                            />
                            <Button isDestructive isSmall variant="link" onClick={() => removeScheduleItem(index)}>Remove Item</Button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={addScheduleItem}>Add Schedule Item</Button>
                </PanelBody>

                <PanelBody title={__('Map Settings', 'first-church-core-blocks')}>
                    <TextareaControl
                        label={__('Google Maps Embed Code (Iframe)', 'first-church-core-blocks')}
                        help={__('Paste the full <iframe> code from Google Maps > Share > Embed a map.', 'first-church-core-blocks')}
                        value={mapEmbedIframe}
                        onChange={(val) => setAttributes({ mapEmbedIframe: val })}
                        rows={6}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Render Preview */}
            <Location 
                heading={heading}
                subHeading={subHeading}
                addressLines={addressLines}
                schedule={schedule}
                mapEmbedIframe={mapEmbedIframe}
            />
        </div>
    );
}
