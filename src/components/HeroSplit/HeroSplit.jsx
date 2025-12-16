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
            className={`fc-hero-split ${imagePosition === 'right' ? 'fc-hero-split--right' : ''}`}
            style={customStyles}
        >
            {/* Image Side */}
            <div className="fc-hero-split__media">
                <img src={imageSrc} alt="" className="fc-hero-split__image" />
            </div>

            {/* Content Side */}
            <div className="fc-hero-split__content">
                <span className="fc-hero-split__label">{label}</span>
                <h2 className="fc-hero-split__title">{title}</h2>
                
                <a href={linkUrl} className="fc-hero-split__link">
                    {linkText}
                    {/* Simple chevron arrow */}
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                </a>

                <div className="fc-hero-split__bar"></div>
            </div>
        </section>
    );
}
