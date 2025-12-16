import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { layoutMode, verticalSpacing, hasDecoration, decorationPosition } = attributes;

    const blockProps = useBlockProps({
        className: `fc-section fc-section--mode-${layoutMode} fc-section--spacing-${verticalSpacing} ${hasDecoration ? 'fc-section--has-decoration fc-section--decoration-' + decorationPosition : ''}`
    });

	return (
		<>
            <InspectorControls>
                <PanelBody title={__('Section Layout', 'first-church-core-blocks')}>
                    <SelectControl
                        label={__('Width Mode', 'first-church-core-blocks')}
                        value={layoutMode}
                        options={[
                            { label: 'Contained (Max Width)', value: 'contained' },
                            { label: 'Full Width', value: 'full' },
                            { label: 'Narrow (Reading)', value: 'narrow' }
                        ]}
                        onChange={(val) => setAttributes({ layoutMode: val })}
                    />
                    <SelectControl
                        label={__('Vertical Spacing', 'first-church-core-blocks')}
                        value={verticalSpacing}
                        options={[
                            { label: 'None (0px)', value: 'none' },
                            { label: 'Small (32px)', value: 'small' },
                            { label: 'Medium (64px)', value: 'medium' },
                            { label: 'Large (128px)', value: 'large' }
                        ]}
                        onChange={(val) => setAttributes({ verticalSpacing: val })}
                    />
                </PanelBody>
                <PanelBody title={__('Decoration', 'first-church-core-blocks')}>
                     <ToggleControl
                        label="Show Gold Border"
                        checked={hasDecoration}
                        onChange={(val) => setAttributes({ hasDecoration: val })}
                    />
                    {hasDecoration && (
                         <SelectControl
                            label="Position"
                            value={decorationPosition}
                            options={[
                                { label: 'Top', value: 'top' },
                                { label: 'Bottom', value: 'bottom' },
                                { label: 'Both', value: 'both' }
                            ]}
                            onChange={(val) => setAttributes({ decorationPosition: val })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

			<div {...blockProps}>
                <div className="fc-section__inner">
				    <InnerBlocks />
                </div>
			</div>
		</>
	);
}
