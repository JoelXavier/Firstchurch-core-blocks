import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { title, subtitle, alignment, showDecoration, decorationColor } = attributes;

    const blockProps = useBlockProps({
        className: `fc-section-header fc-section-header--align-${alignment}`
    });

    return (
        <div {...blockProps}>
            <BlockControls>
                 <AlignmentToolbar
                    value={alignment}
                    onChange={(newAlign) => setAttributes({ alignment: newAlign })}
                />
            </BlockControls>
    
            <InspectorControls>
                <PanelBody title={__('Settings', 'first-church-core-blocks')}>
                    <ToggleControl
                        label={__('Show Decoration', 'first-church-core-blocks')}
                        checked={showDecoration}
                        onChange={(value) => setAttributes({ showDecoration: value })}
                    />
                    {showDecoration && (
                         <SelectControl
                            label={__('Decoration Color', 'first-church-core-blocks')}
                            value={decorationColor}
                            options={[
                                { label: 'Gold', value: 'gold' },
                                { label: 'Neutral', value: 'neutral' },
                                { label: 'Primary', value: 'primary' },
                            ]}
                            onChange={(value) => setAttributes({ decorationColor: value })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <RichText
                tagName="h2"
                className="fc-section-header__title"
                value={title || ''} 
                onChange={(value) => setAttributes({ title: value })}
                placeholder={__('Enter Title...', 'first-church-core-blocks')}
                disableLineBreaks
            />

            <RichText
                tagName="p"
                className="fc-section-header__subtitle"
                value={subtitle || ''}
                onChange={(value) => setAttributes({ subtitle: value })}
                placeholder={__('Enter Subtitle...', 'first-church-core-blocks')}
            />

            {showDecoration && (
                <div className={`fc-section-header__line fc-section-header__line--${decorationColor || 'gold'}`}></div>
            )}
        </div>
    );
}
