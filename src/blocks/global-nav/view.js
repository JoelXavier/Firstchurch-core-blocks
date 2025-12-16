import { createRoot } from '@wordpress/element';
import { GlobalNavigation } from '../../components/GlobalNavigation/GlobalNavigation';
import '../../tokens.css'; // Bundle tokens into view.css

document.addEventListener( 'DOMContentLoaded', () => {
    const roots = document.querySelectorAll( '.fc-global-nav-root' );

    roots.forEach( ( root ) => {
        const attributes = JSON.parse( root.dataset.attributes );
        
        if ( createRoot ) {
            createRoot( root ).render( <GlobalNavigation { ...attributes } /> );
        }
    } );
} );
