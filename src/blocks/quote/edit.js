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
				<PanelBody title={__('Design Settings', 'antigravity-core')}>
					<SelectControl
						label={__('Layout', 'antigravity-core')}
						value={layout}
						options={[
							{ label: 'Centered', value: 'center' },
							{ label: 'Side-Line', value: 'side-line' },
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
					<SelectControl
						label={__('Variant', 'antigravity-core')}
						value={variant}
						options={[
							{ label: 'Default (Transparent)', value: 'default' },
							{ label: 'Card (Shadow & Bg)', value: 'card' },
						]}
						onChange={(value) => setAttributes({ variant: value })}
					/>
                    <ToggleControl
                        label={__('Show Quote Icon', 'antigravity-core')}
                        help={__('Disable for general statements.', 'antigravity-core')}
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
				<div className={`antigravity-quote-wrapper layout-${layout} variant-${variant}`}>
					<div className="antigravity-quote-container">
						
                        {/* Decorative Icon */}
						{showIcon && <div className="quote-icon" aria-hidden="true">“</div>}

						<blockquote className="antigravity-quote-content">
							<RichText
								tagName="p"
								className="quote-text"
								value={quote}
								onChange={(value) => setAttributes({ quote: value })}
								placeholder={__('Enter quote...', 'antigravity-core')}
							/>
							<footer className="quote-citation">
								<span className="citation-line"></span>
								<RichText
									tagName="cite"
									value={citation}
									onChange={(value) => setAttributes({ citation: value })}
									placeholder={__('Author / Source', 'antigravity-core')}
								/>
							</footer>
						</blockquote>

					</div>
				</div>
			</div>
		</>
	);
}
