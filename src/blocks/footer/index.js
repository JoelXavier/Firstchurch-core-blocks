import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, BaseControl, ToggleControl, ExternalLink } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import './style.scss';
import '../../components/Footer/Footer.scss';

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

registerBlockType( 'firstchurch/footer', {
    edit: ({ attributes, setAttributes }) => {
        const { logoId, logoUrl, logoTextPrimary, logoTextSecondary, missionText, copyrightText, socialLinks, useGlobalSync } = attributes;

        const [ globalData ] = useEntityProp( 'root', 'site', 'fc_footer_data' );

        // Helper to get active data (global or local)
        const isSynced = useGlobalSync && globalData;
        const activeData = isSynced ? {
            logoUrl: globalData.logoUrl || logoUrl,
            logoTextPrimary: globalData.logoTextPrimary || logoTextPrimary,
            logoTextSecondary: globalData.logoTextSecondary || logoTextSecondary,
            missionText: globalData.missionText || missionText,
            copyrightText: globalData.copyrightText || copyrightText,
            socialLinks: globalData.socialLinks && globalData.socialLinks.length > 0 ? globalData.socialLinks : socialLinks,
            columns: globalData.columns || []
        } : {
            logoUrl,
            logoTextPrimary,
            logoTextSecondary,
            missionText,
            copyrightText,
            socialLinks,
            columns: [] // Columns handled by InnerBlocks when not synced
        };

        const blockProps = useBlockProps({
            className: `fc-footer ${isSynced ? 'is-synced' : ''}`
        });

        const TEMPLATE = [
            ['firstchurch/footer-column', { title: 'The Church' }, [['core/list', {}, [['core/list-item', { content: 'Our History' }]]]]],
            ['firstchurch/footer-column', { title: 'Ministries' }, [['core/list', {}]]],
            ['firstchurch/footer-column', { title: 'Connect' }, [['core/list', {}]]],
            ['firstchurch/footer-column', { title: 'Give' }, [['core/list', {}]]],
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Global Synchronization', 'first-church-core-blocks')}>
                         <ToggleControl
                            label={__('Sync with Global Footer', 'first-church-core-blocks')}
                            checked={useGlobalSync}
                            onChange={(val) => setAttributes({ useGlobalSync: val })}
                            help={__('When enabled, this footer will use the site-wide settings managed in Mission Control.', 'first-church-core-blocks')}
                        />
                        {useGlobalSync && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
                                <ExternalLink href="admin.php?page=first-church-mission-control">
                                    {__('Manage Global Footer Data', 'first-church-core-blocks')}
                                </ExternalLink>
                            </div>
                        )}
                    </PanelBody>

                    {!isSynced && (
                        <>
                            <PanelBody title={__('Branding', 'first-church-core-blocks')}>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) => setAttributes({ logoId: media.id, logoUrl: media.url })}
                                        allowedTypes={['image']}
                                        value={logoId}
                                        render={({ open }) => (
                                            <BaseControl label="Logo">
                                                {activeData.logoUrl ? (
                                                    <>
                                                        <img src={activeData.logoUrl} alt="Logo" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px', background: '#333', padding: '10px' }} />
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
                                    value={activeData.logoTextPrimary}
                                    onChange={(val) => setAttributes({ logoTextPrimary: val })}
                                />
                                <TextControl
                                    label="Secondary Brand Text"
                                    value={activeData.logoTextSecondary}
                                    onChange={(val) => setAttributes({ logoTextSecondary: val })}
                                />
                            </PanelBody>
                            <PanelBody title={__('Content', 'first-church-core-blocks')}>
                                <TextareaControl
                                    label="Mission Statement"
                                    value={activeData.missionText}
                                    onChange={(val) => setAttributes({ missionText: val })}
                                />
                                <TextControl
                                    label="Copyright Text"
                                    value={activeData.copyrightText}
                                    onChange={(val) => setAttributes({ copyrightText: val })}
                                />
                            </PanelBody>
                            <PanelBody title={__('Social Links', 'first-church-core-blocks')}>
                                <SocialLinksControl 
                                    values={activeData.socialLinks} 
                                    onChange={(newLinks) => setAttributes({ socialLinks: newLinks })} 
                                />
                            </PanelBody>
                        </>
                    )}
                </InspectorControls>

                <footer {...blockProps}>
                    {isSynced && (
                        <div className="fc-footer-sync-indicator" style={{ position: 'absolute', top: '10px', right: '10px', background: '#d6a04c', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', zIndex: 10 }}>
                            {__('SYNCED TO GLOBAL', 'first-church-core-blocks')}
                        </div>
                    )}

                    <div className="fc-footer__content">
                        <div className="fc-footer__brand-col">
                             <div className="fc-footer__logo">
                                {activeData.logoUrl && <img src={activeData.logoUrl} alt="Logo" />}
                                <div className="fc-footer__logo-text">
                                    <span className="primary">{activeData.logoTextPrimary}</span>
                                    <span className="secondary">{activeData.logoTextSecondary}</span>
                                </div>
                             </div>
                             <p className="fc-footer__mission">{activeData.missionText}</p>
                        </div>

                        <div className="fc-footer__nav-grid" style={{ flex: 2 }}>
                            {isSynced && activeData.columns.length > 0 ? (
                                <div className="fc-footer-editor-columns-preview" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                    {activeData.columns.map((col, idx) => (
                                        <div key={idx} className="fc-footer__nav-col" style={{ opacity: 0.8 }}>
                                            <h4 className="fc-footer__heading">{col.title}</h4>
                                            <ul className="wp-block-list">
                                                {col.links.map((link, lidx) => (
                                                    <li key={lidx}>{link.label}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <InnerBlocks 
                                    template={TEMPLATE} 
                                    allowedBlocks={['firstchurch/footer-column']}
                                    templateLock={isSynced ? 'all' : false}
                                />
                            )}
                        </div>
                    </div>
                     <div className="fc-footer__bottom">
                         <div className="fc-footer__bottom-inner">
                             <div className="fc-footer__copyright">{activeData.copyrightText}</div>
                             <div className="fc-footer__socials">
                                 {activeData.socialLinks.map((s, i) => (
                                     <span key={i} className={`fc-footer__social-icon fc-footer__social-icon--${s.icon}`} style={{ margin: '0 5px' }}>{s.label}</span>
                                 ))}
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
