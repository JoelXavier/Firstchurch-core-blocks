import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InnerBlocks, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
    const { sectionTitle, sectionSubheader, viewAllText, viewAllLink, headerColor } = attributes;
    
    // Block Props
    const blockProps = useBlockProps({
        className: 'fc-event-list'
    });

    // InnerBlocks with explicit appender for adding events
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'fc-event-list__grid' },
        {
            allowedBlocks: ['firstchurch/event-item'],
            template: [['firstchurch/event-item'], ['firstchurch/event-item'], ['firstchurch/event-item']],
            templateLock: false,
            renderAppender: InnerBlocks.ButtonBlockAppender
        }
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Section Settings', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('View All Button Text', 'first-church-core-blocks')}
                        value={viewAllText}
                        onChange={(value) => setAttributes({ viewAllText: value })}
                    />
                    <TextControl
                        label={__('View All Button Link', 'first-church-core-blocks')}
                        value={viewAllLink}
                        onChange={(value) => setAttributes({ viewAllLink: value })}
                        help={__('Enter the URL where the button should link to.', 'first-church-core-blocks')}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Color Settings', 'first-church-core-blocks')}
                    initialOpen={true}
                    colorSettings={[
                        {
                            value: headerColor,
                            onChange: (colorValue) => setAttributes({ headerColor: colorValue }),
                            label: __('Header Color', 'first-church-core-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <section {...blockProps}>
                <div className="fc-event-list__header">
                    <RichText
                        tagName="h2"
                        className="fc-event-list__title"
                        value={sectionTitle}
                        onChange={(value) => setAttributes({ sectionTitle: value })}
                        placeholder={__('Upcoming Events...', 'first-church-core-blocks')}
                        style={{ color: headerColor }} // Applied here
                    />
                    <div className="fc-event-list__line" style={{ backgroundColor: headerColor }}></div>
                    
                    <div className="fc-event-list__subheader-container">
                        <RichText
                            tagName="p"
                            className="fc-event-list__subheader"
                            value={sectionSubheader}
                            onChange={(value) => setAttributes({ sectionSubheader: value })}
                            placeholder={__('Add a description...', 'first-church-core-blocks')}
                        />
                    </div>
                </div>

                <div {...innerBlocksProps} />

                {viewAllText && (
                    <div className="fc-event-list__footer">
                        <span className="fc-view-all-btn placeholder">
                            {viewAllText}
                        </span>
                    </div>
                )}
            </section>
        </>
    );
}
