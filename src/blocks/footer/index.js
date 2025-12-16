import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './style.scss'; // Import for editor AND frontend styles (via build process)
import '../../components/Footer/Footer.scss'; // Ensure component styles are loaded in editor

// Social Icon Picker (Simplified for now - fixed list of networks)
const SocialLinksControl = ({ values, onChange }) => {
    // Helper to update a specific social link
    const updateLink = (index, key, newVal) => {
        const newLinks = [...values];
        newLinks[index] = { ...newLinks[index], [key]: newVal };
        onChange(newLinks);
    };

    return (
        <div className="social-links-control">
            {values.map((link, index) => (
                <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                    <strong>{link.label}</strong>
                    <TextControl
                        label="URL"
                        value={link.url}
                        onChange={(val) => updateLink(index, 'url', val)}
                        help={`Link for ${link.label}`}
                    />
                </div>
            ))}
        </div>
    );
};

registerBlockType('antigravity/footer', {
    edit: ({ attributes, setAttributes }) => {
        const { logoId, logoUrl, logoTextPrimary, logoTextSecondary, missionText, copyrightText, socialLinks } = attributes;

        const blockProps = useBlockProps({
            className: 'antigravity-footer' // Match the component class
        });

        const TEMPLATE = [
            ['antigravity/footer-column', { title: 'The Church' }, [['core/list', {}, [['core/list-item', { content: 'Our History' }]]]]],
            ['antigravity/footer-column', { title: 'Ministries' }, [['core/list', {}]]],
            ['antigravity/footer-column', { title: 'Connect' }, [['core/list', {}]]],
            ['antigravity/footer-column', { title: 'Give' }, [['core/list', {}]]],
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title="Branding">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => setAttributes({ logoId: media.id, logoUrl: media.url })}
                                allowedTypes={['image']}
                                value={logoId}
                                render={({ open }) => (
                                    <BaseControl label="Logo">
                                        {logoUrl ? (
                                            <>
                                                <img src={logoUrl} alt="Logo" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px', background: '#333', padding: '10px' }} />
                                                <Button onClick={open} variant="secondary">Replace Logo</Button>
                                                <Button onClick={() => setAttributes({ logoId: undefined, logoUrl: undefined })} isDestructive variant="link">Remove</Button>
                                            </>
                                        ) : (
                                            <Button onClick={open} variant="primary">Upload Logo</Button>
                                        )}
                                    </BaseControl>
                                )}
                            />
                        </MediaUploadCheck>
                        <TextControl
                            label="Primary Brand Text"
                            value={logoTextPrimary}
                            onChange={(val) => setAttributes({ logoTextPrimary: val })}
                        />
                        <TextControl
                            label="Secondary Brand Text"
                            value={logoTextSecondary}
                            onChange={(val) => setAttributes({ logoTextSecondary: val })}
                        />
                    </PanelBody>
                    <PanelBody title="Content">
                        <TextareaControl
                            label="Mission Statement"
                            value={missionText}
                            onChange={(val) => setAttributes({ missionText: val })}
                        />
                         <TextControl
                            label="Copyright Text"
                            value={copyrightText}
                            onChange={(val) => setAttributes({ copyrightText: val })}
                        />
                    </PanelBody>
                    <PanelBody title="Social Links">
                        <SocialLinksControl 
                            values={socialLinks} 
                            onChange={(newLinks) => setAttributes({ socialLinks: newLinks })} 
                        />
                    </PanelBody>
                </InspectorControls>

                <footer {...blockProps}>
                    <div className="footer-content">
                        {/* Fake Brand Col for Editor Context */}
                        <div className="footer-brand-col">
                             <div className="footer-logo">
                                {logoUrl && <img src={logoUrl} alt="Logo" />}
                                <div className="footer-logo-text">
                                    <span className="primary">{logoTextPrimary}</span>
                                    <span className="secondary">{logoTextSecondary}</span>
                                </div>
                             </div>
                             <p className="footer-mission">{missionText}</p>
                        </div>

                        {/* Editable Grid */}
                        <div className="footer-nav-grid" style={{ flex: 2 }}>
                            <InnerBlocks 
                                template={TEMPLATE} 
                                allowedBlocks={['antigravity/footer-column']}
                                templateLock={false} // Allow adding/removing columns if needed, though 4 is standard
                            />
                        </div>
                    </div>
                     <div className="footer-bottom">
                         <div className="footer-bottom-inner">
                             <div className="footer-copyright">{copyrightText}</div>
                             <div className="footer-socials">
                                 {/* Visual placeholder for socials */}
                                 <span style={{opacity: 0.5}}>(Social Icons will render on frontend)</span>
                             </div>
                         </div>
                     </div>
                </footer>
            </>
        );
    },
    save: () => {
        return <InnerBlocks.Content />;
    }
});
