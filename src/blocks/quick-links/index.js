import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// Defined Template
const TEMPLATE = [
    [ 'antigravity/quick-link-item', { label: 'New Link' } ],
    [ 'antigravity/quick-link-item', { label: 'New Link' } ],
    [ 'antigravity/quick-link-item', { label: 'New Link' } ],
];

const ALLOWED_BLOCKS = [ 'antigravity/quick-link-item' ];

function Edit({ attributes, setAttributes }) {
    const { title } = attributes;
    const blockProps = useBlockProps({ className: 'antigravity-quick-links' });

    return (
        <section { ...blockProps }>
            <div className="quick-links-inner">
                {/* Header */}
                <div className="quick-links-header">
                    <RichText
                        tagName="h2"
                        className="quick-links-title"
                        value={title}
                        onChange={ ( value ) => setAttributes( { title: value } ) }
                        placeholder={ __( 'Title...', 'antigravity-core' ) }
                    />
                    <div className="quick-links-underline"></div>
                </div>

                {/* Links List */}
                <div className="quick-links-list">
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
