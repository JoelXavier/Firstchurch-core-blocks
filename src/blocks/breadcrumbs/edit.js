import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
	const { separator, showHome } = attributes;

    const blockProps = useBlockProps({
        className: 'fc-breadcrumbs'
    });

	return (
		<>
            <InspectorControls>
                <PanelBody title={__('Settings', 'first-church-core-blocks')}>
                     <ToggleControl
                        label={__('Show Home Link', 'first-church-core-blocks')}
                        checked={showHome}
                        onChange={(val) => setAttributes({ showHome: val })}
                    />
                    <TextControl
                        label={__('Separator', 'first-church-core-blocks')}
                        value={separator}
                        onChange={(val) => setAttributes({ separator: val })}
                    />
                </PanelBody>
            </InspectorControls>

			<div {...blockProps}>
                <span className="fc-breadcrumbs__item">HOME</span>
                <span className="fc-breadcrumbs__separator">{separator}</span>
                <span className="fc-breadcrumbs__item">PARENT PAGE</span>
                <span className="fc-breadcrumbs__separator">{separator}</span>
                <span className="fc-breadcrumbs__item fc-breadcrumbs__item--current">CURRENT PAGE</span>
			</div>
		</>
	);
}
