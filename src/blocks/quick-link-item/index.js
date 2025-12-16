import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import metadata from './block.json';

function Edit({ attributes, setAttributes }) {
    const { label, url, mediaId, mediaUrl } = attributes;
    
    // We apply the main class. Note that in Editor we use a div, while render uses 'a'.
    const blockProps = useBlockProps({ className: 'fc-quick-link-item' });

    const onSelectMedia = (media) => {
        setAttributes({
            mediaId: media.id,
            mediaUrl: media.url
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Link Settings', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Link URL', 'first-church-core-blocks')}
                        value={url}
                        onChange={(value) => setAttributes({ url: value })}
                    />
                     <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectMedia}
                            allowedTypes={['image']}
                            value={mediaId}
                            render={({ open }) => (
                                <Button variant="secondary" onClick={open}>
                                    { mediaId ? __('Replace Image', 'first-church-core-blocks') : __('Upload Image', 'first-church-core-blocks') }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                {/* Visual Representation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    
                    {/* Image Circle */}
                    <div className="fc-quick-link-item__image-wrapper" style={{ width: 60, height: 60, flexShrink: 0 }}>
                        { mediaUrl ? (
                            <img src={mediaUrl} alt="" className="fc-quick-link-item__image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '10px' }}>
                                IMG
                            </div>
                        )}
                    </div>

                    {/* Text */}
                    <div className="fc-quick-link-item__content">
                        <RichText
                            tagName="span"
                            className="fc-quick-link-item__label"
                            value={label}
                            onChange={ ( value ) => setAttributes( { label: value } ) }
                            placeholder={ __( 'Link Label', 'first-church-core-blocks' ) }
                            allowedFormats={ [] } // Plain text only
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null // Dynamic
});
