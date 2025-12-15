import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit: Edit,
    // Dynamic block: save returns null, rendering handled by PHP/Frontend hydration
	save: () => null,
});
