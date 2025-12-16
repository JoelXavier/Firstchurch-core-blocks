import React from 'react';
import './Fundraiser.scss';

export function Fundraiser({
    title = "FC Convention Center Fundraiser",
    goalAmount = 5000000,
    raisedAmount = 1644394,
    linkText = "Donate to FC Convention Center Fundraiser",
    linkUrl = "#"
}) {
    // Format currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const percentage = Math.min(100, Math.max(0, (raisedAmount / goalAmount) * 100));

    return (
        <section className="fc-fundraiser">
            
            <div className="fc-fundraiser__header">
                <h2 className="fc-fundraiser__title">{title}</h2>
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
                <div className="fc-fundraiser__progress-track" aria-valuemin="0" aria-valuemax={goalAmount} aria-valuenow={raisedAmount}>
                    <div className="fc-fundraiser__progress-fill" style={{ width: `${percentage}%` }}></div>
                </div>

                {/* Actions */}
                <div className="fc-fundraiser__actions">
                    <a href={linkUrl} className="fc-fundraiser__button">
                        {linkText}
                    </a>
                </div>
            </div>

        </section>
    );
}

Fundraiser.displayName = 'Fundraiser';
