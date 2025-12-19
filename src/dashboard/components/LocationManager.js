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
    CardFooter,
    ToggleControl,
    SelectControl
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function LocationManager() {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [notice, setNotice] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const fetchLocations = () => {
        setIsLoading(true);
        apiFetch({ path: '/firstchurch/v1/content?type=location' })
            .then(response => {
                setLocations(response);
                setIsLoading(false);
            })
            .catch(error => {
                setNotice({ type: 'error', message: error.message || __('Error loading locations.', 'first-church-core-blocks') });
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleCreate = () => {
        if (!newTitle.trim()) return;
        setIsCreating(true);
        setNotice(null);

        apiFetch({
            path: '/firstchurch/v1/content/create',
            method: 'POST',
            data: { type: 'location', title: newTitle }
        })
        .then(newEntry => {
            // Add to the list (top)
            setLocations([newEntry, ...locations]);
            setNewTitle('');
            setIsCreating(false);
            setExpandedId(newEntry.id); // Expand the new entry
            setNotice({ type: 'success', message: __('New location created! You can now edit its details.', 'first-church-core-blocks') });
            setTimeout(() => setNotice(null), 3000);
        })
        .catch(err => {
            setNotice({ type: 'error', message: err.message || __('Error creating location.', 'first-church-core-blocks') });
            setIsCreating(false);
        });
    };

    const handleUpdateStatus = (index, value) => {
        const newLocations = [...locations];
        newLocations[index].status = value;
        setLocations(newLocations);
    };

    const handleUpdateMeta = (index, key, value) => {
        const newLocations = [...locations];
        newLocations[index].meta[key] = value;
        setLocations(newLocations);
    };

    const handleSave = (location) => {
        setSavingId(location.id);
        setNotice(null);

        apiFetch({
            path: '/firstchurch/v1/content/update',
            method: 'POST',
            data: { 
                id: location.id,
                meta: location.meta
            }
        })
        .then(() => {
            setSavingId(null);
            setExpandedId(null); // Collapse after saving
            setNotice({ type: 'success', message: `${location.title} updated successfully!` });
            setTimeout(() => setNotice(null), 3000);
        })
        .catch(err => {
            setSavingId(null);
            setNotice({ type: 'error', message: err.message || __('Error saving location.', 'first-church-core-blocks') });
        });
    };

    if (isLoading) {
        return <div className="fc-dashboard__loading"><Spinner /> { __('Loading locations...', 'first-church-core-blocks') }</div>;
    }

    return (
        <div className="fc-content-manager fc-location-manager">
            <header className="fc-content-manager__header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2>{ __('Location Manager', 'first-church-core-blocks') }</h2>
                        <p>{ __('Manage service times, status messages, and contact details for all temples.', 'first-church-core-blocks') }</p>
                    </div>
                    <Button 
                        variant="primary" 
                        icon="plus"
                        onClick={() => setIsCreating(true)}
                        disabled={isCreating}
                    >
                        { __('Add New Location', 'first-church-core-blocks') }
                    </Button>
                </div>
            </header>

            {notice && (
                <Notice status={notice.type} onDismiss={() => setNotice(null)}>
                    {notice.message}
                </Notice>
            )}

            <div className="fc-content-manager__list">
                {/* Creation Flow Card */}
                {isCreating && (
                    <Card className="fc-content-item-card is-new">
                        <CardHeader className="fc-content-item-header">
                            <h3>{ __('New Location', 'first-church-core-blocks') }</h3>
                        </CardHeader>
                        <CardBody>
                            <TextControl
                                label={__('Location Name', 'first-church-core-blocks')}
                                value={newTitle}
                                onChange={setNewTitle}
                                placeholder={__('e.g. Lacovia Temple', 'first-church-core-blocks')}
                                autoFocus
                            />
                        </CardBody>
                        <CardFooter>
                            <Button variant="primary" onClick={handleCreate}>
                                { isCreating && newTitle ? __('Create Draft', 'first-church-core-blocks') : __('Add', 'first-church-core-blocks') }
                            </Button>
                            <Button variant="tertiary" onClick={() => { setIsCreating(false); setNewTitle(''); }}>
                                { __('Cancel', 'first-church-core-blocks') }
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {locations.map((location, index) => {
                    const isExpanded = location.id === expandedId;
                    return (
                        <Card key={location.id} className={`fc-content-item-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
                            <CardHeader 
                                className="fc-content-item-header"
                                onClick={() => setExpandedId(isExpanded ? null : location.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                                    <span style={{ fontSize: '18px', opacity: 0.5 }}>
                                        {isExpanded ? '−' : '+'}
                                    </span>
                                    <h3 style={{ margin: 0 }}>{ location.title }</h3>
                                    {!isExpanded && (
                                        <div className="fc-content-item-summary">
                                            {location.meta._location_region && <span>🏢 {location.meta._location_region}</span>}
                                            {location.meta._location_address && <span>📍 {location.meta._location_address.substring(0, 40)}...</span>}
                                        </div>
                                    )}
                                </div>
                                <span className={`fc-status-badge is-${location.status}`}>{ location.status }</span>
                            </CardHeader>
                            {isExpanded && (
                                <>
                                    <CardBody>
                                        <div className="fc-content-item-grid">
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Region / Title Override', 'first-church-core-blocks')}
                                                    value={location.meta._location_region || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_location_region', val)}
                                                />
                                                <TextControl
                                                    label={__('Status Message (RED)', 'first-church-core-blocks')}
                                                    value={location.meta._location_status || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_location_status', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextareaControl
                                                    label={__('Address', 'first-church-core-blocks')}
                                                    value={location.meta._location_address || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_location_address', val)}
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextareaControl
                                                    label={__('Service Times', 'first-church-core-blocks')}
                                                    value={location.meta._location_times || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_location_times', val)}
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Phone', 'first-church-core-blocks')}
                                                    value={location.meta._location_phone || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_location_phone', val)}
                                                />
                                                <TextControl
                                                    label={__('Map Embed URL', 'first-church-core-blocks')}
                                                    value={location.meta._location_map_embed || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_location_map_embed', val)}
                                                />
                                                <ToggleControl
                                                    label={__('International?', 'first-church-core-blocks')}
                                                    help={__('Mark as an international location.', 'first-church-core-blocks')}
                                                    checked={!!location.meta._location_is_international}
                                                    onChange={(val) => handleUpdateMeta(index, '_location_is_international', val)}
                                                />
                                                <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                                                    <SelectControl
                                                        label={__('Post Status', 'first-church-core-blocks')}
                                                        value={location.status}
                                                        options={[
                                                            { label: 'Published', value: 'publish' },
                                                            { label: 'Draft', value: 'draft' },
                                                            { label: 'Private', value: 'private' }
                                                        ]}
                                                        onChange={(val) => handleUpdateStatus(index, val)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleSave(location)}
                                            disabled={savingId === location.id}
                                        >
                                            {savingId === location.id ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                        </Button>
                                        <Button variant="link" href={`post.php?post=${location.id}&action=edit`}>
                                            { __('Open in Editor', 'first-church-core-blocks') }
                                        </Button>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    );
                })}

                {locations.length === 0 && !isCreating && (
                    <p className="fc-dashboard__empty">{ __('No locations found.', 'first-church-core-blocks') }</p>
                )}
            </div>
        </div>
    );
}
