import React from 'react';
import { createRoot } from 'react-dom/client';
import { Hero } from '../../components/Hero/Hero';
import '../../tokens.css';

document.addEventListener('DOMContentLoaded', () => {
    const roots = document.querySelectorAll('.fc-hero-background-root');
    
    roots.forEach((rootEl) => {
        const props = JSON.parse(rootEl.dataset.props);
        
        // We only render the media/background part of the Hero here
        // The content is handled by PHP.
        // We pass empty children because we are only mounting the background layer.
        
        const root = createRoot(rootEl);
        root.render(<Hero {...props} />);
    });
});
