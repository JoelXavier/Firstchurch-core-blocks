import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
    const { sectionTitle, sectionSubheader, viewAllText, viewAllLink } = attributes;
    
    const blockProps = useBlockProps({
        className: 'antigravity-event-list'
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Section Settings', 'antigravity-core')}>
                    <TextControl
                        label={__('View All Button Text', 'antigravity-core')}
                        value={viewAllText}
                        onChange={(value) => setAttributes({ viewAllText: value })}
                    />
                    <TextControl
                        label={__('View All Button Link', 'antigravity-core')}
                        value={viewAllLink}
                        onChange={(value) => setAttributes({ viewAllLink: value })}
                        help={__('Enter the URL where the button should link to.', 'antigravity-core')}
                    />
                </PanelBody>
            </InspectorControls>

            <section {...blockProps}>
                <div className="antigravity-event-list-header">
                    <RichText
                        tagName="h2"
                        className="section-title"
                        value={sectionTitle}
                        onChange={(value) => setAttributes({ sectionTitle: value })}
                        placeholder={__('Upcoming Events...', 'antigravity-core')}
                    />
                    <div className="section-line"></div>
                    {attributes.sectionSubheader !== undefined && (
                         <div className="section-subheader-container">
                            <RichText
                                tagName="p"
                                className="section-subheader"
                                value={attributes.sectionSubheader}
                                onChange={(value) => setAttributes({ sectionSubheader: value })}
                                placeholder={__('Add a description...', 'antigravity-core')}
                            />
                         </div>
                    )}
                </div>

                <div className="antigravity-event-list-grid">
                    <InnerBlocks 
                        allowedBlocks={['antigravity/event-item']}
                        template={[['antigravity/event-item'], ['antigravity/event-item'], ['antigravity/event-item']]}
                    />
                </div>

                {viewAllText && (
                    <div className="antigravity-event-list-footer">
                        <span className="view-all-button placeholder">
                            {viewAllText}
                        </span>
                    </div>
                )}
            </section>
        </>
    );
}
