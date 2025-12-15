import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './editor.scss'; // Standard WP Editor Styles
import './style.scss';  // Standard WP Frontend Styles

registerBlockType(metadata.name, {
	edit: Edit,
	save: () => null, // Dynamic block
});
