import React from 'react';
import './AuthorCard.scss';

/**
 * Author Card Component
 * 
 * @param {string} name - Author Name
 * @param {string} team - Team (e.g. Editorial Team)
 * @param {string} location - Location (e.g. Bronx Temple)
 * @param {string} imageUrl - Headshot URL
 */
export const AuthorCard = ({
    name = "Pastor Gino Jennings",
    team = "Editorial Team",
    location = "Philadelphia Temple",
    imageUrl
}) => {
    return (
        <div className="antigravity-author-card">
            <div className="author-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} />
                ) : (
                    <div className="author-card-placeholder">{name.charAt(0)}</div>
                )}
            </div>
            <div className="author-card-info">
                <span className="author-card-name">{name}</span>
                <span className="author-card-team">{team}</span>
                <span className="author-card-location">{location}</span>
            </div>
        </div>
    );
};
