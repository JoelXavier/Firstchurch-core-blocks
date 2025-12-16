import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
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
    const { title } = attributes;
    const blockProps = useBlockProps({ className: 'fc-quick-links' });

    return (
        <section { ...blockProps }>
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

                {/* Links List */}
                <div className="fc-quick-links__list">
                    <InnerBlocks
                        allowedBlocks={ ALLOWED_BLOCKS }
                        template={ TEMPLATE }
                        orientation="horizontal"
                    />
                </div>
            </div>
        </section>
    );
}

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => <InnerBlocks.Content /> 
});
