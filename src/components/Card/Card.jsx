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
    <div className="antigravity-card-item">
      <a href={href} className="card-link-wrapper">
        <div className="card-image-container">
          {image ? (
            <img src={image} alt={title} className="card-image" />
          ) : (
             <div className="card-image-placeholder" />
          )}
        </div>

        <div className="card-content">
          <div className="card-text-group">
            {label && <span className="card-label">{label}</span>}
            {title && <h3 className="card-title" dangerouslySetInnerHTML={{ __html: title }} />}
            {excerpt && <div className="card-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />}
          </div>
          
          <span className="card-cta">{linkText}</span>
        </div>
      </a>
    </div>
  );
}

export function CardGrid({ children, sectionTitle = "Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia" }) {
  return (
    <div className="antigravity-card-grid">
      
      <div className="card-grid-header">
        <h2 className="section-title">{sectionTitle}</h2>
        <div className="section-line"></div>
      </div>

      <div className="card-grid-container">
        {children}
      </div>
    </div>
  );
}

// Explicit display names are good practice regardless
CardItem.displayName = 'CardItem';
CardGrid.displayName = 'CardGrid';
