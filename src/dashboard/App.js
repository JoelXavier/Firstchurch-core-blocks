import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import TemplateCard from './components/TemplateCard';
import StatsBar from './components/StatsBar';
import ActivityFeed from './components/ActivityFeed';

export default function App() {
    const [data, setData] = useState({ templates: [], stats: {}, recent: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiFetch({ path: '/firstchurch/v1/templates' })
            .then(response => {
                // Handle both old (array) and new (object) formats gracefully during dev
                if (Array.isArray(response)) {
                    setData({ templates: response, stats: {}, recent: [] });
                } else {
                    setData(response);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching dashboard content:', error);
                setIsLoading(false);
            });
    }, []);

    const { templates, stats, recent } = data;

    return (
        <div className="fc-dashboard">
            <header className="fc-dashboard__header">
                <h1>{ __('Welcome! What would you like to create?', 'first-church-core-blocks') }</h1>
            </header>

            {!isLoading && (
                <div className="fc-dashboard__top-grid">
                    <div className="fc-dashboard__main-column">
                        <section className="fc-dashboard__section">
                            <StatsBar stats={stats} />
                        </section>
                        
                        <section className="fc-dashboard__section">
                            <h2>{ __('Quick Start', 'first-church-core-blocks') }</h2>
                            <div className="fc-dashboard__actions">
                                <Button variant="primary" href="post-new.php?post_type=post">{ __('New Article', 'first-church-core-blocks') }</Button>
                                <Button variant="secondary" href="post-new.php?post_type=event">{ __('New Event', 'first-church-core-blocks') }</Button>
                                <Button variant="secondary" href="post-new.php?post_type=location">{ __('New Location', 'first-church-core-blocks') }</Button>
                                <Button variant="secondary" href="post-new.php?post_type=page">{ __('New Page', 'first-church-core-blocks') }</Button>
                            </div>
                        </section>
                    </div>

                    <div className="fc-dashboard__sidebar-column">
                        <ActivityFeed items={recent} />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="fc-dashboard__loading">Loading mission control...</div>
            ) : (
                templates.map(group => (
                    <section key={group.id} className="fc-dashboard__section">
                        <div className="fc-dashboard__section-header">
                            <h2>{ group.title }</h2>
                            <span className="fc-dashboard__post-type-badge">{ group.postType.toUpperCase() }</span>
                        </div>
                        <div className="fc-dashboard__grid">
                            {group.templates.map(template => (
                                <TemplateCard 
                                    key={template.id} 
                                    template={{...template, postType: group.postType}} 
                                />
                            ))}
                        </div>
                    </section>
                ))
            )}
            
            {!isLoading && templates.length === 0 && (
                <p className="fc-dashboard__empty">{ __('No templates found.', 'first-church-core-blocks') }</p>
            )}
        </div>
    );
}
