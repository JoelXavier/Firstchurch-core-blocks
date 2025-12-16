import React from 'react';
import { Listing } from './Listing';

export default {
    title: 'Components/Listing Feed',
    component: Listing,
    argTypes: {
        filterStyle: { 
            control: { type: 'select' }, 
            options: ['pills', 'sidebar'] 
        },
        columns: {
            control: { type: 'range', min: 1, max: 4, step: 1 }
        }
    }
};

const CATEGORIES = [
    { id: 1, name: 'Testimonies', count: 12 },
    { id: 2, name: 'Psalm 102', count: 5 },
    { id: 3, name: 'Success stories', count: 8 },
    { id: 4, name: 'New goals to share', count: 3 },
    { id: 5, name: 'Love and marriage', count: 4 }
];

const ITEMS = [
    { 
        id: 101, 
        title: 'Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia', 
        categoryIds: [1], 
        image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Testimonies'
    },
    { 
        id: 102, 
        title: 'Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia', 
        categoryIds: [2], 
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Psalm 102'
    },
    { 
        id: 103, 
        title: 'Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia', 
        categoryIds: [3], 
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Success stories'
    },
    { 
        id: 104, 
        title: 'Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia', 
        categoryIds: [4], 
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'New goals to share'
    },
    { 
        id: 105, 
        title: 'Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia', 
        categoryIds: [5], 
        image: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Love and marriage'
    },
    { 
        id: 106, 
        title: 'Visit Apostle, Pastor Gino Jennings In The City Of Philadelphia', 
        categoryIds: [1], 
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Testimonies'
    }
];

const Template = (args) => <Listing {...args} />;

export const RegalSidebar = Template.bind({});
RegalSidebar.args = {
    filterStyle: 'sidebar',
    items: ITEMS,
    categories: CATEGORIES,
    columns: 3,
    title: "Content Listings",
    subtitle: "From testimonials, to success stories"
};
