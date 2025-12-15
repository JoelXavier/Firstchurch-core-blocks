import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, Button } from '@wordpress/components';
import { Hero } from '../../components/Hero/Hero';
import './editor.scss';

// Locked Template Definition
const HERO_TEMPLATE = [
    ['core/heading', { level: 2, placeholder: 'Hero Title', content: 'Hero Title', style: { typography: { textTransform: 'uppercase', letterSpacing: '1px' } }, textColor: 'white' }],
    ['core/heading', { level: 1, placeholder: 'Main Headline', content: 'Write Your Headline Here', textColor: 'white' }],
    ['core/paragraph', { placeholder: 'Short description...', content: 'Add a short description or subtitle here.', textColor: 'white' }],
    ['core/buttons', {}, [
        ['core/button', { placeholder: 'Call to Action', text: 'Learn More', backgroundColor: 'primary' }]
    ]]
];

const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph', 'core/buttons', 'core/button'];

export default function Edit({ attributes, setAttributes }) {
    const { mode, layout, media, overlayOpacity } = attributes;

    const onSelectMedia = (newMedia) => {
        // Append new media to array
        // We handle single vs multiple in the UI logic below
        // For simplicity in this v1, let's just use the MediaUpload to build the array
        const mediaConfig = {
            id: newMedia.id,
            url: newMedia.url,
            alt: newMedia.alt
        };
        
        if (mode === 'static') {
            setAttributes({ media: [mediaConfig] });
        } else {
            setAttributes({ media: [...media, mediaConfig] });
        }
    };

    const removeMedia = (index) => {
        const newMedia = [...media];
        newMedia.splice(index, 1);
        setAttributes({ media: newMedia });
    };

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'antigravity-core-blocks')}>
                    <SelectControl
                        label={__('Function Mode', 'antigravity-core-blocks')}
                        value={mode}
                        options={[
                            { label: 'Static Image', value: 'static' },
                            { label: 'Slideshow', value: 'slideshow' },
                        ]}
                        onChange={(val) => setAttributes({ mode: val, media: [] })} // Reset media on mode switch for safety
                    />
                    <SelectControl
                        label={__('Content Placement', 'antigravity-core-blocks')}
                        value={layout}
                        options={[
                            { label: 'Bottom Left (Immersive)', value: 'bottom-left' },
                            { label: 'Middle Left (Immersive)', value: 'middle-left' },
                            { label: 'Center (Focused)', value: 'center' },
                        ]}
                        onChange={(val) => setAttributes({ layout: val })}
                    />
                    <RangeControl
                        label={__('Overlay Opacity', 'antigravity-core-blocks')}
                        value={overlayOpacity}
                        onChange={(val) => setAttributes({ overlayOpacity: val })}
                        min={0}
                        max={100}
                    />
                </PanelBody>

                <PanelBody title={__('Background Media', 'antigravity-core-blocks')}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectMedia}
                            allowedTypes={['image']}
                            value={media.length > 0 ? media[0].id : null}
                            render={({ open }) => (
                                <div>
                                    {media.map((item, index) => (
                                        <div key={index} style={{ marginBottom: '10px', position: 'relative' }}>
                                            <img src={item.url} alt="Thumbnail" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                            <Button 
                                                isDestructive 
                                                variant="link" 
                                                onClick={() => removeMedia(index)}
                                                style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.8)' }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    {(mode === 'slideshow' || media.length === 0) && (
                                        <Button variant="secondary" onClick={open}>
                                            {mode === 'static' ? 'Upload Background' : 'Add Slide'}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                </PanelBody>
            </InspectorControls>

            {/* Preview in Editor */}
            <Hero 
                mode={mode} 
                layout={layout} 
                media={media} 
                overlayOpacity={overlayOpacity}
            >
                {/* 
                   We nest InnerBlocks inside the Hero component.
                   The Hero component renders {children} inside the .content div.
                */}
                <InnerBlocks 
                    template={HERO_TEMPLATE}
                    templateLock="all"
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </Hero>
        </div>
    );
}
