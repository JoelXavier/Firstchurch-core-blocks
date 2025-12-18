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
    ToggleControl
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function EventManager() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [notice, setNotice] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const fetchEvents = () => {
        setIsLoading(true);
        apiFetch({ path: '/firstchurch/v1/content?type=event' })
            .then(response => {
                setEvents(response);
                setIsLoading(false);
            })
            .catch(error => {
                setNotice({ type: 'error', message: error.message || __('Error loading events.', 'first-church-core-blocks') });
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
        const newEvents = [...events];
        newEvents[index].meta[key] = value;
        setEvents(newEvents);
    };

    const handleSave = (event) => {
        setSavingId(event.id);
        setNotice(null);

        apiFetch({
            path: '/firstchurch/v1/content/update',
            method: 'POST',
            data: { 
                id: event.id,
                meta: event.meta
            }
        })
        .then(() => {
            setSavingId(null);
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

                {events.map((event, index) => (
                    <Card key={event.id} className="fc-content-item-card">
                        <CardHeader className="fc-content-item-header">
                            <h3>{ event.title }</h3>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {event.meta._event_is_canceled && <span className="fc-status-badge is-archived" style={{ background: '#d63638', color: 'white' }}>{__('CANCELED', 'first-church-core-blocks')}</span>}
                                <span className={`fc-status-badge is-${event.status}`}>{ event.status }</span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="fc-content-item-grid">
                                <div className="fc-content-item-col">
                                    <p><strong>{ __('Start Date', 'first-church-core-blocks') }</strong></p>
                                    <DateTimePicker
                                        currentDate={event.meta._event_start_date}
                                        onChange={(val) => handleUpdateMeta(index, '_event_start_date', val)}
                                        is12Hour={true}
                                    />
                                </div>
                                <div className="fc-content-item-col">
                                    <p><strong>{ __('End Date', 'first-church-core-blocks') }</strong></p>
                                    <DateTimePicker
                                        currentDate={event.meta._event_end_date}
                                        onChange={(val) => handleUpdateMeta(index, '_event_end_date', val)}
                                        is12Hour={true}
                                    />
                                </div>
                                <div className="fc-content-item-col">
                                    <TextControl
                                        label={__('Location', 'first-church-core-blocks')}
                                        value={event.meta._event_location || ''}
                                        onChange={(val) => handleUpdateMeta(index, '_event_location', val)}
                                    />
                                    <TextControl
                                        label={__('Label', 'first-church-core-blocks')}
                                        value={event.meta._event_label || ''}
                                        onChange={(val) => handleUpdateMeta(index, '_event_label', val)}
                                    />
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
                                    />
                                    <ToggleControl
                                        label={__('Cancelled?', 'first-church-core-blocks')}
                                        help={__('Show "Canceled" badge on frontend.', 'first-church-core-blocks')}
                                        checked={!!event.meta._event_is_canceled}
                                        onChange={(val) => handleUpdateMeta(index, '_event_is_canceled', val)}
                                    />
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
                    </Card>
                ))}

                {events.length === 0 && !isCreating && (
                    <p className="fc-dashboard__empty">{ __('No events found.', 'first-church-core-blocks') }</p>
                )}
            </div>
        </div>
    );
}
