import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import TemplateCard from './components/TemplateCard';

export default function App() {
    const [templateGroups, setTemplateGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiFetch({ path: '/firstchurch/v1/templates' })
            .then(groups => {
                setTemplateGroups(groups);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="fc-dashboard">
            <header className="fc-dashboard__header">
                <h1>{ __('Welcome! What would you like to create?', 'first-church-core-blocks') }</h1>
            </header>

            <section className="fc-dashboard__section">
                <h2>{ __('Begin With A Blank Editor', 'first-church-core-blocks') }</h2>
                <div className="fc-dashboard__actions">
                    <Button variant="primary" href="post-new.php?post_type=post">{ __('New Article', 'first-church-core-blocks') }</Button>
                    <Button variant="secondary" href="post-new.php?post_type=event">{ __('New Event', 'first-church-core-blocks') }</Button>
                    <Button variant="secondary" href="post-new.php?post_type=location">{ __('New Location', 'first-church-core-blocks') }</Button>
                    <Button variant="secondary" href="post-new.php?post_type=page">{ __('New Page', 'first-church-core-blocks') }</Button>
                </div>
            </section>

            {isLoading ? (
                <div className="fc-dashboard__loading">Loading templated...</div>
            ) : (
                templateGroups.map(group => (
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
            
            {!isLoading && templateGroups.length === 0 && (
                <p className="fc-dashboard__empty">{ __('No templates found.', 'first-church-core-blocks') }</p>
            )}
        </div>
    );
}
