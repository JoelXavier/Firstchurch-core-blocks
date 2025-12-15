import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import './editor.scss';

// Template: Defaults to 3 card items
const TEMPLATE = [
    [ 'antigravity/card-item', {} ],
    [ 'antigravity/card-item', {} ],
    [ 'antigravity/card-item', {} ],
];

export default function Edit({ attributes, setAttributes }) {
    const { sectionTitle } = attributes;
    
    const blockProps = useBlockProps({
        className: 'antigravity-card-grid'
    });

    return (
        <div { ...blockProps }>
            {/* Semantic Header Section */}
            <div className="card-grid-header">
                <RichText
                    tagName="h2"
                    className="section-title"
                    value={sectionTitle}
                    onChange={ ( value ) => setAttributes( { sectionTitle: value } ) }
                    placeholder={ __( 'Enter Section Title...', 'antigravity-core' ) }
                />
                <div className="section-line"></div>
            </div>

            <div className="card-grid-container">
                <InnerBlocks 
                    allowedBlocks={ [ 'antigravity/card-item' ] }
                    template={ TEMPLATE }
                    orientation="horizontal"
                />
            </div>
        </div>
    );
}
