import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
    ...metadata,
    edit: () => {
        const blockProps = useBlockProps();
        return (
            <div {...blockProps}>
                <Placeholder
                    icon="analytics"
                    label={__('Baptism Stats', 'first-church-core-blocks')}
                    instructions={__('This block displays the monthly baptism reports managed in Mission Control.', 'first-church-core-blocks')}
                />
            </div>
        );
    },
    save: () => null // Server-side rendered
});
