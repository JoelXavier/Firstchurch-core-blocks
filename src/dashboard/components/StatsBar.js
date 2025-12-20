import { __ } from '@wordpress/i18n';
import { Card, CardBody } from '@wordpress/components';

export default function StatsBar({ stats }) {
    if (!stats) return null;

    const items = [
        { label: __('Articles', 'first-church-core-blocks'), count: stats.articles, icon: 'dashicons-admin-post' },
        { label: __('Events', 'first-church-core-blocks'), count: stats.events, icon: 'dashicons-calendar-alt' },
        { label: __('Locations', 'first-church-core-blocks'), count: stats.locations, icon: 'dashicons-location' },
        { label: __('Fundraisers', 'first-church-core-blocks'), count: stats.fundraisers, icon: 'dashicons-money-alt' },
        { label: __('Baptisms', 'first-church-core-blocks'), count: stats.baptisms || 0, icon: 'dashicons-analytics' },
        { label: __('Pages', 'first-church-core-blocks'), count: stats.pages, icon: 'dashicons-admin-page' },
    ];

    return (
        <div className="fc-dashboard__stats-grid">
            {items.map((item, index) => (
                <div key={index} className="fc-dashboard__stat-card">
                    <span className={`dashicons ${item.icon} fc-dashboard__stat-icon`}></span>
                    <div className="fc-dashboard__stat-content">
                        <span className="fc-dashboard__stat-count">{item.count}</span>
                        <span className="fc-dashboard__stat-label">{item.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
