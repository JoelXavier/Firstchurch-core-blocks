import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, ToggleControl, TextareaControl } from '@wordpress/components';
import { GlobalNavigation } from '../../components/GlobalNavigation/GlobalNavigation';
import './editor.scss'; // Optional editor-specific styles

export default function Edit({ attributes, setAttributes }) {
	const { 
        logoTextPrimary, 
        logoTextSecondary, 
        logoId, 
        logoUrl, 
        ctaLabel, 
        ctaUrl,
        items,
        announcements,
        menuData
    } = attributes;

    // --- Handlers ---

    const updateItem = (index, key, value) => {
        const newItems = [...items];
        newItems[index][key] = value;
        setAttributes({ items: newItems });
    };

    const addItem = () => {
        setAttributes({ 
            items: [...items, { label: "New Link", url: "#", hasSubmenu: false }] 
        });
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setAttributes({ items: newItems });
    };

    const updateAnnouncement = (index, value) => {
        const newAnnouncements = [...announcements];
        newAnnouncements[index] = value;
        setAttributes({ announcements: newAnnouncements });
    };

    const addAnnouncement = () => {
        setAttributes({ announcements: [...announcements, "New Announcement"] });
    };

    const removeAnnouncement = (index) => {
        const newAnnouncements = [...announcements];
        newAnnouncements.splice(index, 1);
        setAttributes({ announcements: newAnnouncements });
    };

    const onSelectLogo = (media) => {
        setAttributes({
            logoId: media.id,
            logoUrl: media.url // Or media.sizes.full.url
        });
    };

    const onRemoveLogo = () => {
        setAttributes({
             logoId: undefined,
             logoUrl: ''
        });
    };

	return (
		<div {...useBlockProps({ className: 'antigravity-global-nav-editor' })}>
            
            {/* 1. Sidebar Controls */}
            <InspectorControls>
                
                <PanelBody title={__('Identity', 'antigravity-core-blocks')} initialOpen={true}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectLogo}
                            allowedTypes={['image']}
                            value={logoId}
                            render={({ open }) => (
                                <div className="editor-logo-upload">
                                    {logoUrl && <img src={logoUrl} alt="Logo" style={{ maxWidth: '100%', marginBottom: '10px' }} />}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button variant="secondary" onClick={open}>
                                            {logoUrl ? __('Replace Logo', 'antigravity-core-blocks') : __('Upload Logo', 'antigravity-core-blocks')}
                                        </Button>
                                        {logoUrl && (
                                            <Button variant="link" isDestructive onClick={onRemoveLogo}>
                                                {__('Remove', 'antigravity-core-blocks')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                    <br />
                    <TextControl
                        label={__('Primary Name', 'antigravity-core-blocks')}
                        value={logoTextPrimary}
                        onChange={(val) => setAttributes({ logoTextPrimary: val })}
                    />
                    <TextControl
                        label={__('Secondary Name', 'antigravity-core-blocks')}
                        value={logoTextSecondary}
                        onChange={(val) => setAttributes({ logoTextSecondary: val })}
                    />
                </PanelBody>

                <PanelBody title={__('Top Navigation', 'antigravity-core-blocks')} initialOpen={false}>
                    {items.map((item, index) => (
                        <div key={index} className="nav-item-control" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                            <TextControl
                                label={`Link ${index + 1} Label`}
                                value={item.label}
                                onChange={(val) => updateItem(index, 'label', val)}
                            />
                            <TextControl
                                label="URL"
                                value={item.url}
                                onChange={(val) => updateItem(index, 'url', val)}
                            />
                            <ToggleControl
                                label="Has Submenu?"
                                checked={item.hasSubmenu}
                                onChange={(val) => updateItem(index, 'hasSubmenu', val)}
                            />
                            <Button isDestructive variant="link" onClick={() => removeItem(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button variant="primary" onClick={addItem}>Add Link</Button>
                </PanelBody>

                <PanelBody title={__('Announcements', 'antigravity-core-blocks')} initialOpen={false}>
                    {announcements.map((text, index) => (
                         <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                             <TextControl
                                value={text}
                                onChange={(val) => updateAnnouncement(index, val)}
                                style={{ flex: 1 }}
                             />
                             <Button isDestructive icon="trash" onClick={() => removeAnnouncement(index)} />
                         </div>
                    ))}
                    <Button variant="secondary" onClick={addAnnouncement}>Add Announcement</Button>
                </PanelBody>

                 <PanelBody title={__('Call to Action', 'antigravity-core-blocks')} initialOpen={false}>
                    <TextControl
                        label="Button Label"
                        value={ctaLabel}
                        onChange={(val) => setAttributes({ ctaLabel: val })}
                    />
                    <TextControl
                        label="Button URL"
                        value={ctaUrl}
                        onChange={(val) => setAttributes({ ctaUrl: val })}
                    />
                </PanelBody>



                 <PanelBody title={__('Mega Menu: Main Links', 'antigravity-core-blocks')} initialOpen={false}>
                    {menuData.mainLinks.map((link, index) => (
                        <div key={index} className="nav-item-control" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                             <TextControl
                                label={`Link ${index+1}`}
                                value={link.label}
                                onChange={(val) => {
                                    const newData = { ...menuData };
                                    newData.mainLinks[index].label = val;
                                    setAttributes({ menuData: newData });
                                }}
                            />
                             <TextControl
                                label="URL"
                                value={link.url}
                                onChange={(val) => {
                                    const newData = { ...menuData };
                                    newData.mainLinks[index].url = val;
                                    setAttributes({ menuData: newData });
                                }}
                            />
                        </div>
                    ))}
                </PanelBody>

                 <PanelBody title={__('Mega Menu: News Feed', 'antigravity-core-blocks')} initialOpen={false}>
                    {menuData.newsItems.map((item, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '15px' }}>
                            <p><strong>News Item {index + 1}</strong></p>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => {
                                        const newData = { ...menuData };
                                        newData.newsItems[index].image = media.url;
                                        setAttributes({ menuData: newData });
                                    }}
                                    allowedTypes={['image']}
                                    value={item.image} // We are storing URL directly in JSON for simplicity
                                    render={({ open }) => (
                                        <div style={{ marginBottom: '10px' }}>
                                            {item.image ? (
                                                <>
                                                    <img src={item.image} alt="News" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <Button variant="link" isDestructive onClick={() => {
                                                         const newData = { ...menuData };
                                                         newData.newsItems[index].image = '';
                                                         setAttributes({ menuData: newData });
                                                    }}>Remove Image</Button>
                                                </>
                                            ) : (
                                                <Button variant="secondary" onClick={open}>Upload Image</Button>
                                            )}
                                        </div>
                                    )}
                                />
                            </MediaUploadCheck>
                            <TextControl
                                label="Category"
                                value={item.category}
                                onChange={(val) => {
                                    const newData = { ...menuData };
                                    newData.newsItems[index].category = val;
                                    setAttributes({ menuData: newData });
                                }}
                            />
                            <TextControl
                                label="Title"
                                value={item.title}
                                onChange={(val) => {
                                    const newData = { ...menuData };
                                    newData.newsItems[index].title = val;
                                    setAttributes({ menuData: newData });
                                }}
                            />
                             <TextControl
                                label="Link URL"
                                value={item.link}
                                onChange={(val) => {
                                    const newData = { ...menuData };
                                    newData.newsItems[index].link = val;
                                    setAttributes({ menuData: newData });
                                }}
                            />
                        </div>
                    ))}
                </PanelBody>

                 <PanelBody title={__('Mega Menu: Quick Links', 'antigravity-core-blocks')} initialOpen={false}>
                     {menuData.quickLinks.map((link, index) => (
                        <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                             <TextControl
                                value={link.label}
                                onChange={(val) => {
                                    const newData = { ...menuData };
                                    newData.quickLinks[index].label = val;
                                    setAttributes({ menuData: newData });
                                }}
                                style={{ flex: 1 }}
                            />
                        </div>
                    ))}
                    <p style={{ fontSize: '11px', color: '#666' }}>URLs manageable via JSON mode (future).</p>
                </PanelBody>

            </InspectorControls>

            {/* 2. Editor Canvas Preview */}
			<GlobalNavigation 
                logoTextPrimary={logoTextPrimary}
                logoTextSecondary={logoTextSecondary}
                ctaLabel={ctaLabel}
                items={items}
                announcements={announcements}
                menuData={menuData}
                logoSrc={logoUrl}
            />
		</div>
	);
}
