import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InspectorControls
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl,
    ToggleControl 
} from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { 
        label, 
        title, 
        description, 
        linkText, 
        linkUrl,
        showLink 
    } = attributes;

    const blockProps = useBlockProps({
        className: 'fc-information-card'
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Content', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Label', 'first-church-core-blocks')}
                        value={label}
                        onChange={(val) => setAttributes({ label: val })}
                    />
                    <TextControl
                        label={__('Title', 'first-church-core-blocks')}
                        value={title}
                        onChange={(val) => setAttributes({ title: val })}
                    />
                    <TextControl
                        label={__('Description', 'first-church-core-blocks')}
                        value={description}
                        onChange={(val) => setAttributes({ description: val })}
                    />
                </PanelBody>

                <PanelBody title={__('Call to Action', 'first-church-core-blocks')}>
                    <ToggleControl
                        label={__('Show Button', 'first-church-core-blocks')}
                        checked={showLink}
                        onChange={(val) => setAttributes({ showLink: val })}
                    />
                    {showLink && (
                        <>
                            <TextControl
                                label={__('Button Text', 'first-church-core-blocks')}
                                value={linkText}
                                onChange={(val) => setAttributes({ linkText: val })}
                            />
                            <TextControl
                                label={__('Button URL', 'first-church-core-blocks')}
                                value={linkUrl}
                                onChange={(val) => setAttributes({ linkUrl: val })}
                            />
                        </>
                    )}
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="fc-information-card__inner">
                    <span className="fc-information-card__label">{label}</span>
                    <h3 className="fc-information-card__title">{title}</h3>
                    <p className="fc-information-card__description">{description}</p>
                    
                    {showLink ? (
                        <div className="fc-information-card__footer">
                            <span className="fc-information-card__button disabled-in-editor">
                                {linkText}
                            </span>
                        </div>
                    ) : (
                        <div className="fc-information-card__bottom-bar"></div>
                    )}
                </div>
            </div>
        </>
    );
}
