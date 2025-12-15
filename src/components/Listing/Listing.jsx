import React from 'react';
import { Card } from '../Card/Card';
import './Listing.css';

export const Listing = ({ 
    items = [], 
    layout = 'grid', 
    columns = 3 
}) => {
    return (
        <section className={`antigravity-listing antigravity-listing--layout-${layout}`} style={{ '--columns': columns }}>
            {items.map((item, index) => (
                <Card 
                    key={index}
                    {...item}
                />
            ))}
        </section>
    );
};
