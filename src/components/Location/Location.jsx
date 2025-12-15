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
    <div className="antigravity-location-wrapper">
      <div className="antigravity-location-grid">
        
        {/* Left Column: Info */}
        <div className="antigravity-location-info">
          
          <div className="location-header-group">
            {subHeading && (
              <h4 className="antigravity-location-subheading">{subHeading}</h4>
            )}
            <h2 className="antigravity-location-heading">{heading}</h2>
            <div className="antigravity-location-divider"></div>
          </div>

          <ul className="antigravity-location-schedule">
            {schedule.map((item, index) => (
              <li key={index} className="antigravity-location-schedule-item">
                <span className="schedule-day">{item.label}</span>
                <span className="schedule-time">{item.time}</span>
              </li>
            ))}
          </ul>

          {/* Optional: Text Address if not using floating card */}
          {/* 
          <div className="antigravity-location-address">
            {addressLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div> 
          */}
        </div>

        {/* Right Column: Map */}
        <div className="antigravity-location-map">
          {/* Render Iframe safely */}
          <div 
            className="map-embed-container" 
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: mapEmbedIframe }}
          />

          {/* Floating Address Card */}
          <div className="location-map-card">
            <div className="map-card-address">
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
