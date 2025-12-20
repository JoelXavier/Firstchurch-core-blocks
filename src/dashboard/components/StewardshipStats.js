import { __ } from '@wordpress/i18n';
import { Dashicon } from '@wordpress/components';

export default function StewardshipStats({ stats }) {
    const items = [
        {
            label: __('Baptisms', 'first-church-core-blocks'),
            count: stats.baptisms || 0,
            icon: 'heart',
            color: 'var(--fc-primary)'
        },
        {
            label: __('Upcoming Events', 'first-church-core-blocks'),
            count: stats.upcoming_events || 0,
            icon: 'calendar-alt',
            color: 'var(--fc-accent)'
        },
        {
            label: __('Active Locations', 'first-church-core-blocks'),
            count: stats.active_locations || stats.locations || 0, // Fallback to 'locations' if 'active_locations' mismatch
            icon: 'location',
            color: '#4b5563'
        },
        {
            label: __('Articles', 'first-church-core-blocks'),
            count: stats.articles || 0,
            icon: 'admin-post',
            color: '#2563EB'
        },
        {
            label: __('Pages', 'first-church-core-blocks'),
            count: stats.pages || 0,
            icon: 'admin-page',
            color: '#4B5563'
        },
        {
            label: __('Fundraisers', 'first-church-core-blocks'),
            count: stats.fundraisers || 0,
            icon: 'money',
            color: '#059669'
        }
    ];

    return (
        <div className="fc-stewardship-grid">
            {items.map((item, index) => (
                <div key={index} className="fc-stewardship-card">
                    <div className="fc-stewardship-card__value">{item.count}</div>
                    <div className="fc-stewardship-card__label">{item.label}</div>
                    <div className="fc-stewardship-card__icon">
                        <Dashicon icon={item.icon} />
                    </div>
                </div>
            ))}
        </div>
    );
}
