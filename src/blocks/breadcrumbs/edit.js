import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
	const { separator, showHome } = attributes;

    const blockProps = useBlockProps({
        className: 'antigravity-breadcrumbs'
    });

	return (
		<>
            <InspectorControls>
                <PanelBody title={__('Settings', 'antigravity-core-blocks')}>
                     <ToggleControl
                        label={__('Show Home Link', 'antigravity-core-blocks')}
                        checked={showHome}
                        onChange={(val) => setAttributes({ showHome: val })}
                    />
                    <TextControl
                        label={__('Separator', 'antigravity-core-blocks')}
                        value={separator}
                        onChange={(val) => setAttributes({ separator: val })}
                    />
                </PanelBody>
            </InspectorControls>

			<div {...blockProps}>
                <span className="breadcrumb-item">HOME</span>
                <span className="breadcrumb-separator">{separator}</span>
                <span className="breadcrumb-item">PARENT PAGE</span>
                <span className="breadcrumb-separator">{separator}</span>
                <span className="breadcrumb-item current">CURRENT PAGE</span>
			</div>
		</>
	);
}
