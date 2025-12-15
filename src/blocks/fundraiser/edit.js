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
                <PanelBody title={__('Fundraiser Settings', 'antigravity-core')}>
                    <TextControl
                        label={__('Goal Amount ($)', 'antigravity-core')}
                        type="number"
                        value={goalAmount}
                        onChange={(value) => setAttributes({ goalAmount: parseInt(value) || 0 })}
                    />
                    <TextControl
                        label={__('Raised Amount ($)', 'antigravity-core')}
                        type="number"
                        value={raisedAmount}
                        onChange={(value) => setAttributes({ raisedAmount: parseInt(value) || 0 })}
                    />
                    <TextControl
                        label={__('Button Text', 'antigravity-core')}
                        value={linkText}
                        onChange={(value) => setAttributes({ linkText: value })}
                    />
                    <TextControl
                        label={__('Donation URL', 'antigravity-core')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...useBlockProps({ className: 'antigravity-fundraiser' }) }>
                
                <div className="fundraiser-header">
                    <RichText
                        tagName="h2"
                        className="fundraiser-title"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Enter Title...', 'antigravity-core')}
                    />
                    <div className="fundraiser-line"></div>
                </div>

                <div className="fundraiser-container">
                    {/* Metrics */}
                    <div className="fundraiser-metrics">
                        <div className="metric-group">
                            <span className="metric-label">Raised</span>
                            <span className="metric-value raised">{formatCurrency(raisedAmount)}</span>
                        </div>
                         <div className="metric-group" style={{ textAlign: 'right' }}>
                            <span className="metric-label">Goal</span>
                            <span className="metric-value goal">{formatCurrency(goalAmount)}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                    </div>

                    {/* Actions */}
                    <div className="fundraiser-actions">
                        <span className="donate-button disabled-in-editor">
                            {linkText}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
