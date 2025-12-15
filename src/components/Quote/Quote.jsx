import React from 'react';
import './Quote.scss';

/**
 * Quote Component
 * 
 * @param {string} quote - The main quote text.
 * @param {string} citation - The author or source.
 * @param {string} layout - 'center' | 'side-line'
 */
export const Quote = ({
  quote = "For God so loved the world, that he gave his only begotten Son...",
  citation = "John 3:16",
  layout = "center",
  variant = "default",
  showIcon = true
}) => {
  return (
    <div className={`antigravity-quote-wrapper layout-${layout} variant-${variant}`}>
      <div className="antigravity-quote-container">
        
        {/* Decorative Icon */}
        {showIcon && <div className="quote-icon" aria-hidden="true">“</div>}

        <blockquote className="antigravity-quote-content">
          <p className="quote-text">{quote}</p>
          {citation && (
            <footer className="quote-citation">
              <span className="citation-line"></span>
              <cite>{citation}</cite>
            </footer>
          )}
        </blockquote>

      </div>
    </div>
  );
};
