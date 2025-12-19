import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const {
        sectionTitle,
        sectionSubheader,
        columns,
        sectionTitleColor,
        cardLabelColor,
        cardTitleColor,
        cardLinkColor
    } = attributes;

    // CSS Variables for the container
    const style = {
        '--grid-columns': columns,
        '--card-section-title-color': sectionTitleColor,
        '--card-label-color': cardLabelColor,
        '--card-title-color': cardTitleColor,
        '--card-link-color': cardLinkColor,
    };

    const blockProps = useBlockProps({
        className: 'fc-card-grid',
        style: style
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'first-church-core-blocks')}>
                    <RangeControl
                        label={__('Columns (Desktop)', 'first-church-core-blocks')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={2}
                        max={4}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Text Colors', 'first-church-core-blocks')}
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: sectionTitleColor,
                            onChange: (value) => setAttributes({ sectionTitleColor: value }),
                            label: __('Section Title Color', 'first-church-core-blocks'),
                        },
                        {
                            value: cardLabelColor,
                            onChange: (value) => setAttributes({ cardLabelColor: value }),
                            label: __('Card Label Color', 'first-church-core-blocks'),
                        },
                        {
                            value: cardTitleColor,
                            onChange: (value) => setAttributes({ cardTitleColor: value }),
                            label: __('Card Title Color', 'first-church-core-blocks'),
                        },
                        {
                            value: cardLinkColor,
                            onChange: (value) => setAttributes({ cardLinkColor: value }),
                            label: __('Card Link Color', 'first-church-core-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <section { ...blockProps }>
                <div className="fc-card-grid__inner">
                    <div className="fc-card-grid__header">
                        <RichText
                            tagName="h2"
                            className="fc-card-grid__title"
                            value={ sectionTitle }
                            onChange={ ( value ) => setAttributes( { sectionTitle: value } ) }
                            placeholder={ __( 'Section Title...', 'first-church-core-blocks' ) }
                            style={{ color: sectionTitleColor || undefined }}
                        />
                        <div className="fc-card-grid__line"></div>
                        <RichText
                             tagName="p"
                             className="fc-card-grid__subheader"
                             value={ sectionSubheader }
                             onChange={ ( value ) => setAttributes( { sectionSubheader: value } ) }
                             placeholder={ __( 'Write a brief description...', 'first-church-core-blocks' ) }
                        />
                    </div>
                    
                    <div className="fc-card-grid__grid">
                        <InnerBlocks
                            allowedBlocks={['firstchurch/card-item']}
                            template={[
                                ['firstchurch/card-item'],
                                ['firstchurch/card-item'],
                                ['firstchurch/card-item']
                            ]}
                            orientation="horizontal"
                            templateLock={false}
                            renderAppender={InnerBlocks.ButtonBlockAppender}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
