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
        <header className={`fc-article-hero fc-article-hero--${variant}`}>
            {/* Background Image (Immersive Only) */}
            {variant === 'immersive' && imageUrl && (
                <div className="fc-article-hero__bg">
                    <img src={imageUrl} alt="" />
                    <div className="fc-article-hero__overlay"></div>
                </div>
            )}

            <div className="fc-article-hero__container">
                <div className="fc-article-hero__content">
                    {/* Meta Top */}
                    <div className="fc-article-hero__meta-top">
                        <span className="fc-article-hero__category">{category}</span>
                        <span className="fc-article-hero__date">{date}</span>
                    </div>

                    <h1 className="fc-article-hero__title">{title}</h1>

                    {/* Meta Bottom */}
                    <div className="fc-article-hero__meta-bottom">
                        <span className="fc-article-hero__byline">By <span className="fc-article-hero__author">{author}</span></span>
                    </div>
                </div>
            </div>

            {/* Standard Image (Below Title) */}
            {variant === 'standard' && imageUrl && (
                <div className="fc-article-hero__standard-media">
                    <img src={imageUrl} alt={title} />
                </div>
            )}
        </header>
    );
};
