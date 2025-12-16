import { createRoot } from '@wordpress/element';
import App from './App';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('fc-dashboard-root');
    if (rootElement) {
        createRoot(rootElement).render(<App />);
    }
});
