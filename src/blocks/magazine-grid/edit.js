import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    useInnerBlocksProps, 
    InspectorControls 
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    RangeControl,
    ToggleControl
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { sidebarWidth, sidebarPosition } = attributes;
    
    const blockProps = useBlockProps({
        className: `fc-magazine-grid is-position-${sidebarPosition}`,
        style: {
            '--fc-sidebar-width': `${sidebarWidth}%`
        }
    });

    const TEMPLATE = [
        ['core/group', { 
            className: 'flex-magazine-column is-main',
            layout: { type: 'constrained' },
            templateLock: false
        }, [
            ['firstchurch/magazine-item', {
                mediaUrl: '',
                placeholder: 'Add Featured Content...'
            }]
        ]],
        ['core/group', { 
            className: 'flex-magazine-column is-sidebar',
            layout: { type: 'constrained' },
            templateLock: false
        }, [
            ['firstchurch/magazine-item', { layout: 'horizontal' }],
            ['firstchurch/magazine-item', { layout: 'horizontal' }],
            ['firstchurch/magazine-item', { layout: 'horizontal' }]
        ]]
    ];

    const ALLOWED_BLOCKS = [
        'core/group', 
        'core/heading', 
        'core/paragraph', 
        'core/image', 
        'core/buttons',
        'firstchurch/card-item',
        'firstchurch/magazine-item',
        'firstchurch/quote',
        'firstchurch/listing'
    ];

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: TEMPLATE,
        templateLock: false,
        allowedBlocks: ALLOWED_BLOCKS,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Grid Layout', 'first-church-core-blocks')}>
                    <RangeControl
                        label={__('Sidebar Width (%)', 'first-church-core-blocks')}
                        value={sidebarWidth}
                        onChange={(val) => setAttributes({ sidebarWidth: val })}
                        min={20}
                        max={50}
                    />
                    <ToggleControl
                        label={__('Position Sidebar on Left', 'first-church-core-blocks')}
                        checked={sidebarPosition === 'left'}
                        onChange={(val) => setAttributes({ sidebarPosition: val ? 'left' : 'right' })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...innerBlocksProps} />
        </>
    );
}
