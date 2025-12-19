import { __ } from '@wordpress/i18n';
import { 
    Button, 
    TextControl, 
    PanelBody, 
    PanelRow, 
    DateTimePicker,
    Spinner,
    Notice,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    ToggleControl,
    SelectControl,
    DatePicker,
    CheckboxControl,
    TextareaControl
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function EventManager() {
    const [events, setEvents] = useState([]);
    const [availableTerms, setAvailableTerms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [notice, setNotice] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const fetchEvents = () => {
        setIsLoading(true);
        // Fetch Events
        const eventsPromise = apiFetch({ path: '/firstchurch/v1/content?type=event' });
        // Fetch Categories
        const termsPromise = apiFetch({ path: '/wp/v2/event_category?per_page=100' });

        Promise.all([eventsPromise, termsPromise])
            .then(([eventsData, termsData]) => {
                setEvents(eventsData);
                setAvailableTerms(termsData);
                setIsLoading(false);
            })
            .catch(error => {
                setNotice({ type: 'error', message: error.message || __('Error loading data.', 'first-church-core-blocks') });
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreate = () => {
        if (!newTitle.trim()) return;
        setIsCreating(true);
        setNotice(null);

        apiFetch({
            path: '/firstchurch/v1/content/create',
            method: 'POST',
            data: { type: 'event', title: newTitle }
        })
        .then(newEntry => {
            // Add to the list (top)
            setEvents([newEntry, ...events]);
            setNewTitle('');
            setIsCreating(false);
            setNotice({ type: 'success', message: __('New event created! You can now edit its details.', 'first-church-core-blocks') });
            setTimeout(() => setNotice(null), 3000);
        })
        .catch(err => {
            setNotice({ type: 'error', message: err.message || __('Error creating event.', 'first-church-core-blocks') });
            setIsCreating(false);
        });
    };

    const handleUpdateMeta = (index, key, value) => {
        // Ensure date formatted if needed (TextControl/DatePicker)
        let safeValue = value;
        if ((key === '_event_start_date' || key === '_event_end_date') && safeValue && safeValue.length > 10) {
            safeValue = safeValue.substr(0, 10);
        }

        setEvents(prevEvents => {
            const newEvents = [...prevEvents];
            newEvents[index] = {
                ...newEvents[index],
                meta: {
                    ...newEvents[index].meta,
                    [key]: safeValue
                }
            };
            return newEvents;
        });
    };

    const handleUpdateStatus = (index, value) => {
        setEvents(prevEvents => {
            const newEvents = [...prevEvents];
            newEvents[index] = {
                ...newEvents[index],
                status: value
            };
            return newEvents;
        });
    };

    const handleUpdateTerms = (index, termId, isChecked) => {
        setEvents(prevEvents => {
            const newEvents = [...prevEvents];
            const currentTerms = [...(newEvents[index].terms || [])];
            
            let newTerms;
            if (isChecked) {
                if (!currentTerms.includes(termId)) {
                    newTerms = [...currentTerms, termId];
                } else {
                    newTerms = currentTerms;
                }
            } else {
                newTerms = currentTerms.filter(id => id !== termId);
            }
            
            newEvents[index] = {
                ...newEvents[index],
                terms: newTerms
            };
            return newEvents;
        });
    };


    const handleSave = (event) => {
        setSavingId(event.id);
        setNotice(null);

        // Sanitize Dates to YYYY-MM-DD
        const cleanMeta = { ...event.meta };
        if (cleanMeta._event_start_date && cleanMeta._event_start_date.length > 10) {
            cleanMeta._event_start_date = cleanMeta._event_start_date.substr(0, 10);
        }
        // Auto-Sync End Date Logic (Per User Request)
        // If End Date is missing OR End Date is before Start Date (stale), sync it to Start Date.
        // This ensures the Event Feed query logic works correctly without a visible End Date picker.
        if (cleanMeta._event_start_date) {
            if (!cleanMeta._event_end_date || cleanMeta._event_end_date < cleanMeta._event_start_date) {
                cleanMeta._event_end_date = cleanMeta._event_start_date;
            }
        }

        if (cleanMeta._event_end_date && cleanMeta._event_end_date.length > 10) {
            cleanMeta._event_end_date = cleanMeta._event_end_date.substr(0, 10);
        }

        apiFetch({
            path: '/firstchurch/v1/content/update',
            method: 'POST',
            data: { 
                id: event.id,
                meta: cleanMeta,
                status: event.status,
                terms: event.terms || [] // Send terms
            }
        })
        .then(() => {
            setSavingId(null);
            setExpandedId(null); // Collapse after saving
            setNotice({ type: 'success', message: `${event.title} updated successfully!` });
            setTimeout(() => setNotice(null), 3000);
        })
        .catch(err => {
            setSavingId(null);
            setNotice({ type: 'error', message: err.message || __('Error saving event.', 'first-church-core-blocks') });
        });
    };

    if (isLoading) {
        return <div className="fc-dashboard__loading"><Spinner /> { __('Loading events...', 'first-church-core-blocks') }</div>;
    }

    return (
        <div className="fc-content-manager fc-event-manager">
            <header className="fc-content-manager__header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2>{ __('Event Manager', 'first-church-core-blocks') }</h2>
                        <p>{ __('Manage event details and metadata for the upcoming feed.', 'first-church-core-blocks') }</p>
                    </div>
                    <Button 
                        variant="primary" 
                        icon="plus"
                        onClick={() => setIsCreating(true)}
                        disabled={isCreating}
                    >
                        { __('Add New Event', 'first-church-core-blocks') }
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
                            <h3>{ __('New Event', 'first-church-core-blocks') }</h3>
                        </CardHeader>
                        <CardBody>
                            <TextControl
                                label={__('Event Title', 'first-church-core-blocks')}
                                value={newTitle}
                                onChange={setNewTitle}
                                placeholder={__('e.g. Gospel Concert 2026', 'first-church-core-blocks')}
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

                {events.map((event, index) => {
                    const isExpanded = event.id === expandedId;
                    return (
                        <Card key={event.id} className={`fc-content-item-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
                            <CardHeader 
                                className="fc-content-item-header" 
                                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                                    <span style={{ fontSize: '18px', opacity: 0.5 }}>
                                        {isExpanded ? '−' : '+'}
                                    </span>
                                    <h3 style={{ margin: 0 }}>{ event.title }</h3>
                                    {!isExpanded && (
                                        <div className="fc-content-item-summary">
                                            {event.meta._event_start_date && <span>📅 {event.meta._event_start_date}</span>}
                                            {event.meta._event_location && <span>📍 {event.meta._event_location}</span>}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {event.meta._event_is_canceled && <span className="fc-status-badge is-archived" style={{ background: '#d63638', color: 'white' }}>{__('CANCELED', 'first-church-core-blocks')}</span>}
                                    <span className={`fc-status-badge is-${event.status}`}>{ event.status }</span>
                                </div>
                            </CardHeader>
                            {isExpanded && (
                                <>
                                    <CardBody>
                                        <div className="fc-content-item-grid">
                                            <div className="fc-content-item-col">
                                                <p><strong>{ __('Start Date', 'first-church-core-blocks') }</strong></p>
                                                <DatePicker
                                                    currentDate={event.meta._event_start_date}
                                                    onChange={(val) => handleUpdateMeta(index, '_event_start_date', val)}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <p><strong>{ __('End Date / Complex Schedule', 'first-church-core-blocks') }</strong></p>
                                                <TextareaControl
                                                    value={event.meta._event_schedule || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_event_schedule', val)}
                                                    placeholder={__('e.g. \nFriday: 7pm - Worship\nSaturday: 10am - Brunch', 'first-church-core-blocks')}
                                                    help={__('Overrides "End Date". Enter each line separately.', 'first-church-core-blocks')}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('Location', 'first-church-core-blocks')}
                                                    value={event.meta._event_location || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_event_location', val)}
                                                />
                                                <div style={{ marginTop: '16px' }}>
                                                    <ToggleControl
                                                        label={__('Cancelled?', 'first-church-core-blocks')}
                                                        help={__('Show "Canceled" badge on frontend.', 'first-church-core-blocks')}
                                                        checked={!!event.meta._event_is_canceled}
                                                        onChange={(val) => handleUpdateMeta(index, '_event_is_canceled', val)}
                                                    />
                                                </div>
                                                <div style={{ marginTop: '16px' }}>
                                                    <p style={{marginBottom:'8px'}}><strong>{__('Categories', 'first-church-core-blocks')}</strong></p>
                                                    <div className="fc-category-list" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
                                                        {availableTerms.length > 0 ? availableTerms.map(term => (
                                                            <CheckboxControl
                                                                key={term.id}
                                                                label={term.name}
                                                                checked={(event.terms || []).includes(term.id)}
                                                                onChange={(isChecked) => handleUpdateTerms(index, term.id, isChecked)}
                                                            />
                                                        )) : <p style={{fontStyle:'italic', color:'#666'}}>{__('No categories found.', 'first-church-core-blocks')}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="fc-content-item-col">
                                                <TextControl
                                                    label={__('CTA Text', 'first-church-core-blocks')}
                                                    value={event.meta._event_cta_text || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_event_cta_text', val)}
                                                />
                                                <TextControl
                                                    label={__('CTA URL', 'first-church-core-blocks')}
                                                    value={event.meta._event_cta_url || ''}
                                                    onChange={(val) => handleUpdateMeta(index, '_event_cta_url', val)}
                                                    placeholder="https://"
                                                />
                                                <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                                                    <SelectControl
                                                        label={__('Post Status', 'first-church-core-blocks')}
                                                        value={event.status}
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
                                            onClick={() => handleSave(event)}
                                            disabled={savingId === event.id}
                                        >
                                            {savingId === event.id ? <Spinner /> : __('Save Changes', 'first-church-core-blocks')}
                                        </Button>
                                        <Button variant="link" href={`post.php?post=${event.id}&action=edit`}>
                                            { __('Open in Editor', 'first-church-core-blocks') }
                                        </Button>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    );
                })}

                {events.length === 0 && !isCreating && (
                    <p className="fc-dashboard__empty">{ __('No events found.', 'first-church-core-blocks') }</p>
                )}
            </div>
        </div>
    );
}
