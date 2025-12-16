import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { title, goalAmount, raisedAmount, linkText, linkUrl } = attributes;

    const formatCurrency = (val) => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(val);
        } catch (e) {
            return val;
        }
    };

    const percentage = Math.min(100, Math.max(0, (raisedAmount / goalAmount) * 100));

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Fundraiser Settings', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Goal Amount ($)', 'first-church-core-blocks')}
                        type="number"
                        value={goalAmount}
                        onChange={(value) => setAttributes({ goalAmount: parseInt(value) || 0 })}
                    />
                    <TextControl
                        label={__('Raised Amount ($)', 'first-church-core-blocks')}
                        type="number"
                        value={raisedAmount}
                        onChange={(value) => setAttributes({ raisedAmount: parseInt(value) || 0 })}
                    />
                    <TextControl
                        label={__('Button Text', 'first-church-core-blocks')}
                        value={linkText}
                        onChange={(value) => setAttributes({ linkText: value })}
                    />
                    <TextControl
                        label={__('Donation URL', 'first-church-core-blocks')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...useBlockProps({ className: 'fc-fundraiser' }) }>
                
                <div className="fc-fundraiser__header">
                    <RichText
                        tagName="h2"
                        className="fc-fundraiser__title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Enter Title...', 'first-church-core-blocks')}
                    />
                    <div className="fc-fundraiser__line"></div>
                </div>

                <div className="fc-fundraiser__container">
                    {/* Metrics */}
                    <div className="fc-fundraiser__metrics">
                        <div className="fc-fundraiser__metric-group">
                            <span className="fc-fundraiser__metric-label">Raised</span>
                            <span className="fc-fundraiser__metric-value fc-fundraiser__metric-value--raised">{formatCurrency(raisedAmount)}</span>
                        </div>
                         <div className="fc-fundraiser__metric-group" style={{ textAlign: 'right' }}>
                            <span className="fc-fundraiser__metric-label">Goal</span>
                            <span className="fc-fundraiser__metric-value fc-fundraiser__metric-value--goal">{formatCurrency(goalAmount)}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="fc-fundraiser__progress-track">
                        <div className="fc-fundraiser__progress-fill" style={{ width: `${percentage}%` }}></div>
                    </div>

                    {/* Actions */}
                    <div className="fc-fundraiser__actions">
                        <span className="fc-fundraiser__button disabled-in-editor">
                            {linkText}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
