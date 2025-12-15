import React, { useState, useEffect } from 'react';
import './Hero.css';

/**
 * Hero Component
 * 
 * @param {string} mode - 'static' | 'slideshow'
 * @param {string} layout - 'bottom-left' | 'middle-left' | 'center'
 * @param {Array} media - Array of { id, url, alt } objects
 * @param {number} overlayOpacity - 0 to 100
 * @param {React.ReactNode} children - Content to render inside (InnerBlocks)
 */
export const Hero = ({
    mode = 'static',
    layout = 'middle-left',
    media = [],
    overlayOpacity = 50,
    children
}) => {
    // --- State for Slideshow ---
    const [currentIndex, setCurrentIndex] = useState(0);

    // --- Slideshow Logic ---
    useEffect(() => {
        if (mode === 'slideshow' && media.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % media.length);
            }, 5000); // 5 second rotation
            return () => clearInterval(interval);
        }
    }, [mode, media]);

    // --- Helpers ---
    const hasMedia = media && media.length > 0;
    
    // For static mode, we just use the first image.
    // For slideshow, we map all images and fade them.
    const renderMedia = () => {
        if (!hasMedia) {
            return <div className="antigravity-hero__image" style={{ backgroundColor: '#2c2c2c' }} />;
        }

        return media.map((item, index) => {
            const isActive = mode === 'static' ? index === 0 : index === currentIndex;
            return (
                <img
                    key={index}
                    src={item.url}
                    alt={item.alt || 'Hero Background'}
                    className="antigravity-hero__image"
                    style={{ 
                        opacity: isActive ? 1 : 0,
                        zIndex: isActive ? 1 : 0
                    }}
                />
            );
        });
    };

    // Calculate dynamic overlay style
    // If layout is Center, we assume a full dimmer.
    // If layout is Left (Immersive), we use a gradient scrim.
    // We can use overlayOpacity to adjust the alpha of that effect.
    // For MVP, we will stick to the CSS classes for simplicity, but we could use inline styles for fine-tuning.

    return (
        <header className={`antigravity-hero antigravity-hero--layout-${layout} antigravity-hero--mode-${mode}`}>
            
            {/* 1. Media Layer */}
            <div className="antigravity-hero__media">
                {renderMedia()}
            </div>

            {/* 2. Overlay Layer */}
            <div 
                className="antigravity-hero__overlay" 
                style={{ opacity: overlayOpacity / 100 }}
            />

            {/* 3. Content Layer (InnerBlocks) */}
            <div className="antigravity-hero__content">
                {children}
            </div>

            {/* 4. Slideshow Controls (Optional, usually dots at bottom) */}
            {mode === 'slideshow' && media.length > 1 && (
                <div className="antigravity-hero__dots" style={{ 
                    /* Positioning handled in CSS for responsiveness */
                    zIndex: 3, 
                    display: 'flex', 
                    gap: '10px' 
                }}>
                    {media.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                border: 'none',
                                padding: 0,
                                backgroundColor: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                        />
                    ))}
                </div>
            )}
        </header>
    );
};
