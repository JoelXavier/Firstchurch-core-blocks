import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: Edit,
    save: function () {
        return <InnerBlocks.Content />;
    },
});
