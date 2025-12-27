import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls, AlignmentToolbar, BlockControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl, ColorPalette } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { 
        title, 
        subtitle, 
        alignment, 
        showDecoration, 
        decorationColor,
        subtitleColor,
        subtitleFontFamily,
        subtitleLineHeight
    } = attributes;

    const blockProps = useBlockProps({
        className: `fc-section-header fc-section-header--align-${alignment}`
    });

    const subtitleStyle = {
        color: subtitleColor,
        fontFamily: subtitleFontFamily,
        lineHeight: subtitleLineHeight
    };

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
                
                <PanelBody title={__('Subtitle Styling', 'first-church-core-blocks')} initialOpen={false}>
                    <SelectControl
                        label={__('Font Family', 'first-church-core-blocks')}
                        value={subtitleFontFamily}
                        options={[
                            { label: 'Inter (Sans)', value: 'var(--wp--preset--font-family--inter)' },
                            { label: 'Merriweather (Serif)', value: 'var(--wp--preset--font-family--merriweather)' },
                            { label: 'Playfair Display (Heading)', value: 'var(--wp--preset--font-family--playfair-display)' },
                            { label: 'Tangerine (Script)', value: 'var(--wp--preset--font-family--tangerine)' }
                        ]}
                        onChange={(value) => setAttributes({ subtitleFontFamily: value })}
                    />
                    <TextControl
                        label={__('Line Height', 'first-church-core-blocks')}
                        value={subtitleLineHeight}
                        onChange={(value) => setAttributes({ subtitleLineHeight: value })}
                        help={__('Use values like 1.5, 24px, or 1.2rem', 'first-church-core-blocks')}
                    />
                    <p style={{marginBottom: 8}}>{__('Subtitle Color', 'first-church-core-blocks')}</p>
                    <ColorPalette
                        value={subtitleColor}
                        onChange={(value) => setAttributes({ subtitleColor: value })}
                    />
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
                style={subtitleStyle}
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
