import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Modal, TextControl, Spinner, Card, CardBody, CardHeader } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

export default function BaptismManager() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Editing State
    const [editData, setEditData] = useState({ id: 0, label: '', count: 0, month: new Date().toISOString().slice(0, 7) });

    const fetchReports = () => {
        setIsLoading(true);
        apiFetch({ path: '/firstchurch/v1/baptisms' })
            .then(data => {
                setReports(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        apiFetch({
            path: '/firstchurch/v1/baptisms/save',
            method: 'POST',
            data: editData
        }).then(() => {
            setIsSaving(false);
            setIsModalOpen(false);
            fetchReports();
        }).catch(err => {
            console.error(err);
            setIsSaving(false);
        });
    };

    const handleDelete = (id) => {
        if (!confirm(__('Are you sure you want to delete this report?', 'first-church-core-blocks'))) return;
        
        // Optimistic UI update
        setReports(prev => prev.filter(r => r.id !== id));

        apiFetch({
            path: '/firstchurch/v1/baptisms/delete',
            method: 'POST',
            data: { id }
        }).catch(err => {
            console.error(err);
            fetchReports(); // Revert on error
        });
    };

    const openModal = (report = null) => {
        if (report) {
            setEditData({ ...report });
        } else {
            setEditData({ id: 0, label: '', count: 0, month: new Date().toISOString().slice(0, 7) });
        }
        setIsModalOpen(true);
    };

    // Group reports by month
    const groupedReports = reports.reduce((acc, report) => {
        const month = report.month || 'Unassigned';
        if (!acc[month]) acc[month] = [];
        acc[month].push(report);
        return acc;
    }, {});

    // Sort months descending
    const sortedMonths = Object.keys(groupedReports).sort().reverse();

    if (isLoading) return <div className="fc-dashboard__loading"><Spinner /></div>;

    return (
        <div className="fc-baptism-manager">
            <div className="fc-dashboard__section-header">
                <div>
                    <h2>{__('Baptismal Reports', 'first-church-core-blocks')}</h2>
                    <p>{__('Track monthly baptism statistics.', 'first-church-core-blocks')}</p>
                </div>
                <Button variant="primary" onClick={() => openModal()}>
                    {__('Add Report', 'first-church-core-blocks')}
                </Button>
            </div>

            {sortedMonths.length === 0 && (
                <p className="fc-dashboard__empty">{__('No reports found. Create one to get started.', 'first-church-core-blocks')}</p>
            )}

            {sortedMonths.map(month => (
                <section key={month} className="fc-dashboard__month-group" style={{ marginBottom: '32px' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                            {new Date(month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <span style={{ fontSize: '0.9em', color: '#666' }}>
                            {__('Total:', 'first-church-core-blocks')} <strong>{groupedReports[month].reduce((sum, r) => sum + r.count, 0)}</strong>
                        </span>
                    </h3>
                    
                    <div className="fc-dashboard__grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                        {groupedReports[month].map(report => (
                            <Card key={report.id}>
                                <CardHeader>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <strong>{report.label}</strong>
                                        <div className="fc-report-actions">
                                            <Button icon="edit" label="Edit" onClick={() => openModal(report)} isSmall />
                                            <Button icon="trash" label="Delete" isDestructive onClick={() => handleDelete(report.id)} isSmall />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--fc-burgundy)' }}>
                                        {report.count} {__('Souls', 'first-church-core-blocks')}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </section>
            ))}

            {isModalOpen && (
                <Modal title={editData.id ? __('Edit Report', 'first-church-core-blocks') : __('New Report', 'first-church-core-blocks')} onRequestClose={() => setIsModalOpen(false)}>
                    <TextControl
                        label={__('Report Label (e.g. Week 1)', 'first-church-core-blocks')}
                        value={editData.label}
                        onChange={(val) => setEditData({ ...editData, label: val })}
                    />
                    <TextControl
                        label={__('Souls Baptized', 'first-church-core-blocks')}
                        type="number"
                        value={editData.count}
                        onChange={(val) => setEditData({ ...editData, count: parseInt(val) || 0 })}
                    />
                    <TextControl
                        label={__('Month (YYYY-MM)', 'first-church-core-blocks')}
                        type="month"
                        value={editData.month}
                        onChange={(val) => setEditData({ ...editData, month: val })}
                        help={__('Reports are grouped by this month on the frontend.', 'first-church-core-blocks')}
                    />
                    <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{__('Cancel', 'first-church-core-blocks')}</Button>
                        <Button variant="primary" isBusy={isSaving} onClick={handleSave}>{__('Save Report', 'first-church-core-blocks')}</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
