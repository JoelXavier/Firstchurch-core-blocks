import { registerBlockType } from '@wordpress/blocks';
import './style.scss'; // Imports tokens and component styles
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: Edit,
});
