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
        <section className="antigravity-fundraiser">
            
            <div className="fundraiser-header">
                <h2 className="fundraiser-title">{title}</h2>
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
                <div className="progress-track" aria-valuemin="0" aria-valuemax={goalAmount} aria-valuenow={raisedAmount}>
                    <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                </div>

                {/* Actions */}
                <div className="fundraiser-actions">
                    <a href={linkUrl} className="donate-button">
                        {linkText}
                    </a>
                </div>
            </div>

        </section>
    );
}

Fundraiser.displayName = 'Fundraiser';
