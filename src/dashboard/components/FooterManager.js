import { __ } from '@wordpress/i18n';
import { 
    Button, 
    TextControl, 
    TextareaControl,
    Spinner,
    Notice,
    Card,
    CardHeader,
    CardBody,
    CardFooter
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
    const [expandedId, setExpandedId] = useState(null);

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
            setExpandedId(null); // Collapse after saving
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
        <div className="fc-content-manager fc-footer-manager">
            <header className="fc-content-manager__header">
                <h2>{ __('Footer Manager', 'first-church-core-blocks') }</h2>
                <p>{ __('Configure the global footer content, social links, and navigation columns.', 'first-church-core-blocks') }</p>
            </header>

            {notice && (
                <Notice status={notice.type} onDismiss={() => setNotice(null)}>
                    {notice.message}
                </Notice>
            )}

            <div className="fc-content-manager__list">
                {/* Branding & Mission */}
                <Card className={`fc-content-item-card ${expandedId === 'branding' ? 'is-expanded' : 'is-collapsed'}`}>
                    <CardHeader className="fc-content-item-header" onClick={() => setExpandedId(expandedId === 'branding' ? null : 'branding')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                            <span style={{ fontSize: '18px', opacity: 0.5 }}>{expandedId === 'branding' ? '−' : '+'}</span>
                            <h3 style={{ margin: 0 }}>{ __('Branding & Mission', 'first-church-core-blocks') }</h3>
                            {expandedId !== 'branding' && (
                                <div className="fc-content-item-summary">
                                    <span>🏢 {footerData.logoTextPrimary}</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {expandedId === 'branding' && (
                        <>
                            <CardBody>
                                <div className="fc-content-item-grid">
                                    <div className="fc-content-item-col">
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
                                    </div>
                                    <div className="fc-content-item-col">
                                        <TextareaControl
                                            label={__('Mission Statement', 'first-church-core-blocks')}
                                            value={footerData.missionText}
                                            onChange={(val) => updateBranding('missionText', val)}
                                            rows={5}
                                        />
                                        <TextControl
                                            label={__('Copyright Text', 'first-church-core-blocks')}
                                            value={footerData.copyrightText}
                                            onChange={(val) => updateBranding('copyrightText', val)}
                                        />
                                    </div>
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

                {/* Social Links */}
                <Card className={`fc-content-item-card ${expandedId === 'social' ? 'is-expanded' : 'is-collapsed'}`}>
                    <CardHeader className="fc-content-item-header" onClick={() => setExpandedId(expandedId === 'social' ? null : 'social')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                            <span style={{ fontSize: '18px', opacity: 0.5 }}>{expandedId === 'social' ? '−' : '+'}</span>
                            <h3 style={{ margin: 0 }}>{ __('Social Links', 'first-church-core-blocks') }</h3>
                            {expandedId !== 'social' && (
                                <div className="fc-content-item-summary">
                                    <span>🌐 {footerData.socialLinks.length} { __('Links', 'first-church-core-blocks') }</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {expandedId === 'social' && (
                        <>
                            <CardBody>
                                <div className="fc-content-item-grid">
                                    {footerData.socialLinks.map((link, index) => (
                                        <div key={index} className="fc-content-item-col" style={{ borderBottom: index < footerData.socialLinks.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '16px', marginBottom: '16px' }}>
                                            <strong>{link.label}</strong>
                                            <TextControl
                                                label={__('URL', 'first-church-core-blocks')}
                                                value={link.url}
                                                onChange={(val) => updateSocial(index, 'url', val)}
                                            />
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

                {/* Columns Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '8px' }}>
                    {footerData.columns.map((column, colIndex) => (
                        <Card key={colIndex} className={`fc-content-item-card ${expandedId === `col-${colIndex}` ? 'is-expanded' : 'is-collapsed'}`}>
                            <CardHeader className="fc-content-item-header" onClick={() => setExpandedId(expandedId === `col-${colIndex}` ? null : `col-${colIndex}`)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                                    <span style={{ fontSize: '18px', opacity: 0.5 }}>{expandedId === `col-${colIndex}` ? '−' : '+'}</span>
                                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{column.title}</h3>
                                    {expandedId !== `col-${colIndex}` && (
                                        <div className="fc-content-item-summary">
                                            <span>({column.links.length})</span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            {expandedId === `col-${colIndex}` && (
                                <>
                                    <CardBody>
                                        <TextControl
                                            label={__('Column Title', 'first-church-core-blocks')}
                                            value={column.title}
                                            onChange={(val) => updateColumnTitle(colIndex, val)}
                                        />
                                        <div className="fc-footer-links-list">
                                            {column.links.map((link, linkIndex) => (
                                                <div key={linkIndex} style={{ background: '#f9f9f9', padding: '12px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #eee' }}>
                                                    <TextControl
                                                        label={__('Label', 'first-church-core-blocks')}
                                                        value={link.label}
                                                        onChange={(val) => updateLink(colIndex, linkIndex, 'label', val)}
                                                    />
                                                    <TextControl
                                                        label={__('URL', 'first-church-core-blocks')}
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
                                    </CardBody>
                                    <CardFooter>
                                        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                        </Button>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
