/**
 * Frontend script for binding the React Listing component.
 */
import { createRoot } from '@wordpress/element';
import { Listing } from '../../components/Listing/Listing'; // Adjust path if needed

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.fc-listing-root');

    containers.forEach(container => {
        if (!container.dataset.props) return;

        try {
            const props = JSON.parse(container.dataset.props);
            // Verify if creating a new root is safe (it is for standard interactive blocks)
            // If using standard React 18:
            const root = createRoot(container);
            root.render(<Listing {...props} />);
        } catch (e) {
            console.error('Error mounting First Church Listing block:', e);
        }
    });
});
