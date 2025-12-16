import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { Quote } from '../../components/Quote/Quote';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { quote, citation, layout, variant, showIcon } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Design Settings', 'first-church-core-blocks')}>
					<SelectControl
						label={__('Layout', 'first-church-core-blocks')}
						value={layout}
						options={[
							{ label: 'Centered', value: 'center' },
							{ label: 'Side-Line', value: 'side-line' },
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
					<SelectControl
						label={__('Variant', 'first-church-core-blocks')}
						value={variant}
						options={[
							{ label: 'Default (Transparent)', value: 'default' },
							{ label: 'Card (Shadow & Bg)', value: 'card' },
						]}
						onChange={(value) => setAttributes({ variant: value })}
					/>
                    <ToggleControl
                        label={__('Show Quote Icon', 'first-church-core-blocks')}
                        help={__('Disable for general statements.', 'first-church-core-blocks')}
                        checked={showIcon}
                        onChange={(value) => setAttributes({ showIcon: value })}
                    />
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				{/* 
                    We reconstruct the markup manually here to use RichText
                    instead of the static Quote component strings.
                    This ensures "What You See Is What You Edit".
                */}
				<div className={`fc-quote fc-quote--layout-${layout} fc-quote--variant-${variant}`}>
					<div className="fc-quote__container">
						
                        {/* Decorative Icon */}
						{showIcon && <div className="fc-quote__icon" aria-hidden="true">“</div>}

						<blockquote className="fc-quote__content">
							<RichText
								tagName="p"
								className="fc-quote__text"
								value={quote}
								onChange={(value) => setAttributes({ quote: value })}
								placeholder={__('Enter quote...', 'first-church-core-blocks')}
							/>
							<footer className="fc-quote__citation">
								<span className="fc-quote__line"></span>
								<RichText
									tagName="cite"
									value={citation}
									onChange={(value) => setAttributes({ citation: value })}
									placeholder={__('Author / Source', 'first-church-core-blocks')}
								/>
							</footer>
						</blockquote>

					</div>
				</div>
			</div>
		</>
	);
}
