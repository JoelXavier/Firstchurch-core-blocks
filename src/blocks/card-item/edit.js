import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { label, title, linkUrl, linkText, mediaId, mediaUrl } = attributes;

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

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Content Settings', 'antigravity-core')}>
                    <TextControl
                        label={__('Link URL', 'antigravity-core')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                    />
                    <TextControl
                        label={__('Button Text', 'antigravity-core')}
                        value={linkText}
                        onChange={(value) => setAttributes({ linkText: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...useBlockProps({ className: 'antigravity-card-item' }) }>
                <div className="card-link-wrapper">
                    
                    {/* Image Area */}
                    <div className="card-image-container">
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
                                                    className="card-image" 
                                                />
                                                <Button 
                                                    onClick={open}
                                                    variant="secondary"
                                                    className="has-icon"
                                                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                                                >
                                                    {__('Replace', 'antigravity-core')}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button 
                                                onClick={open}
                                                variant="secondary"
                                                className="editor-media-placeholder"
                                                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                {__('Upload Image', 'antigravity-core')}
                                            </Button>
                                        )}
                                    </>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>

                    <div className="card-content">
                        {/* Label */}
                        <RichText
                            tagName="span"
                            className="card-label"
                            value={label}
                            onChange={(value) => setAttributes({ label: value })}
                            placeholder={__('LABEL', 'antigravity-core')}
                            allowedFormats={[]} // Plain text only
                        />

                        {/* Title */}
                        <RichText
                            tagName="h3"
                            className="card-title"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder={__('Enter Title...', 'antigravity-core')}
                        />

                        <span className="card-cta">{linkText}</span>
                        
                        <div className="card-bottom-border"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
