import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    useInnerBlocksProps, 
    InspectorControls 
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    RangeControl 
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { columns } = attributes;

    const blockProps = useBlockProps({
        className: `fc-fundraiser-grid is-columns-${columns}`,
        style: {
            '--fc-grid-columns': columns
        }
    });

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        orientation: 'horizontal',
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Grid Layout', 'first-church-core-blocks')}>
                    <RangeControl
                        label={__('Columns', 'first-church-core-blocks')}
                        value={columns}
                        onChange={(val) => setAttributes({ columns: val })}
                        min={1}
                        max={4}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...innerBlocksProps} />
        </>
    );
}
