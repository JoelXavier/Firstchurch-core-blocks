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

export default function FundraiserManager({ initialData, onSaveSuccess }) {
    const [fundraisers, setFundraisers] = useState(Array.isArray(initialData) ? initialData : []);
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const handleSave = () => {
        setIsSaving(true);
        setNotice(null);

        apiFetch({
            path: '/firstchurch/v1/fundraisers/save',
            method: 'POST',
            data: { fundraiserData: fundraisers }
        })
        .then(() => {
            setIsSaving(false);
            setExpandedId(null); // Collapse after saving
            setNotice({ type: 'success', message: __('Fundraisers updated successfully!', 'first-church-core-blocks') });
            if (onSaveSuccess) onSaveSuccess();
            setTimeout(() => setNotice(null), 3000);
        })
        .catch(err => {
            setIsSaving(false);
            setNotice({ type: 'error', message: err.message || __('Error saving fundraisers.', 'first-church-core-blocks') });
        });
    };

    const addFundraiser = () => {
        const newId = Date.now();
        const newState = [{ id: newId, title: '', raised: 0, goal: 0 }, ...fundraisers];
        setFundraisers(newState);
        setExpandedId(newId); // Expand the new one
    };

    const removeFundraiser = (id) => {
        const newFundraisers = fundraisers.filter(f => f.id !== id);
        setFundraisers(newFundraisers);
    };

    const updateFundraiser = (id, key, value) => {
        const newFundraisers = fundraisers.map(f => {
            if (f.id === id) {
                return { ...f, [key]: key === 'title' ? value : (parseInt(value) || 0) };
            }
            return f;
        });
        setFundraisers(newFundraisers);
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="fc-content-manager fc-fundraiser-manager">
            <header className="fc-content-manager__header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2>{ __('Fundraiser Manager', 'first-church-core-blocks') }</h2>
                        <p>{ __('Manage centralized fundraising data to be used in Fundraiser Cards site-wide.', 'first-church-core-blocks') }</p>
                    </div>
                    <Button 
                        variant="primary" 
                        icon="plus"
                        onClick={addFundraiser}
                    >
                        { __('Add New Campaign', 'first-church-core-blocks') }
                    </Button>
                </div>
            </header>

            {notice && (
                <Notice status={notice.type} onDismiss={() => setNotice(null)}>
                    {notice.message}
                </Notice>
            )}

            <div className="fc-content-manager__list">
                {fundraisers.map((f) => {
                    const isExpanded = f.id === expandedId;
                    return (
                        <Card key={f.id} className={`fc-content-item-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
                            <CardHeader 
                                className="fc-content-item-header" 
                                onClick={() => setExpandedId(isExpanded ? null : f.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                                    <span style={{ fontSize: '18px', opacity: 0.5 }}>
                                        {isExpanded ? '−' : '+'}
                                    </span>
                                    <h3 style={{ margin: 0 }}>{ f.title || __('Untitled Fundraiser', 'first-church-core-blocks') }</h3>
                                    {!isExpanded && f.goal > 0 && (
                                        <div className="fc-content-item-summary">
                                            <span>💰 {formatCurrency(f.raised)} / {formatCurrency(f.goal)}</span>
                                            <span style={{ marginLeft: '12px', opacity: 0.7 }}>
                                                ({Math.round((f.raised / f.goal) * 100)}%)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            {isExpanded && (
                                <>
                                    <CardBody>
                                        <div className="fc-content-item-grid">
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Campaign Title', 'first-church-core-blocks')}
                                                    value={f.title}
                                                    onChange={(val) => updateFundraiser(f.id, 'title', val)}
                                                    placeholder={__('e.g. Convention Center', 'first-church-core-blocks')}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Raised Amount ($)', 'first-church-core-blocks')}
                                                    type="number"
                                                    value={f.raised}
                                                    onChange={(val) => updateFundraiser(f.id, 'raised', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Goal Amount ($)', 'first-church-core-blocks')}
                                                    type="number"
                                                    value={f.goal}
                                                    onChange={(val) => updateFundraiser(f.id, 'goal', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                <Button 
                                                    isDestructive 
                                                    variant="link" 
                                                    onClick={() => removeFundraiser(f.id)}
                                                    style={{ marginBottom: '8px' }}
                                                >
                                                    { __('Delete Campaign', 'first-church-core-blocks') }
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <Button 
                                            variant="primary" 
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                        </Button>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    );
                })}

                {fundraisers.length === 0 && (
                    <p className="fc-dashboard__empty">{ __('No fundraisers found.', 'first-church-core-blocks') }</p>
                )}
            </div>
        </div>
    );
}
