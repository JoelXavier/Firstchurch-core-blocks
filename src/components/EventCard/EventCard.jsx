import React from 'react';
import './EventCard.scss';

export const EventCard = ({ 
    title, 
    label, 
    location, 
    startDate, 
    endDate, 
    isCanceled, 
    mediaUrl, 
    linkText = 'Get Tickets', 
    linkUrl = '#',
    schedule = [] // Optional array of strings: ["Friday 7pm", "Saturday 10am"]
}) => {
    
    // Date Logic
    // Date Logic
    const start = new Date(startDate);
    const month = start.toLocaleDateString('en-US', { month: 'short' });
    const day = start.toLocaleDateString('en-US', { day: 'numeric' });
    // Time removed per user request (handled via Complex Schedule manually)

    // Calculate what to show in the "Time" slot (Date Range specific)
    let timeDisplay = null; // Default to empty
    
    if (endDate) {
        const end = new Date(endDate);
        const isSameDay = start.toDateString() === end.toDateString();

        if (!isSameDay) {
            // Multi-day: "Oct 12 - Oct 15"
            // We only show this if it's a range.
            const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
            const endDay = end.toLocaleDateString('en-US', { day: 'numeric' });
            timeDisplay = `${month} ${day} - ${endMonth} ${endDay}`;
        }
    }

    return (
        <article className={`antigravity-event-card ${isCanceled ? 'is-canceled' : ''}`}>
             
            {/* 1. Media (Optional) - Now First */}
            {mediaUrl && (
                <div className="event-media">
                    <img src={mediaUrl} alt={title} />
                </div>
            )}

             {/* 2. Date Badge */}
             <div className="event-date-badge">
                <span className="event-month">{month}</span>
                <span className="event-day">{day}</span>
             </div>

            {/* 3. Content */}
            <div className="event-content">
                {label && <span className="event-label">{label}</span>}
                
                <h3 className="event-title">
                    <a href={linkUrl} className="event-link">{title}</a>
                </h3>
                
                <div className="event-meta">
                    {isCanceled && <span className="event-status-badge">Canceled</span>}
                    <span className="event-location">{location}</span>
                    {timeDisplay && (
                        <span className="event-time"> • {timeDisplay}</span>
                    )}
                </div>
                
                {/* Multi-Schedule Support */}
                {schedule && schedule.length > 0 && (
                    <div className="event-schedule-list">
                        {schedule.map((item, index) => (
                            <div key={index} className="event-schedule-item">{item}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Action */}
            <div className="event-action">
                <a href={linkUrl} className="event-button">
                    {linkText}
                </a>
            </div>

        </article>
    );
};
