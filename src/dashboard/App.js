
import { __ } from '@wordpress/i18n';
import { Button, TabPanel, Dashicon } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import TemplateCard from './components/TemplateCard';
import StewardshipStats from './components/StewardshipStats'; // Renamed from StatsBar
import ActivityFeed from './components/ActivityFeed';
import MegaMenuManager from './components/MegaMenuManager';
import FooterManager from './components/FooterManager';
import EventManager from './components/EventManager';
import LocationManager from './components/LocationManager';
import FundraiserManager from './components/FundraiserManager';
import BaptismManager from './components/BaptismManager';

export default function App() {
    // Data State
    const [data, setData] = useState({ 
        templates: [], 
        stats: {}, 
        recent: [], 
        megaMenuData: null, 
        footerData: null,
        fundraiserData: [] 
    });
    
    // UI State
    const [settings, setSettings] = useState({ banner_url: '', banner_id: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    // Fetch Content Logic
    const fetchData = () => {
        setIsLoading(true);
        // 1. Fetch Content
        apiFetch({ path: '/firstchurch/v1/templates' })
            .then(response => {
                setData(prev => ({ ...prev, ...response }));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching dashboard content:', error);
                setIsLoading(false);
            });
    };

    // Fetch Settings Logic
    const fetchSettings = () => {
        apiFetch({ path: '/firstchurch/v1/settings' })
            .then(s => setSettings(s))
            .catch(err => console.error('Error fetching settings:', err));
    }

    // Initialize
    useEffect(() => {
        fetchData();
        fetchSettings();
        
        // Dynamic Greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting(__('Good Morning', 'first-church-core-blocks'));
        else if (hour < 18) setGreeting(__('Good Afternoon', 'first-church-core-blocks'));
        else setGreeting(__('Good Evening', 'first-church-core-blocks'));

    }, []);

    // Banner Uploader Handler
    const openMediaLibrary = () => {
        const frame = wp.media({
            title: __('Select Ministry Banner', 'first-church-core-blocks'),
            multiple: false,
            library: { type: 'image' },
            button: { text: __('Use as Banner', 'first-church-core-blocks') }
        });

        frame.on('select', () => {
            const attachment = frame.state().get('selection').first().toJSON();
            const newSettings = {
                banner_url: attachment.url,
                banner_id: attachment.id
            };
            
            // Optimistic Update
            setSettings(newSettings);
            
            // Persist
            apiFetch({
                path: '/firstchurch/v1/settings',
                method: 'POST',
                data: newSettings
            }).then(() => {
                // Success feedback if needed
            });
        });

        frame.open();
    };

    // --- Computed Data ---
    const { templates, stats, recent, megaMenuData, footerData, fundraiserData } = data;
    const enrichedStats = {
        ...stats,
        fundraisers: (fundraiserData || []).length
    };

    // --- Render Helpers ---
    const renderTemplatesView = () => (
        <div className="fc-dashboard__templates-view">
            <div className="fc-dashboard__top-grid">
                <div className="fc-dashboard__main-column">
                    <section className="fc-dashboard__section">
                        <StewardshipStats stats={enrichedStats} />
                    </section>
                </div>
                <div className="fc-dashboard__sidebar-column">
                     <ActivityFeed items={recent} />
                </div>
            </div>

            {/* Template Collections */}
            {templates.map(group => (
                <section key={group.id} className="fc-dashboard__section">
                    <div className="fc-dashboard__section-header">
                        <h2>{ group.title }</h2>
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
        </div>
    );

    return (
        <div className="fc-dashboard fc-mission-control">
            
            {/* 1. HERO HEADER */}
            <header className="fc-mission-control__header">
                {settings.banner_url && (
                    <img 
                        src={settings.banner_url} 
                        alt="Ministry Banner" 
                        className="fc-mission-control__banner-bg" 
                    />
                )}
                
                <div className="fc-mission-control__hero-content">
                    <div className="fc-mission-control__welcome">
                        <span className="fc-beta-pill">Beta</span>
                        <h1>{ __('Greetings, what would you like to create?', 'first-church-core-blocks') }</h1>
                        <p>{ __('Powered by First Church', 'first-church-core-blocks') }</p>
                    </div>

                    <div className="fc-mission-control__dock">
                         <a href="/" target="_blank" className="fc-dock-btn">
                            <Dashicon icon="external" />
                            {__('Visit Site', 'first-church-core-blocks')}
                        </a>
                        <button onClick={openMediaLibrary} className="fc-dock-btn">
                            <Dashicon icon="camera" />
                            {__('Edit Banner', 'first-church-core-blocks')}
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. MAIN SANCTUARY (TABS) */}
            {isLoading ? (
                <div className="fc-dashboard__loading">Preparing the sanctuary...</div>
            ) : (
                <TabPanel
                    className="fc-dashboard__tabs"
                    activeClass="is-active"
                    tabs={[
                        { name: 'templates', title: 'Start Creating', className: 'fc-tab-create' },
                        { name: 'events', title: 'Events', className: 'fc-tab-events' },
                        { name: 'locations', title: 'Locations', className: 'fc-tab-locations' },
                        { name: 'baptisms', title: 'Baptisms', className: 'fc-tab-baptisms' },
                        { name: 'fundraisers', title: 'Fundraisers', className: 'fc-tab-funds' },
                        { name: 'megamenu', title: 'Mega Menu', className: 'fc-tab-menu' },
                        { name: 'footer', title: 'Footer', className: 'fc-tab-footer' },
                    ]}
                >
                    {(tab) => {
                        switch(tab.name) {
                            case 'megamenu': return <MegaMenuManager initialData={megaMenuData} onSaveSuccess={fetchData} />;
                            case 'footer': return <FooterManager initialData={footerData} onSaveSuccess={fetchData} />;
                            case 'events': return <EventManager />;
                            case 'fundraisers': return <FundraiserManager initialData={fundraiserData} onSaveSuccess={fetchData} />;
                            case 'locations': return <LocationManager />;
                            case 'baptisms': return <BaptismManager />;
                            default: return renderTemplatesView();
                        }
                    }}
                </TabPanel>
            )}
        </div>
    );
}

