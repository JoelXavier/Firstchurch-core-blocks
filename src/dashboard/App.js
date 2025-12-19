import { __ } from '@wordpress/i18n';
import { Button, TabPanel } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import TemplateCard from './components/TemplateCard';
import StatsBar from './components/StatsBar';
import ActivityFeed from './components/ActivityFeed';
import MegaMenuManager from './components/MegaMenuManager';
import FooterManager from './components/FooterManager';
import EventManager from './components/EventManager';
import LocationManager from './components/LocationManager';

export default function App() {
    const [data, setData] = useState({ templates: [], stats: {}, recent: [], megaMenuData: null, footerData: null });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = () => {
        setIsLoading(true);
        apiFetch({ path: '/firstchurch/v1/templates' })
            .then(response => {
                setData(response);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching dashboard content:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { templates, stats, recent, megaMenuData, footerData } = data;

    const renderTemplates = () => (
        <div className="fc-dashboard__templates-view">
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

            {templates.map(group => (
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
            ))}
            
            {templates.length === 0 && (
                <p className="fc-dashboard__empty">{ __('No templates found.', 'first-church-core-blocks') }</p>
            )}
        </div>
    );

    return (
        <div className="fc-dashboard">
            <header className="fc-dashboard__header">
                <h1>{ __('Greetings! What would you like to create?', 'first-church-core-blocks') }</h1>
            </header>

            {isLoading ? (
                <div className="fc-dashboard__loading">Loading mission control...</div>
            ) : (
                <TabPanel
                    className="fc-dashboard__tabs"
                    activeClass="is-active"
                    tabs={[
                        {
                            name: 'templates',
                            title: __('Templates', 'first-church-core-blocks'),
                            className: 'fc-dashboard-tab-templates',
                        },
                        {
                            name: 'megamenu',
                            title: __('Mega Menu', 'first-church-core-blocks'),
                            className: 'fc-dashboard-tab-megamenu',
                        },
                        {
                            name: 'footer',
                            title: __('Footer', 'first-church-core-blocks'),
                            className: 'fc-dashboard-tab-footer',
                        },
                        {
                            name: 'events',
                            title: __('Events', 'first-church-core-blocks'),
                            className: 'fc-dashboard-tab-events',
                        },
                        {
                            name: 'locations',
                            title: __('Locations', 'first-church-core-blocks'),
                            className: 'fc-dashboard-tab-locations',
                        },
                    ]}
                >
                    {(tab) => {
                        if (tab.name === 'megamenu') {
                            return (
                                <MegaMenuManager 
                                    initialData={megaMenuData} 
                                    onSaveSuccess={fetchData} 
                                />
                            );
                        }
                        if (tab.name === 'footer') {
                            return (
                                <FooterManager 
                                    initialData={footerData} 
                                    onSaveSuccess={fetchData} 
                                />
                            );
                        }
                        if (tab.name === 'events') {
                            return <EventManager />;
                        }
                        if (tab.name === 'locations') {
                            return <LocationManager />;
                        }
                        return renderTemplates();
                    }}
                </TabPanel>
            )}
        </div>
    );
}
