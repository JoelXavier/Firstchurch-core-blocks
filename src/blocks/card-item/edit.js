import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { 
        label, 
        title, 
        linkUrl, 
        linkText, 
        mediaId, 
        mediaUrl,
        cardLabelColor,
        cardTitleColor,
        cardLinkColor
    } = attributes;

    const onSelectMedia = (media) => {
        setAttributes({
            mediaId: media.id,
            mediaUrl: media.url // or media.sizes.full.url
        });
    };

    const removeMedia = () => {
        setAttributes({
            mediaId: 0,
            mediaUrl: ''
        });
    };

    const style = {
        '--local-card-label-color': cardLabelColor,
        '--local-card-title-color': cardTitleColor,
        '--local-card-link-color': cardLinkColor,
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Content Settings', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Link URL', 'first-church-core-blocks')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                    />
                    <TextControl
                        label={__('Button Text', 'first-church-core-blocks')}
                        value={linkText}
                        onChange={(value) => setAttributes({ linkText: value })}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Text Colors', 'first-church-core-blocks')}
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: cardLabelColor,
                            onChange: (value) => setAttributes({ cardLabelColor: value }),
                            label: __('Label Color', 'first-church-core-blocks'),
                        },
                        {
                            value: cardTitleColor,
                            onChange: (value) => setAttributes({ cardTitleColor: value }),
                            label: __('Title Color', 'first-church-core-blocks'),
                        },
                        {
                            value: cardLinkColor,
                            onChange: (value) => setAttributes({ cardLinkColor: value }),
                            label: __('Button Color', 'first-church-core-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <div { ...useBlockProps({ className: 'fc-card-item', style: style }) }>
                <div className="fc-card-link-wrapper">
                    
                    {/* Image Area */}
                    <div className="fc-card-image-wrapper">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectMedia}
                                value={mediaId}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <>
                                        {mediaUrl ? (
                                            <>
                                                <img 
                                                    src={mediaUrl} 
                                                    alt={title} 
                                                    className="fc-card-image" 
                                                />
                                                <Button 
                                                    onClick={open}
                                                    variant="secondary"
                                                    className="has-icon"
                                                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                                                >
                                                    {__('Replace', 'first-church-core-blocks')}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button 
                                                onClick={open}
                                                variant="secondary"
                                                className="fc-card-image-placeholder"
                                                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                {__('Upload Image', 'first-church-core-blocks')}
                                            </Button>
                                        )}
                                    </>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>

                    <div className="fc-card-content">
                        {/* Label */}
                        <RichText
                            tagName="span"
                            className="fc-card-label"
                            value={label}
                            onChange={(value) => setAttributes({ label: value })}
                            placeholder={__('LABEL', 'first-church-core-blocks')}
                            allowedFormats={[]} // Plain text only
                        />

                        {/* Title */}
                        <RichText
                            tagName="h3"
                            className="fc-card-title"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder={__('Enter Title...', 'first-church-core-blocks')}
                        />

                        <span className="fc-card-cta">{linkText}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
