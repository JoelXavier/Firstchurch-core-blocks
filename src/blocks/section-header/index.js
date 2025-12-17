import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './style.scss'; // Frontend styles
import './editor.scss'; // Editor styles

registerBlockType(metadata.name, {
	edit: Edit,
	save: () => null, // Dynamic rendering
});
