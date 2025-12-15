import React from 'react';
import { Hero } from './Hero';
import '../../tokens.css'; // Import tokens for font styles

export default {
    title: 'Core/Hero',
    component: Hero,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        mode: {
            control: { type: 'select' },
            options: ['static', 'slideshow'],
        },
        layout: {
            control: { type: 'select' },
            options: ['bottom-left', 'middle-left', 'center'],
        },
        overlayOpacity: {
            control: { type: 'range', min: 0, max: 100, step: 5 },
        },
    },
};

// --- Mock Data ---
const MOCK_IMAGE_1 = "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"; // Holy convocation vibe
const MOCK_IMAGE_2 = "https://images.unsplash.com/photo-1544427920-ca14a224a331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"; // Choir
const MOCK_IMAGE_3 = "https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"; // Light

const SAMPLE_CONTENT = (
    <>
        <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', color: '#f0e6d2' }}>2025 Holy Convocation</h3>
        <h1 style={{ fontFamily: 'Merriweather, serif', marginBottom: '1.5rem', fontWeight: 700 }}>
            International Mass Choir Set to attend our End of The Year Holy Convocation
        </h1>
        <button style={{ 
            backgroundColor: '#a68a54', 
            color: 'white', 
            border: 'none', 
            padding: '16px 32px', 
            fontSize: '14px', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            cursor: 'pointer',
            borderRadius: '4px'
        }}>
            Learn More
        </button>
    </>
);

const Template = (args) => (
    <div className="wp-block-antigravity-hero">
        <Hero {...args}>{SAMPLE_CONTENT}</Hero>
    </div>
);

export const ImmersiveBottomLeft = Template.bind({});
ImmersiveBottomLeft.args = {
    mode: 'static',
    layout: 'bottom-left',
    media: [{ url: MOCK_IMAGE_1, alt: 'Sanctuary' }],
    overlayOpacity: 100, // Using full CSS gradient opacity
};

export const ImmersiveMiddleLeft = Template.bind({});
ImmersiveMiddleLeft.args = {
    mode: 'static',
    layout: 'middle-left',
    media: [{ url: MOCK_IMAGE_2, alt: 'Choir' }],
    overlayOpacity: 100,
};

export const CenterFocus = Template.bind({});
CenterFocus.args = {
    mode: 'static',
    layout: 'center',
    media: [{ url: MOCK_IMAGE_3, alt: 'Light' }],
    overlayOpacity: 70, // Dimmer overlay
};

export const SlideshowMode = Template.bind({});
SlideshowMode.args = {
    mode: 'slideshow',
    layout: 'bottom-left',
    media: [
        { url: MOCK_IMAGE_1, alt: 'Slide 1' },
        { url: MOCK_IMAGE_2, alt: 'Slide 2' },
        { url: MOCK_IMAGE_3, alt: 'Slide 3' },
    ],
    overlayOpacity: 100,
};
