import React from 'react';
import './ArticleHero.scss';

/**
 * Article Hero Component
 * 
 * @param {string} title - Main headline (H1)
 * @param {string} date - Publish date
 * @param {string} author - Author name
 * @param {string} category - Category label
 * @param {string} imageUrl - Featured image URL
 * @param {string} variant - 'standard' | 'immersive'
 */
export const ArticleHero = ({
    title = "The Church Triumphant",
    date = "October 12, 2025",
    author = "Pastor Gino Jennings",
    category = "Convocation",
    imageUrl,
    variant = "standard"
}) => {
    return (
        <header className={`antigravity-article-hero variant-${variant}`}>
            {/* Background Image (Immersive Only) */}
            {variant === 'immersive' && imageUrl && (
                <div className="article-hero-bg">
                    <img src={imageUrl} alt="" />
                    <div className="article-hero-overlay"></div>
                </div>
            )}

            <div className="article-hero-container">
                <div className="article-hero-content">
                    {/* Meta Top */}
                    <div className="article-meta-top">
                        <span className="article-category">{category}</span>
                        <span className="article-date">{date}</span>
                    </div>

                    <h1 className="article-title">{title}</h1>

                    {/* Meta Bottom */}
                    <div className="article-meta-bottom">
                        <span className="article-byline">By <span className="author-name">{author}</span></span>
                    </div>
                </div>
            </div>

            {/* Standard Image (Below Title) */}
            {variant === 'standard' && imageUrl && (
                <div className="article-hero-standard-image">
                    <img src={imageUrl} alt={title} />
                </div>
            )}
        </header>
    );
};
