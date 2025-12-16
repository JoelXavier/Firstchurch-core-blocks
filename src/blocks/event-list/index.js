import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: Edit,
    save: function ({ attributes }) { // Change to block return
        const { sectionTitle, sectionSubheader, viewAllText, viewAllLink } = attributes;
        const blockProps = useBlockProps.save({
            className: 'antigravity-event-list'
        });
        
        return (
            <section {...blockProps}>
                <div className="antigravity-event-list-header">
                    {sectionTitle && <h2 className="section-title"><RichText.Content value={sectionTitle} /></h2>}
                    <div className="section-line"></div>
                    {sectionSubheader && <p className="section-subheader"><RichText.Content value={sectionSubheader} /></p>}
                </div>

                <div className="antigravity-event-list-grid">
                    <InnerBlocks.Content />
                </div>

                {viewAllText && (
                    <div className="antigravity-event-list-footer">
                        <a href={viewAllLink || '#'} className="view-all-button">
                            {viewAllText}
                        </a>
                    </div>
                )}
            </section>
        );
    },
});
