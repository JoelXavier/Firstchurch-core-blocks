import { __ } from '@wordpress/i18n';
import { 
    Button, 
    TextControl, 
    PanelBody, 
    TextareaControl,
    Spinner,
    Notice
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function FooterManager({ initialData, onSaveSuccess }) {
    const [footerData, setFooterData] = useState(initialData || {
        logoUrl: '',
        logoTextPrimary: 'First Church',
        logoTextSecondary: 'Of Our Lord Jesus Christ',
        missionText: '',
        copyrightText: '',
        socialLinks: [],
        columns: [
            { title: 'The Church', links: [] },
            { title: 'Ministries', links: [] },
            { title: 'Connect', links: [] },
            { title: 'Give', links: [] },
        ]
    });
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState(null);

    const handleSave = () => {
        setIsSaving(true);
        setNotice(null);

        apiFetch({
            path: '/firstchurch/v1/footer-data',
            method: 'POST',
            data: { footerData }
        })
        .then(() => {
            setIsSaving(false);
            setNotice({ type: 'success', message: __('Footer updated successfully!', 'first-church-core-blocks') });
            if (onSaveSuccess) onSaveSuccess();
            setTimeout(() => setNotice(null), 3000);
        })
        .catch(err => {
            setIsSaving(false);
            setNotice({ type: 'error', message: err.message || __('Error saving Footer.', 'first-church-core-blocks') });
        });
    };

    const updateBranding = (key, value) => {
        setFooterData({ ...footerData, [key]: value });
    };

    const updateColumnTitle = (index, value) => {
        const newColumns = [...footerData.columns];
        newColumns[index] = { ...newColumns[index], title: value };
        setFooterData({ ...footerData, columns: newColumns });
    };

    const updateLink = (colIndex, linkIndex, key, value) => {
        const newColumns = [...footerData.columns];
        const newLinks = [...newColumns[colIndex].links];
        newLinks[linkIndex] = { ...newLinks[linkIndex], [key]: value };
        newColumns[colIndex] = { ...newColumns[colIndex], links: newLinks };
        setFooterData({ ...footerData, columns: newColumns });
    };

    const addLink = (colIndex) => {
        const newColumns = [...footerData.columns];
        const newLinks = [...newColumns[colIndex].links, { label: '', url: '' }];
        newColumns[colIndex] = { ...newColumns[colIndex], links: newLinks };
        setFooterData({ ...footerData, columns: newColumns });
    };

    const removeLink = (colIndex, linkIndex) => {
        const newColumns = [...footerData.columns];
        const newLinks = newColumns[colIndex].links.filter((_, i) => i !== linkIndex);
        newColumns[colIndex] = { ...newColumns[colIndex], links: newLinks };
        setFooterData({ ...footerData, columns: newColumns });
    };

    const updateSocial = (index, key, value) => {
        const newSocials = [...footerData.socialLinks];
        newSocials[index] = { ...newSocials[index], [key]: value };
        setFooterData({ ...footerData, socialLinks: newSocials });
    };

    return (
        <div className="fc-footer-manager">
            <header className="fc-footer-manager__header">
                <h2>{ __('Footer Manager', 'first-church-core-blocks') }</h2>
                <p>{ __('Configure the global footer content, social links, and navigation columns.', 'first-church-core-blocks') }</p>
            </header>

            {notice && (
                <Notice status={notice.type} onDismiss={() => setNotice(null)}>
                    {notice.message}
                </Notice>
            )}

            <div className="fc-footer-manager__panels">
                <PanelBody title={__('Branding & Mission', 'first-church-core-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('Logo URL', 'first-church-core-blocks')}
                        value={footerData.logoUrl}
                        onChange={(val) => updateBranding('logoUrl', val)}
                    />
                    <TextControl
                        label={__('Primary Brand Text', 'first-church-core-blocks')}
                        value={footerData.logoTextPrimary}
                        onChange={(val) => updateBranding('logoTextPrimary', val)}
                    />
                    <TextControl
                        label={__('Secondary Brand Text', 'first-church-core-blocks')}
                        value={footerData.logoTextSecondary}
                        onChange={(val) => updateBranding('logoTextSecondary', val)}
                    />
                    <TextareaControl
                        label={__('Mission Statement', 'first-church-core-blocks')}
                        value={footerData.missionText}
                        onChange={(val) => updateBranding('missionText', val)}
                    />
                    <TextControl
                        label={__('Copyright Text', 'first-church-core-blocks')}
                        value={footerData.copyrightText}
                        onChange={(val) => updateBranding('copyrightText', val)}
                    />
                </PanelBody>

                <PanelBody title={__('Social Links', 'first-church-core-blocks')} initialOpen={false}>
                    {footerData.socialLinks.map((link, index) => (
                        <div key={index} className="fc-menu-item-row" style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
                            <strong>{link.label}</strong>
                            <TextControl
                                label={__('URL', 'first-church-core-blocks')}
                                value={link.url}
                                onChange={(val) => updateSocial(index, 'url', val)}
                            />
                        </div>
                    ))}
                </PanelBody>

                <div className="fc-footer-columns-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
                    {footerData.columns.map((column, colIndex) => (
                        <PanelBody key={colIndex} title={`${__('Column', 'first-church-core-blocks')} ${colIndex + 1}: ${column.title}`} initialOpen={false}>
                            <TextControl
                                label={__('Column Title', 'first-church-core-blocks')}
                                value={column.title}
                                onChange={(val) => updateColumnTitle(colIndex, val)}
                            />
                            <div className="fc-footer-links-list">
                                {column.links.map((link, linkIndex) => (
                                    <div key={linkIndex} className="fc-menu-item-row" style={{ background: '#f9f9f9', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                                        <TextControl
                                            label={__('Link Label', 'first-church-core-blocks')}
                                            value={link.label}
                                            onChange={(val) => updateLink(colIndex, linkIndex, 'label', val)}
                                        />
                                        <TextControl
                                            label={__('Link URL', 'first-church-core-blocks')}
                                            value={link.url}
                                            onChange={(val) => updateLink(colIndex, linkIndex, 'url', val)}
                                        />
                                        <Button isDestructive variant="link" onClick={() => removeLink(colIndex, linkIndex)}>
                                            {__('Remove Link', 'first-church-core-blocks')}
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="secondary" onClick={() => addLink(colIndex)}>
                                    {__('Add Link', 'first-church-core-blocks')}
                                </Button>
                            </div>
                        </PanelBody>
                    ))}
                </div>
            </div>

            <footer className="fc-footer-manager__footer" style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <Button 
                    variant="primary" 
                    onClick={handleSave} 
                    disabled={isSaving}
                >
                    {isSaving ? <Spinner /> : __('Save Global Footer', 'first-church-core-blocks')}
                </Button>
            </footer>
        </div>
    );
}
