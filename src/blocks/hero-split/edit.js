import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl, ColorPalette } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { 
        label, title, linkText, linkUrl, 
        imageId, imageUrl, imagePosition,
        backgroundColor, textColor, linkColor
    } = attributes;

    const onSelectImage = (media) => {
        setAttributes({
            imageId: media.id,
            imageUrl: media.url
        });
    };

    const blockProps = useBlockProps({
        className: `antigravity-hero-split ${imagePosition === 'right' ? 'image-right' : ''} aspect-ratio-${attributes.imageAspectRatio}`,
        style: {
            '--hero-split-bg': backgroundColor,
            '--hero-split-text': textColor,
            '--hero-split-link': linkColor
        }
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout', 'antigravity-core')}>
                    <SelectControl
                        label={__('Image Position', 'antigravity-core')}
                        value={imagePosition}
                        options={[
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ imagePosition: value })}
                    />
                    <SelectControl
                        label={__('Image Aspect Ratio', 'antigravity-core')}
                        value={attributes.imageAspectRatio}
                        options={[
                            { label: 'Landscape (16:9)', value: 'landscape' },
                            { label: 'Portrait (3:4)', value: 'portrait' },
                            { label: 'Square (1:1)', value: 'square' },
                        ]}
                        onChange={(value) => setAttributes({ imageAspectRatio: value })}
                        help={__('Controls the shape of the image area.', 'antigravity-core')}
                    />
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <Button variant="secondary" onClick={open}>
                                    { imageId ? __('Replace Image', 'antigravity-core') : __('Upload Image', 'antigravity-core') }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                </PanelBody>

                <PanelColorSettings 
                    title={__('Colors', 'antigravity-core')}
                    colorSettings={[
                        {
                            value: backgroundColor,
                            onChange: (value) => setAttributes({ backgroundColor: value }),
                            label: __('Background Color', 'antigravity-core')
                        },
                        {
                            value: textColor,
                            onChange: (value) => setAttributes({ textColor: value }),
                            label: __('Text Color', 'antigravity-core')
                        },
                        {
                            value: linkColor,
                            onChange: (value) => setAttributes({ linkColor: value }),
                            label: __('Link Color', 'antigravity-core')
                        }
                    ]}
                />
                
                <PanelBody title={__('Link Settings', 'antigravity-core')}>
                     <TextControl
                        label={__('Link URL', 'antigravity-core')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                {/* Image Side */}
                <div className="hero-split-image-wrapper">
                    { imageUrl ? (
                        <img src={imageUrl} alt="" className="hero-split-image" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            {__('Select Image', 'antigravity-core')}
                        </div>
                    )}
                </div>

                {/* Content Side */}
                <div className="hero-split-content">
                    <RichText
                        tagName="span"
                        className="hero-split-label"
                        value={label}
                        onChange={(value) => setAttributes({ label: value })}
                        placeholder={__('Label', 'antigravity-core')}
                    />

                    <RichText
                        tagName="h2"
                        className="hero-split-title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Headline...', 'antigravity-core')}
                    />
                    
                    <div className="hero-split-link" style={{ cursor: 'text' }}>
                        <RichText
                            tagName="span"
                            value={linkText}
                            onChange={(value) => setAttributes({ linkText: value })}
                            placeholder={__('Button Text', 'antigravity-core')}
                            allowedFormats={[]}
                        />
                        {/* Static Arrow in Editor for visual fidelity */}
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                    </div>

                    <div className="hero-split-bar"></div>
                </div>
            </div>
        </>
    );
}
