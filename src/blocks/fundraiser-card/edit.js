import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InspectorControls, 
    RichText,
    PanelColorSettings
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl, 
    ToggleControl, 
    SelectControl,
    Button,
    Placeholder,
    Spinner
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
    const { 
        label, 
        title, 
        description, 
        useDashboardData, 
        fundraiserId, 
        goalAmount, 
        raisedAmount, 
        showProgress, 
        linkText, 
        linkUrl 
    } = attributes;

    const [allFundraisers, setAllFundraisers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch centralized data for the dropdown
    useEffect(() => {
        if (useDashboardData) {
            setIsLoading(true);
            apiFetch({ path: '/firstchurch/v1/templates' }) // This endpoint now includes fundraiserData
                .then(response => {
                    setAllFundraisers(response.fundraiserData || []);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [useDashboardData]);

    // Find current fundraiser data if querying
    const currentFundraiser = allFundraisers.find(f => f.id === fundraiserId) || null;
    const activeGoal = useDashboardData && currentFundraiser ? currentFundraiser.goal : goalAmount;
    const activeRaised = useDashboardData && currentFundraiser ? currentFundraiser.raised : raisedAmount;
    const activeTitle = useDashboardData && currentFundraiser ? currentFundraiser.title : title;

    const percentage = Math.min(100, Math.max(0, (activeRaised / activeGoal) * 100)) || 0;

    const blockProps = useBlockProps({
        className: 'fc-fundraiser-card'
    });

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Data Settings', 'first-church-core-blocks')}>
                    <ToggleControl
                        label={__('Use Dashboard Data', 'first-church-core-blocks')}
                        help={__('Pull progress data from Mission Control.', 'first-church-core-blocks')}
                        checked={useDashboardData}
                        onChange={(val) => setAttributes({ useDashboardData: val })}
                    />
                    
                    {useDashboardData && (
                        isLoading ? <Spinner /> : (
                            <SelectControl
                                label={__('Select Campaign', 'first-church-core-blocks')}
                                value={fundraiserId}
                                options={[
                                    { label: __('Select a campaign...', 'first-church-core-blocks'), value: '' },
                                    ...allFundraisers.map(f => ({ label: f.title, value: f.id }))
                                ]}
                                onChange={(val) => setAttributes({ fundraiserId: parseInt(val) })}
                            />
                        )
                    )}
                </PanelBody>

                <PanelBody title={__('Content', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Label', 'first-church-core-blocks')}
                        value={label}
                        onChange={(val) => setAttributes({ label: val })}
                    />
                    {!useDashboardData && (
                        <TextControl
                            label={__('Title', 'first-church-core-blocks')}
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                        />
                    )}
                    <TextControl
                        label={__('Description', 'first-church-core-blocks')}
                        value={description}
                        onChange={(val) => setAttributes({ description: val })}
                    />
                </PanelBody>

                {!useDashboardData && (
                    <PanelBody title={__('Manual Metrics', 'first-church-core-blocks')}>
                        <TextControl
                            label={__('Goal Amount ($)', 'first-church-core-blocks')}
                            type="number"
                            value={goalAmount}
                            onChange={(val) => setAttributes({ goalAmount: parseInt(val) || 0 })}
                        />
                        <TextControl
                            label={__('Raised Amount ($)', 'first-church-core-blocks')}
                            type="number"
                            value={raisedAmount}
                            onChange={(val) => setAttributes({ raisedAmount: parseInt(val) || 0 })}
                        />
                    </PanelBody>
                )}

                <PanelBody title={__('Call to Action', 'first-church-core-blocks')}>
                    <ToggleControl
                        label={__('Show Progress Bar', 'first-church-core-blocks')}
                        checked={showProgress}
                        onChange={(val) => setAttributes({ showProgress: val })}
                    />
                    <TextControl
                        label={__('Button Text', 'first-church-core-blocks')}
                        value={linkText}
                        onChange={(val) => setAttributes({ linkText: val })}
                    />
                    <TextControl
                        label={__('Button URL', 'first-church-core-blocks')}
                        value={linkUrl}
                        onChange={(val) => setAttributes({ linkUrl: val })}
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="fc-fundraiser-card__inner">
                    <span className="fc-fundraiser-card__label">{label}</span>
                    <h3 className="fc-fundraiser-card__title">{activeTitle}</h3>
                    <p className="fc-fundraiser-card__description">{description}</p>
                    
                    {showProgress && (
                        <div className="fc-fundraiser-card__progress-container">
                             <div className="fc-fundraiser-card__metrics">
                                <div className="fc-fundraiser-card__metric-group">
                                    <span className="fc-fundraiser-card__metric-label">Raised</span>
                                    <span className="fc-fundraiser-card__metric-val">{formatCurrency(activeRaised)}</span>
                                </div>
                                <div className="fc-fundraiser-card__metric-group">
                                    <span className="fc-fundraiser-card__metric-label">Goal</span>
                                    <span className="fc-fundraiser-card__metric-val">{formatCurrency(activeGoal)}</span>
                                </div>
                            </div>
                            <div className="fc-fundraiser-card__progress-track">
                                <div className="fc-fundraiser-card__progress-fill" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    )}

                    <div className="fc-fundraiser-card__footer">
                        <span className="fc-fundraiser-card__button disabled-in-editor">
                            {linkText}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
