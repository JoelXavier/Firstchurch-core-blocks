import React from 'react';
import { Listing } from './Listing';
import '../../tokens.css';

export default {
    title: 'Core/Content Listing',
    component: Listing,
    argTypes: {
        layout: {
            control: { type: 'select' },
            options: ['grid', 'list'],
        },
        columns: {
            control: { type: 'range', min: 2, max: 4, step: 1 },
        },
    },
};

const MOCK_ITEMS = [
    {
        title: "2025 Holy Convocation Dates Announced",
        excerpt: "Join us for a week of spiritual renewal and community gathering as we celebrate our annual convocation with special guests.",
        date: "Oct 12, 2025",
        category: "Events",
        image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Community Outreach Program Launches",
        excerpt: "Our new initiative aims to provide essential resources and support to families in need within our local neighborhood.",
        date: "Oct 10, 2025",
        category: "News",
        image: "https://images.unsplash.com/photo-1544427920-ca14a224a331?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Sunday Service: The Power of Faith",
        excerpt: "This Sunday's sermon will explore the transformative power of faith in overcoming life's challenges.",
        date: "Oct 05, 2025",
        category: "Sermons",
        image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Youth Choir Rehearsals Resume",
        excerpt: "Calling all young singers! Rehearsals for the upcoming holiday concert begin next week in the main sanctuary.",
        date: "Oct 01, 2025",
        category: "Music",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

const Template = (args) => <div style={{ padding: '20px' }}><Listing {...args} /></div>;

export const GridView = Template.bind({});
GridView.args = {
    layout: 'grid',
    items: MOCK_ITEMS
};

export const ListView = Template.bind({});
ListView.args = {
    layout: 'list',
    items: MOCK_ITEMS
};
