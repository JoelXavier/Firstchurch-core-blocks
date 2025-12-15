import React from 'react';
import './HeroSplit.scss';

export function HeroSplit({
    label = "Label",
    title = "Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia",
    imageSrc = "https://placehold.co/800x800/222/gold",
    linkText = "Learn More",
    linkUrl = "#",
    imagePosition = "left", // 'left' or 'right'
    backgroundColor = "#1a1a1a", // Default Soft Charcoal
    textColor = "#f1eadd", // Default Sandwood
    linkColor = "#ffffff" // Default White
}) {
    
    // Inline styles for user customization
    const customStyles = {
        '--hero-split-bg': backgroundColor,
        '--hero-split-text': textColor,
        '--hero-split-link': linkColor
    };

    return (
        <section 
            className={`antigravity-hero-split ${imagePosition === 'right' ? 'image-right' : ''}`}
            style={customStyles}
        >
            {/* Image Side */}
            <div className="hero-split-image-wrapper">
                <img src={imageSrc} alt="" className="hero-split-image" />
            </div>

            {/* Content Side */}
            <div className="hero-split-content">
                <span className="hero-split-label">{label}</span>
                <h2 className="hero-split-title">{title}</h2>
                
                <a href={linkUrl} className="hero-split-link">
                    {linkText}
                    {/* Simple chevron arrow */}
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                </a>

                <div className="hero-split-bar"></div>
            </div>
        </section>
    );
}
