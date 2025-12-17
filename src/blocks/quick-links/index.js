import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InnerBlocks, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// Defined Template
const TEMPLATE = [
    [ 'firstchurch/quick-link-item', { label: 'New Link' } ],
    [ 'firstchurch/quick-link-item', { label: 'New Link' } ],
    [ 'firstchurch/quick-link-item', { label: 'New Link' } ],
];

const ALLOWED_BLOCKS = [ 'firstchurch/quick-link-item' ];

function Edit({ attributes, setAttributes }) {
    const { title, backgroundVariant } = attributes;
    
    // Parent block props - dynamically add variant class in editor
    const blockProps = useBlockProps({ 
        className: `fc-quick-links has-bg-divine-${backgroundVariant}` 
    });

    // InnerBlocks props with explicit appender for the "Plus" button
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'fc-quick-links__list' },
        { 
            allowedBlocks: ALLOWED_BLOCKS,
            template: TEMPLATE,
            templateLock: false, // Explicitly unlock to allow adding more
            renderAppender: InnerBlocks.ButtonBlockAppender // Explain: Essential for restricted lists
        }
    );

    return (
        <section { ...blockProps }>
            <InspectorControls>
                <PanelBody title={__('Background Settings', 'first-church-core-blocks')}>
                    <SelectControl
                        label={__('Background Gradient', 'first-church-core-blocks')}
                        value={backgroundVariant}
                        options={[
                            { label: __('Divine Red', 'first-church-core-blocks'), value: 'red' },
                            { label: __('Divine Green', 'first-church-core-blocks'), value: 'green' },
                            { label: __('Divine Blue', 'first-church-core-blocks'), value: 'blue' },
                        ]}
                        onChange={(value) => setAttributes({ backgroundVariant: value })}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div className="fc-quick-links__inner">
                {/* Header */}
                <div className="fc-quick-links__header">
                    <RichText
                        tagName="h2"
                        className="fc-quick-links__title"
                        value={title}
                        onChange={ ( value ) => setAttributes( { title: value } ) }
                        placeholder={ __( 'Title...', 'first-church-core-blocks' ) }
                    />
                    <div className="fc-quick-links__underline"></div>
                </div>

                {/* Links List and Appender */}
                <div { ...innerBlocksProps } />
            </div>
        </section>
    );
}

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => <InnerBlocks.Content /> 
});
