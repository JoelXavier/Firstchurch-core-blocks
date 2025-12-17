import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

export default function ActivityFeed({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="fc-dashboard__activity-feed">
            <h3 className="fc-dashboard__section-title">{__('My Recent Drafts', 'first-church-core-blocks')}</h3>
            <ul className="fc-dashboard__activity-list">
                {items.map((item) => (
                    <li key={item.id} className="fc-dashboard__activity-item">
                        <div className="fc-dashboard__activity-info">
                            <a href={item.link} className="fc-dashboard__activity-title">{item.title}</a>
                            <span className="fc-dashboard__activity-meta">
                                {item.type} • {item.status} • {item.date}
                            </span>
                        </div>
                        <Button 
                            href={item.link} 
                            variant="secondary" 
                            isSmall
                            className="fc-dashboard__activity-btn"
                        >
                            {__('Edit', 'first-church-core-blocks')}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
