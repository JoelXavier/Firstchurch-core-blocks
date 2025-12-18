import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, PanelColorSettings, RichText } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, ToggleControl, ExternalLink } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { 
        logoId, 
        logoUrl, 
        siteName, 
        hamburgerColor,
        menuData,
        useGlobalMenu
    } = attributes;

    // Fetch Global Menu Data
    const [ globalMenuData ] = useEntityProp( 'root', 'site', 'fc_mega_menu_data' );

    // Determine which data to show
    const effectiveMenuData = useGlobalMenu && globalMenuData ? globalMenuData : menuData;

    const [ isMenuOpen, setIsMenuOpen ] = useState( false );

    const blockProps = useBlockProps({
        className: `fc-sleek-nav ${isMenuOpen ? 'is-menu-open' : ''}`
    });

    const onSelectLogo = (media) => {
        setAttributes({
            logoId: media.id,
            logoUrl: media.url
        });
    };

    const onRemoveLogo = () => {
        setAttributes({
             logoId: undefined,
             logoUrl: ''
        });
    };

    const updateMenuData = (key, index, field, value) => {
        const newData = { ...menuData };
        if (index !== null && field !== null) {
            newData[key][index][field] = value;
        } else {
            newData[key] = value;
        }
        setAttributes({ menuData: newData });
    };


	return (
		<div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Mega Menu Sync', 'first-church-core-blocks')}>
                    <ToggleControl
                        label={__('Use Global Menu', 'first-church-core-blocks')}
                        help={__('Sync this block with the global menu managed in Mission Control.', 'first-church-core-blocks')}
                        checked={useGlobalMenu}
                        onChange={(val) => setAttributes({ useGlobalMenu: val })}
                    />
                    {useGlobalMenu && (
                        <div style={{ marginTop: '10px', fontSize: '12px', fontStyle: 'italic', color: '#666' }}>
                            <p>{__('Editing is currently disabled because this block is synced with the global menu.', 'first-church-core-blocks')}</p>
                            <ExternalLink href="admin.php?page=first-church-mission-control">
                                {__('Manage Global Menu', 'first-church-core-blocks')}
                            </ExternalLink>
                        </div>
                    )}
                </PanelBody>

                <PanelBody title={__('Identity', 'first-church-core-blocks')}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectLogo}
                            allowedTypes={['image']}
                            value={logoId}
                            render={({ open }) => (
                                <div className="editor-logo-upload" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Logo Image</label>
                                    {logoUrl ? (
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <img src={logoUrl} alt="Logo" style={{ maxHeight: '60px', borderRadius: '4px' }} />
                                            <Button 
                                                isDestructive 
                                                variant="link" 
                                                onClick={onRemoveLogo}
                                                style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#fff', borderRadius: '50%', padding: '2px' }}
                                            >
                                                &times;
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="secondary" onClick={open}>
                                            {__('Upload Logo', 'first-church-core-blocks')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                    <Button 
                        variant="secondary" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        isPressed={isMenuOpen}
                        style={{ width: '100%' }}
                    >
                        {isMenuOpen ? __('Close Menu Preview', 'first-church-core-blocks') : __('Edit Full Screen Menu', 'first-church-core-blocks')}
                    </Button>
                </PanelBody>

                {!useGlobalMenu && (
                <>
                <PanelBody title={__('Menu Content: The Church', 'first-church-core-blocks')} initialOpen={false}>
                    {menuData.mainLinks.map((item, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                            <TextControl
                                label={`${__('Label', 'first-church-core-blocks')} ${index + 1}`}
                                value={item.label}
                                onChange={(val) => updateMenuData('mainLinks', index, 'label', val)}
                            />
                            <TextControl
                                label={__('URL', 'first-church-core-blocks')}
                                value={item.url}
                                onChange={(val) => updateMenuData('mainLinks', index, 'url', val)}
                            />
                        </div>
                    ))}
                </PanelBody>

                <PanelBody title={__('Menu Content: News', 'first-church-core-blocks')} initialOpen={false}>
                    {menuData.newsItems.map((item, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <TextControl
                                label={__('Title', 'first-church-core-blocks')}
                                value={item.title}
                                onChange={(val) => updateMenuData('newsItems', index, 'title', val)}
                            />
                            <TextControl
                                label={__('Category', 'first-church-core-blocks')}
                                value={item.category}
                                onChange={(val) => updateMenuData('newsItems', index, 'category', val)}
                            />
                            <TextControl
                                label={__('Link URL', 'first-church-core-blocks')}
                                value={item.link}
                                onChange={(val) => updateMenuData('newsItems', index, 'link', val)}
                            />
                        </div>
                    ))}
                </PanelBody>

                <PanelBody title={__('Menu Content: Quick Links', 'first-church-core-blocks')} initialOpen={false}>
                    {menuData.quickLinks.map((item, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                            <TextControl
                                label={`${__('Label', 'first-church-core-blocks')} ${index + 1}`}
                                value={item.label}
                                onChange={(val) => updateMenuData('quickLinks', index, 'label', val)}
                            />
                            <TextControl
                                label={__('URL', 'first-church-core-blocks')}
                                value={item.url}
                                onChange={(val) => updateMenuData('quickLinks', index, 'url', val)}
                            />
                        </div>
                    ))}
                </PanelBody>
                </>
                )}

                <PanelColorSettings
                    title={__('Icon Colors', 'first-church-core-blocks')}
                    colorSettings={[
                        {
                            value: hamburgerColor,
                            onChange: (val) => setAttributes({ hamburgerColor: val }),
                            label: __('Hamburger Icon Color', 'first-church-core-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <header className="fc-sleek-nav__container">
                <div className="fc-sleek-nav__brand">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectLogo}
                            allowedTypes={['image']}
                            value={logoId}
                            render={({ open }) => (
                                <div 
                                    className="fc-sleek-nav__logo-upload-area"
                                    onClick={open}
                                >
                                    {logoUrl ? (
                                        <div className="fc-sleek-nav__logo-preview">
                                            <img src={logoUrl} alt={siteName} />
                                            <Button 
                                                isDestructive 
                                                variant="link" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemoveLogo();
                                                }}
                                                className="fc-sleek-nav__remove-logo"
                                            >
                                                &times;
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="fc-sleek-nav__logo-placeholder">
                                            <span className="dashicons dashicons-insert"></span>
                                            <span>{__('Add Logo', 'first-church-core-blocks')}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>

                    <div className="fc-sleek-nav__text">
                        <RichText
                            tagName="h1"
                            className="fc-sleek-nav__site-name"
                            value={siteName}
                            onChange={(val) => setAttributes({ siteName: val })}
                            placeholder={__('Site Name', 'first-church-core-blocks')}
                            allowedFormats={[]}
                        />
                    </div>
                </div>

                <div 
                    className="fc-sleek-nav__hamburger" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ cursor: 'pointer' }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke={hamburgerColor || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </header>

            { isMenuOpen && (
                <div className="fc-sleek-nav__overlay fc-full-page-menu is-active">
                    <div className="fc-menu-logo">
                        {logoUrl && <img src={logoUrl} alt="Logo" style={{ height: '80px', width: 'auto' }} />}
                    </div>
                    <div className="fc-sleek-nav__close fc-menu-close-btn" onClick={() => setIsMenuOpen(false)}>&times;</div>
                    
                    <div className="fc-full-page-menu__container">
                        <div className="fc-full-page-menu__col menu-col-main">
                            <h4 className="fc-menu-heading">THE CHURCH</h4>
                            <ul className="fc-full-nav-list">
                                {(effectiveMenuData.mainLinks || []).map((link, idx) => (
                                    <li key={idx}><span className="fc-main-link-preview">{link.label}</span></li>
                                ))}
                            </ul>
                        </div>

                        <div className="fc-full-page-menu__col menu-col-news">
                            <h4 className="fc-menu-heading">FROM THE TEMPLE</h4>
                            <div className="fc-news-grid">
                                {(effectiveMenuData.newsItems || []).map((news, idx) => (
                                    <div key={idx} className="fc-news-item">
                                        {news.image && (
                                            <div className="fc-news-image">
                                                <img src={news.image} alt="" />
                                            </div>
                                        )}
                                        <span className="fc-news-cat">{news.category}</span>
                                        <h5 className="fc-news-title">{news.title}</h5>
                                        <span className="fc-news-read-more">READ MORE</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="fc-full-page-menu__col menu-col-quick text-right">
                            <h4 className="fc-menu-heading">QUICK LINKS</h4>
                            <ul className="fc-quick-nav-list">
                                {(effectiveMenuData.quickLinks || []).map((link, idx) => (
                                    <li key={idx}><span className="fc-quick-link-preview">{link.label}</span></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

		</div>
	);
}
