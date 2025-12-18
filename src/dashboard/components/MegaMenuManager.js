import { __ } from '@wordpress/i18n';
import { 
    Button, 
    TextControl, 
    PanelBody, 
    PanelRow, 
    TextareaControl,
    Spinner,
    Notice
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function MegaMenuManager({ initialData, onSaveSuccess }) {
    const [menuData, setMenuData] = useState(initialData || {
        mainLinks: [],
        newsItems: [],
        quickLinks: []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState(null);

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
        newData.mainLinks[index][key] = value;
        setMenuData(newData);
    };

    const updateNewsItem = (index, key, value) => {
        const newData = { ...menuData };
        newData.newsItems[index][key] = value;
        setMenuData(newData);
    };

    const updateQuickLink = (index, key, value) => {
        const newData = { ...menuData };
        newData.quickLinks[index][key] = value;
        setMenuData(newData);
    };

    return (
        <div className="fc-mega-menu-manager">
            <header className="fc-mega-menu-manager__header">
                <h2>{ __('Mega Menu Manager', 'first-church-core-blocks') }</h2>
                <p>{ __('Configure the global navigation columns shared across your site.', 'first-church-core-blocks') }</p>
            </header>

            {notice && (
                <Notice status={notice.type} onDismiss={() => setNotice(null)}>
                    {notice.message}
                </Notice>
            )}

            <div className="fc-mega-menu-manager__panels">
                {/* Column 1: Main Links (The Church) */}
                <PanelBody title={__('Column 1: THE CHURCH', 'first-church-core-blocks')} initialOpen={true}>
                    {menuData.mainLinks.map((link, index) => (
                        <div key={index} className="fc-menu-item-row">
                            <TextControl
                                label={__('Label', 'first-church-core-blocks')}
                                value={link.label}
                                onChange={(val) => updateMainLink(index, 'label', val)}
                            />
                            <TextControl
                                label={__('URL', 'first-church-core-blocks')}
                                value={link.url}
                                onChange={(val) => updateMainLink(index, 'url', val)}
                            />
                        </div>
                    ))}
                </PanelBody>

                {/* Column 2: NewsItems */}
                <PanelBody title={__('Column 2: FROM THE TEMPLE (News)', 'first-church-core-blocks')} initialOpen={false}>
                    {menuData.newsItems.map((item, index) => (
                        <div key={index} className="fc-news-item-editor">
                            <h4>{ __('News Item', 'first-church-core-blocks') } {index + 1}</h4>
                            <TextControl
                                label={__('Category', 'first-church-core-blocks')}
                                value={item.category}
                                onChange={(val) => updateNewsItem(index, 'category', val)}
                            />
                            <TextControl
                                label={__('Title', 'first-church-core-blocks')}
                                value={item.title}
                                onChange={(val) => updateNewsItem(index, 'title', val)}
                            />
                            <TextControl
                                label={__('Image URL', 'first-church-core-blocks')}
                                value={item.image}
                                onChange={(val) => updateNewsItem(index, 'image', val)}
                            />
                            <TextControl
                                label={__('Link URL', 'first-church-core-blocks')}
                                value={item.link}
                                onChange={(val) => updateNewsItem(index, 'link', val)}
                            />
                        </div>
                    ))}
                </PanelBody>

                {/* Column 3: Quick Links */}
                <PanelBody title={__('Column 3: QUICK LINKS', 'first-church-core-blocks')} initialOpen={false}>
                    {menuData.quickLinks.map((link, index) => (
                        <div key={index} className="fc-menu-item-row">
                            <TextControl
                                label={__('Label', 'first-church-core-blocks')}
                                value={link.label}
                                onChange={(val) => updateQuickLink(index, 'label', val)}
                            />
                            <TextControl
                                label={__('URL', 'first-church-core-blocks')}
                                value={link.url}
                                onChange={(val) => updateQuickLink(index, 'url', val)}
                            />
                        </div>
                    ))}
                </PanelBody>
            </div>

            <footer className="fc-mega-menu-manager__footer">
                <Button 
                    variant="primary" 
                    onClick={handleSave} 
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner /> : __('Save Global Menu', 'first-church-core-blocks')}
                </Button>
            </footer>
        </div>
    );
}
