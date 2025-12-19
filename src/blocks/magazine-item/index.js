import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import { InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType(metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	save: () => <InnerBlocks.Content />,
});
