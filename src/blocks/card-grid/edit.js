import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const {
        sectionTitle,
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
        className: 'antigravity-card-grid',
        style: style
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'antigravity-core')}>
                    <RangeControl
                        label={__('Columns (Desktop)', 'antigravity-core')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={2}
                        max={4}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Text Colors', 'antigravity-core')}
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: sectionTitleColor,
                            onChange: (value) => setAttributes({ sectionTitleColor: value }),
                            label: __('Section Title Color', 'antigravity-core'),
                        },
                        {
                            value: cardLabelColor,
                            onChange: (value) => setAttributes({ cardLabelColor: value }),
                            label: __('Card Label Color', 'antigravity-core'),
                        },
                        {
                            value: cardTitleColor,
                            onChange: (value) => setAttributes({ cardTitleColor: value }),
                            label: __('Card Title Color', 'antigravity-core'),
                        },
                        {
                            value: cardLinkColor,
                            onChange: (value) => setAttributes({ cardLinkColor: value }),
                            label: __('Card Link Color', 'antigravity-core'),
                        },
                    ]}
                />
            </InspectorControls>

            <section { ...blockProps }>
                <div className="container">
                    <div className="card-grid-header">
                        <RichText
                            tagName="h2"
                            className="section-title"
                            value={ sectionTitle }
                            onChange={ ( value ) => setAttributes( { sectionTitle: value } ) }
                            placeholder={ __( 'Section Title...', 'antigravity-core' ) }
                        />
                        <div className="section-line"></div>
                    </div>
                    
                    <div className="grid-container">
                        <InnerBlocks
                            allowedBlocks={['antigravity/card-item']}
                            template={[
                                ['antigravity/card-item'],
                                ['antigravity/card-item'],
                                ['antigravity/card-item']
                            ]}
                            orientation="horizontal"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
