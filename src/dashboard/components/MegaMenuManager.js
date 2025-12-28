import { __ } from '@wordpress/i18n';
import { 
    Button, 
    TextControl, 
    Spinner,
    Notice,
    Card,
    CardHeader,
    CardBody,
    CardFooter
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function MegaMenuManager({ initialData, onSaveSuccess }) {
    const [menuData, setMenuData] = useState(initialData || {
        mainLinks: [],
        newsItems: [],
        quickLinks: [],
        announcements: [] // Added Announcements
    });
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const handleSave = () => {
        setIsSaving(true);
        setNotice(null);

        apiFetch({
            path: '/firstchurch/v1/mega-menu',
            method: 'POST',
            data: { menuData }
        })
        .then(() => {
            setIsSaving(false);
            setExpandedId(null); // Collapse after saving
            setNotice({ type: 'success', message: __('Mega Menu updated successfully!', 'first-church-core-blocks') });
            if (onSaveSuccess) onSaveSuccess();
            
            // Clear success notice after 3 seconds
            setTimeout(() => setNotice(null), 3000);
        })
        .catch(err => {
            setIsSaving(false);
            setNotice({ type: 'error', message: err.message || __('Error saving Mega Menu.', 'first-church-core-blocks') });
        });
    };

    const updateMainLink = (index, key, value) => {
        const newData = { ...menuData };
        newData.mainLinks = [...newData.mainLinks];
        newData.mainLinks[index] = { ...newData.mainLinks[index], [key]: value };
        setMenuData(newData);
    };

    const updateNewsItem = (index, key, value) => {
        const newData = { ...menuData };
        newData.newsItems = [...newData.newsItems];
        newData.newsItems[index] = { ...newData.newsItems[index], [key]: value };
        setMenuData(newData);
    };

    const updateQuickLink = (index, key, value) => {
        const newData = { ...menuData };
        newData.quickLinks = [...newData.quickLinks];
        newData.quickLinks[index] = { ...newData.quickLinks[index], [key]: value };
        setMenuData(newData);
    };

    // Announcement Handlers
    const updateAnnouncement = (index, key, value) => {
        const newData = { ...menuData };
        // Ensure array exists
        if (!newData.announcements) newData.announcements = [];
        newData.announcements = [...newData.announcements];
        
        // Handle conversion from string (legacy) to object
        if (typeof newData.announcements[index] === 'string') {
            newData.announcements[index] = { text: newData.announcements[index], url: '' };
        }

        newData.announcements[index] = { ...newData.announcements[index], [key]: value };
        setMenuData(newData);
    };

    const addAnnouncement = () => {
        const newData = { ...menuData };
        if (!newData.announcements) newData.announcements = [];
        newData.announcements = [...newData.announcements, { text: 'New Announcement', url: '' }];
        setMenuData(newData);
    };

    const removeAnnouncement = (index) => {
        const newData = { ...menuData };
        if (!newData.announcements) return;
        newData.announcements = newData.announcements.filter((_, i) => i !== index);
        setMenuData(newData);
    };

    const openMediaLibrary = (index) => {
        const frame = wp.media({
            title: __('Select Link Image', 'first-church-core-blocks'),
            multiple: false,
            library: { type: 'image' },
            button: { text: __('Use Image', 'first-church-core-blocks') }
        });

        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();
            updateNewsItem(index, 'image', attachment.url);
        });

        frame.open();
    };

    return (
        <div className="fc-content-manager fc-mega-menu-manager">
            {/* ... header ... */}
            <header className="fc-content-manager__header">
                <h2>{ __('Mega Menu Manager', 'first-church-core-blocks') }</h2>
                <p>{ __('Configure the global navigation columns shared across your site.', 'first-church-core-blocks') }</p>
            </header>

            {notice && (
                <Notice status={notice.type} onDismiss={() => setNotice(null)}>
                    {notice.message}
                </Notice>
            )}

            <div className="fc-content-manager__list">
                {/* Column 1: Main Links (The Church) */}
                <Card className={`fc-content-item-card ${expandedId === 'column1' ? 'is-expanded' : 'is-collapsed'}`}>
                    <CardHeader className="fc-content-item-header" onClick={() => setExpandedId(expandedId === 'column1' ? null : 'column1')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                            <span style={{ fontSize: '18px', opacity: 0.5 }}>{expandedId === 'column1' ? '−' : '+'}</span>
                            <h3 style={{ margin: 0 }}>{ __('Column 1: THE CHURCH', 'first-church-core-blocks') }</h3>
                            {expandedId !== 'column1' && (
                                <div className="fc-content-item-summary">
                                    <span>🔗 {menuData.mainLinks.length} { __('Links', 'first-church-core-blocks') }</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {expandedId === 'column1' && (
                        <>
                            <CardBody>
                                <div className="fc-content-item-list">
                                    {menuData.mainLinks.map((link, index) => (
                                        <div key={index} className="fc-content-item-grid" style={{ padding: '0 0 16px 0', borderBottom: index < menuData.mainLinks.length - 1 ? '1px solid #eee' : 'none', marginBottom: '16px' }}>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Label', 'first-church-core-blocks')}
                                                    value={link.label}
                                                    onChange={(val) => updateMainLink(index, 'label', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('URL', 'first-church-core-blocks')}
                                                    value={link.url}
                                                    onChange={(val) => updateMainLink(index, 'url', val)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                            <CardFooter>
                                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>

                {/* Column 2: News Items */}
                <Card className={`fc-content-item-card ${expandedId === 'column2' ? 'is-expanded' : 'is-collapsed'}`}>
                    <CardHeader className="fc-content-item-header" onClick={() => setExpandedId(expandedId === 'column2' ? null : 'column2')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                            <span style={{ fontSize: '18px', opacity: 0.5 }}>{expandedId === 'column2' ? '−' : '+'}</span>
                            <h3 style={{ margin: 0 }}>{ __('Column 2: FROM THE TEMPLE (News)', 'first-church-core-blocks') }</h3>
                            {expandedId !== 'column2' && (
                                <div className="fc-content-item-summary">
                                    <span>📰 {menuData.newsItems.length} { __('Items', 'first-church-core-blocks') }</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {expandedId === 'column2' && (
                        <>
                            <CardBody>
                                <div className="fc-content-item-list">
                                    {menuData.newsItems.map((item, index) => (
                                        <div key={index} className="fc-content-item-grid" style={{ padding: '0 0 16px 0', borderBottom: index < menuData.newsItems.length - 1 ? '1px solid #eee' : 'none', marginBottom: '16px' }}>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Category', 'first-church-core-blocks')}
                                                    value={item.category}
                                                    onChange={(val) => updateNewsItem(index, 'category', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Title', 'first-church-core-blocks')}
                                                    value={item.title}
                                                    onChange={(val) => updateNewsItem(index, 'title', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <label className="components-base-control__label" style={{ marginBottom: '8px', display: 'block' }}>{__('Image', 'first-church-core-blocks')}</label>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    {item.image && (
                                                        <div style={{ 
                                                            width: '40px', 
                                                            height: '40px', 
                                                            borderRadius: '4px', 
                                                            overflow: 'hidden', 
                                                            border: '1px solid #ddd',
                                                            background: '#f0f0f0'
                                                        }}>
                                                            <img 
                                                                src={item.image} 
                                                                alt="Thumbnail" 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                            />
                                                        </div>
                                                    )}
                                                    <Button 
                                                        variant="secondary" 
                                                        onClick={() => openMediaLibrary(index)}
                                                        isSmall
                                                    >
                                                        {item.image ? __('Replace Image', 'first-church-core-blocks') : __('Select Image', 'first-church-core-blocks')}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Link URL', 'first-church-core-blocks')}
                                                    value={item.link}
                                                    onChange={(val) => updateNewsItem(index, 'link', val)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                            <CardFooter>
                                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>

                {/* Column 3: Quick Links */}
                <Card className={`fc-content-item-card ${expandedId === 'column3' ? 'is-expanded' : 'is-collapsed'}`}>
                    <CardHeader className="fc-content-item-header" onClick={() => setExpandedId(expandedId === 'column3' ? null : 'column3')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                            <span style={{ fontSize: '18px', opacity: 0.5 }}>{expandedId === 'column3' ? '−' : '+'}</span>
                            <h3 style={{ margin: 0 }}>{ __('Column 3: QUICK LINKS', 'first-church-core-blocks') }</h3>
                            {expandedId !== 'column3' && (
                                <div className="fc-content-item-summary">
                                    <span>⚡ {menuData.quickLinks.length} { __('Links', 'first-church-core-blocks') }</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {expandedId === 'column3' && (
                        <>
                            <CardBody>
                                <div className="fc-content-item-list">
                                    {menuData.quickLinks.map((link, index) => (
                                        <div key={index} className="fc-content-item-grid" style={{ padding: '0 0 16px 0', borderBottom: index < menuData.quickLinks.length - 1 ? '1px solid #eee' : 'none', marginBottom: '16px' }}>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Label', 'first-church-core-blocks')}
                                                    value={link.label}
                                                    onChange={(val) => updateQuickLink(index, 'label', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('URL', 'first-church-core-blocks')}
                                                    value={link.url}
                                                    onChange={(val) => updateQuickLink(index, 'url', val)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                            <CardFooter>
                                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>

                {/* Column 4: Announcements */}
                <Card className={`fc-content-item-card ${expandedId === 'column4' ? 'is-expanded' : 'is-collapsed'}`}>
                    <CardHeader className="fc-content-item-header" onClick={() => setExpandedId(expandedId === 'column4' ? null : 'column4')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                            <span style={{ fontSize: '18px', opacity: 0.5 }}>{expandedId === 'column4' ? '−' : '+'}</span>
                            <h3 style={{ margin: 0 }}>{ __('ANNOUNCEMENTS BAR', 'first-church-core-blocks') }</h3>
                            {expandedId !== 'column4' && (
                                <div className="fc-content-item-summary">
                                    <span>📢 {(menuData.announcements || []).length} { __('Items', 'first-church-core-blocks') }</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {expandedId === 'column4' && (
                        <>
                            <CardBody>
                                <div className="fc-content-item-list">
                                    <div style={{ marginBottom: '16px' }}>
                                        <Button variant="secondary" onClick={addAnnouncement} isSmall>
                                            {__('+ Add Announcement', 'first-church-core-blocks')}
                                        </Button>
                                    </div>
                                    {(menuData.announcements || []).map((item, index) => {
                                        // Normalized item
                                        const text = typeof item === 'string' ? item : item.text;
                                        const url = typeof item === 'string' ? '' : item.url;
                                        
                                        return (
                                            <div key={index} className="fc-content-item-grid" style={{ padding: '0 0 16px 0', borderBottom: '1px solid #eee', marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <TextControl
                                                        label={__('Announcement Text', 'first-church-core-blocks')}
                                                        value={text}
                                                        onChange={(val) => updateAnnouncement(index, 'text', val)}
                                                    />
                                                    <TextControl
                                                        label={__('Link URL (Optional)', 'first-church-core-blocks')}
                                                        value={url}
                                                        onChange={(val) => updateAnnouncement(index, 'url', val)}
                                                    />
                                                </div>
                                                <Button 
                                                    isDestructive 
                                                    variant="link" 
                                                    onClick={() => removeAnnouncement(index)}
                                                    style={{ marginTop: '24px' }}
                                                >
                                                    {__('Remove', 'first-church-core-blocks')}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardBody>
                            <CardFooter>
                                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
