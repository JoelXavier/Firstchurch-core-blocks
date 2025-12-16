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
        <div className="fc-author-card">
            <div className="fc-author-card__media">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} />
                ) : (
                    <div className="fc-author-card__placeholder">{name.charAt(0)}</div>
                )}
            </div>
            <div className="fc-author-card__info">
                <span className="fc-author-card__name">{name}</span>
                <span className="fc-author-card__team">{team}</span>
                <span className="fc-author-card__location">{location}</span>
            </div>
        </div>
    );
};
