import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaPlaceholder, BlockControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, Button, ToolbarButton, ToggleControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    // Ensure images is ALWAYS an array (handle null vs undefined)
    const images = Array.isArray(attributes.images) ? attributes.images : [];
    const speed = attributes.speed || 30;
    const direction = attributes.direction || 'left';
    const zigzag = attributes.zigzag || false;

    const blockProps = useBlockProps({
        className: `fc-marquee fc-marquee--${direction} ${zigzag ? 'fc-marquee--zigzag' : ''}`
    });

    const onSelectImages = (newImages) => {
        if (!newImages || !Array.isArray(newImages)) return;
        
        // Map to simple objects
        const mappedImages = newImages.map(img => ({
            id: img.id,
            url: img.sizes?.large?.url || img.url,
            alt: img.alt || '',
            width: img.sizes?.large?.width || img.width, 
            height: img.sizes?.large?.height || img.height,
        }));
        setAttributes({ images: mappedImages });
    };

    const addToGallery = (newImages) => {
         const mappedImages = newImages.map(img => ({
            id: img.id,
            url: img.sizes?.large?.url || img.url,
            alt: img.alt,
             width: img.sizes?.large?.width || img.width,
            height: img.sizes?.large?.height || img.height,
        }));
        setAttributes({ images: [...images, ...mappedImages] });
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Settings', 'first-church-core-blocks')}>
                    <RangeControl
                        label={__('Animation Speed (Seconds)', 'first-church-core-blocks')}
                        value={speed}
                        onChange={(value) => setAttributes({ speed: value })}
                        min={5}
                        max={60}
                    />
                     <SelectControl
                        label={__('Direction', 'first-church-core-blocks')}
                        value={direction}
                        options={[
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ direction: value })}
                    />
                    <ToggleControl
                        label={__('Zigzag Layout', 'first-church-core-blocks')}
                        checked={attributes.zigzag}
                        onChange={(value) => setAttributes({ zigzag: value })}
                    />
                    <ToggleControl
                        label={__('Black & White Mode', 'first-church-core-blocks')}
                        help={__('If enabled, images are B&W until hovered.', 'first-church-core-blocks')}
                        checked={attributes.grayscale !== false} // Default true
                        onChange={(value) => setAttributes({ grayscale: value })}
                    />
                </PanelBody>
            </InspectorControls>

            {(!images || images.length === 0) ? (
                <div className="fc-marquee__placeholder">
                    <MediaPlaceholder
                        icon="images-alt2"
                        labels={{
                            title: __('Marquee Gallery', 'first-church-core-blocks'),
                            instructions: __('Upload or select images for the marquee.', 'first-church-core-blocks'),
                        }}
                        onSelect={onSelectImages}
                        accept="image/*"
                        multiple
                    />
                </div>
            ) : (
                <div className="fc-marquee__preview">
                      <div className="fc-marquee__preview-toolbar" style={{marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <strong>{images.length} images selected</strong>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={onSelectImages}
                                    allowedTypes={['image']}
                                    multiple
                                    gallery
                                    value={images.map((img) => img.id)}
                                    render={({ open }) => (
                                        <Button variant="secondary" onClick={open}>
                                            {__('Edit Selection', 'first-church-core-blocks')}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>
                      </div>

                    <div className="fc-marquee__track-preview" style={{ 
                        display: 'flex', 
                        gap: '2rem', 
                        overflow: 'hidden', 
                        opacity: 0.6 
                    }}>
                        {/* Static preview of first few images */}
                        {images.slice(0, 5).map((img, index) => (
                            <img key={index} src={img.url} alt={img.alt} style={{height: '80px', width: 'auto', objectFit: 'contain'}} />
                        ))}
                        {images.length > 5 && <span>...</span>}
                    </div>
                </div>
            )}
        </div>
    );
}
