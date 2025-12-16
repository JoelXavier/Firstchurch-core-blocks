import React from 'react';
import './Location.scss';

/**
 * Location Component
 * 
 * A high-impact 'Visit Us' module with location info and map.
 * 
 * @param {string} heading - Main headline (e.g., "Visit Apostle...")
 * @param {string} subHeading - Eyebrow text (e.g., "International Headquarters")
 * @param {string[]} addressLines - Array of address strings
 * @param {Array<{label: string, time: string}>} schedule - Array of schedule objects
 * @param {string} mapEmbedIframe - Raw HTML string for the iframe
 */
export const Location = ({
  heading = "Visit Apostle, Pastor Gino Jennings",
  subHeading = "International Headquarters Campus",
  addressLines = [
    "5105 N. 5th Street",
    "Philadelphia, PA. 19120"
  ],
  schedule = [
    { label: "Tuesday", time: "@ 7pm" },
    { label: "Sunday", time: "11am & 5pm" }
  ],
  mapEmbedIframe,
}) => {
  return (
    <div className="fc-location">
      <div className="fc-location__grid">
        
        {/* Left Column: Info */}
        <div className="fc-location__info">
          
          <div className="location-header-group">
            {subHeading && (
              <h4 className="fc-location__subheading">{subHeading}</h4>
            )}
            <h2 className="fc-location__heading">{heading}</h2>
            <div className="fc-location__divider"></div>
          </div>

          <ul className="fc-location__schedule">
            {schedule.map((item, index) => (
              <li key={index} className="fc-location__schedule-item">
                <span className="fc-location__schedule-day">{item.label}</span>
                <span className="fc-location__schedule-time">{item.time}</span>
              </li>
            ))}
          </ul>

          {/* Optional: Text Address if not using floating card */}
          {/* 
          <div className="fc-location__address">
            {addressLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div> 
          */}
        </div>

        {/* Right Column: Map */}
        <div className="fc-location__map">
          {/* Render Iframe safely */}
          <div 
            className="map-embed-container" 
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: mapEmbedIframe }}
          />

          {/* Floating Address Card */}
          <div className="fc-location__map-card">
            <div className="fc-location__map-card-address">
              {addressLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Location;
