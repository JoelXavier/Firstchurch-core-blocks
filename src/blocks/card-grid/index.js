import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => {
        // Dynamic block, rendering handled via render.php or InnerBlocks (for save context)
        // For InnerBlocks, we usually return InnerBlocks.Content in save
        const { InnerBlocks } = wp.blockEditor;
        return <InnerBlocks.Content />;
    }
});
