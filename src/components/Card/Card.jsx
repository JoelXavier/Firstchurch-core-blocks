import React from 'react';
import './Card.scss';

export function CardItem({ 
  label = "LABEL", 
  title = "Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia", 
  excerpt,
  linkText = "LEARN MORE >", 
  image, 
  href = "#" 
}) {
  return (
    <div className="fc-card-item">
      <a href={href} className="fc-card-link-wrapper">
        <div className="fc-card-image-wrapper">
          {image ? (
            <img src={image} alt={title} className="fc-card-image" />
          ) : (
             <div className="fc-card-image-placeholder" />
          )}
        </div>

        <div className="fc-card-content">
          <div className="fc-card-text-group">
            {label && <span className="fc-card-label">{label}</span>}
            {title && <h3 className="fc-card-title" dangerouslySetInnerHTML={{ __html: title }} />}
            {excerpt && <div className="fc-card-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />}
          </div>
          
          <span className="fc-card-cta">{linkText}</span>
        </div>
      </a>
    </div>
  );
}

export function CardGrid({ children, sectionTitle = "Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia" }) {
  return (
    <div className="fc-card-grid">
      
      <div className="fc-card-grid__header">
        <h2 className="fc-section-title">{sectionTitle}</h2>
        <div className="fc-section-line"></div>
      </div>

      <div className="fc-card-grid__container">
        {children}
      </div>
    </div>
  );
}

// Explicit display names are good practice regardless
CardItem.displayName = 'CardItem';
CardGrid.displayName = 'CardGrid';
