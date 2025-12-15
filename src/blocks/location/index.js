import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './editor.scss'; // Editor Styles
import './style.scss';  // Frontend Styles

registerBlockType(metadata.name, {
	edit: Edit,
	save: () => null, // Dynamic block, renders via PHP
});
