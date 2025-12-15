import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import metadata from './block.json';

function Edit({ attributes, setAttributes }) {
    const { label, url, mediaId, mediaUrl } = attributes;
    
    // We intentionally don't apply the 'quick-link-item' class to the wrapper
    // because that class is an <a> tag in CSS, which breaks the Editor DIV.
    // Instead we recreate the visual structure inside.
    const blockProps = useBlockProps({ className: 'quick-link-item-editor' });

    const onSelectMedia = (media) => {
        setAttributes({
            mediaId: media.id,
            mediaUrl: media.url
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Link Settings', 'antigravity-core')}>
                    <TextControl
                        label={__('Link URL', 'antigravity-core')}
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
                                    { mediaId ? __('Replace Image', 'antigravity-core') : __('Upload Image', 'antigravity-core') }
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
                    <div className="quick-link-image-wrapper" style={{ width: 60, height: 60, flexShrink: 0 }}>
                        { mediaUrl ? (
                            <img src={mediaUrl} alt="" className="quick-link-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '10px' }}>
                                IMG
                            </div>
                        )}
                    </div>

                    {/* Text */}
                    <div className="quick-link-content">
                        <RichText
                            tagName="span"
                            className="quick-link-label"
                            value={label}
                            onChange={ ( value ) => setAttributes( { label: value } ) }
                            placeholder={ __( 'Link Label', 'antigravity-core' ) }
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
