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

    // Build class string
    let className = 'fc-hero-split';
    if (imagePosition === 'right') {
        className += ' fc-hero-split--right';
    }
    if (attributes.imageAspectRatio === 'portrait') {
        className += ' fc-hero-split--portrait';
    } else if (attributes.imageAspectRatio === 'square') {
        className += ' fc-hero-split--square';
    }

    const blockProps = useBlockProps({
        className: className,
        style: {
            '--hero-split-bg': backgroundColor,
            '--hero-split-text': textColor,
            '--hero-split-link': linkColor
        }
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout', 'first-church-core-blocks')}>
                    <SelectControl
                        label={__('Image Position', 'first-church-core-blocks')}
                        value={imagePosition}
                        options={[
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ imagePosition: value })}
                    />
                    <SelectControl
                        label={__('Image Aspect Ratio', 'first-church-core-blocks')}
                        value={attributes.imageAspectRatio}
                        options={[
                            { label: 'Landscape (16:9)', value: 'landscape' },
                            { label: 'Portrait (3:4)', value: 'portrait' },
                            { label: 'Square (1:1)', value: 'square' },
                        ]}
                        onChange={(value) => setAttributes({ imageAspectRatio: value })}
                        help={__('Controls the shape of the image area.', 'first-church-core-blocks')}
                    />
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <Button variant="secondary" onClick={open}>
                                    { imageId ? __('Replace Image', 'first-church-core-blocks') : __('Upload Image', 'first-church-core-blocks') }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                </PanelBody>

                <PanelColorSettings 
                    title={__('Colors', 'first-church-core-blocks')}
                    colorSettings={[
                        {
                            value: backgroundColor,
                            onChange: (value) => setAttributes({ backgroundColor: value }),
                            label: __('Background Color', 'first-church-core-blocks')
                        },
                        {
                            value: textColor,
                            onChange: (value) => setAttributes({ textColor: value }),
                            label: __('Text Color', 'first-church-core-blocks')
                        },
                        {
                            value: linkColor,
                            onChange: (value) => setAttributes({ linkColor: value }),
                            label: __('Link Color', 'first-church-core-blocks')
                        }
                    ]}
                />
                
                <PanelBody title={__('Link Settings', 'first-church-core-blocks')}>
                     <TextControl
                        label={__('Link URL', 'first-church-core-blocks')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                {/* Image Side */}
                <div className="fc-hero-split__media">
                    { imageUrl ? (
                        <img src={imageUrl} alt="" className="fc-hero-split__image" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            {__('Select Image', 'first-church-core-blocks')}
                        </div>
                    )}
                </div>

                {/* Content Side */}
                <div className="fc-hero-split__content">
                    <RichText
                        tagName="span"
                        className="fc-hero-split__label"
                        value={label}
                        onChange={(value) => setAttributes({ label: value })}
                        placeholder={__('Label', 'first-church-core-blocks')}
                    />

                    <RichText
                        tagName="h2"
                        className="fc-hero-split__title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Headline...', 'first-church-core-blocks')}
                    />
                    
                    <div className="fc-hero-split__link" style={{ cursor: 'text' }}>
                        <RichText
                            tagName="span"
                            value={linkText}
                            onChange={(value) => setAttributes({ linkText: value })}
                            placeholder={__('Button Text', 'first-church-core-blocks')}
                            allowedFormats={[]}
                        />
                        {/* Static Arrow in Editor for visual fidelity */}
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                    </div>

                    <div className="fc-hero-split__bar"></div>
                </div>
            </div>
        </>
    );
}
