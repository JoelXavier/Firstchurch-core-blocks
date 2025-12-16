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
    <div className={`fc-quote fc-quote--layout-${layout} fc-quote--variant-${variant}`}>
      <div className="fc-quote__container">
        
        {/* Decorative Icon */}
        {showIcon && <div className="fc-quote__icon" aria-hidden="true">“</div>}

        <blockquote className="fc-quote__content">
          <p className="fc-quote__text">{quote}</p>
          {citation && (
            <footer className="fc-quote__citation">
              <span className="fc-quote__line"></span>
              <cite>{citation}</cite>
            </footer>
          )}
        </blockquote>

      </div>
    </div>
  );
};
