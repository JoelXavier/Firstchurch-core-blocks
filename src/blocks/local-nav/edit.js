import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, ToggleControl, IconButton } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const { title, links } = attributes;

    const blockProps = useBlockProps({
        className: 'fc-local-nav',
    });

    // Helper to update a specific link
    const updateLink = (index, key, value) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [key]: value };
        setAttributes({ links: newLinks });
    };

    // Helper to remove a link
    const removeLink = (index) => {
        const newLinks = links.filter((_, i) => i !== index);
        setAttributes({ links: newLinks });
    };

    // Helper to add a new link
    const addLink = () => {
        setAttributes({
            links: [...links, { label: 'New Link', url: '#', isExternal: false }]
        });
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Navigation Items', 'first-church-core-blocks')}>
                    <p className="description">
                        {__('Manage the links for this local navigation menu.', 'first-church-core-blocks')}
                    </p>
                    {links.map((link, index) => (
                        <div key={index} style={{ 
                            marginBottom: '1rem', 
                            padding: '1rem', 
                            background: '#f0f0f0', 
                            borderRadius: '4px',
                            borderLeft: '3px solid #ccc' 
                        }}>
                            <TextControl
                                label={__('Label', 'first-church-core-blocks')}
                                value={link.label}
                                onChange={(val) => updateLink(index, 'label', val)}
                            />
                            <TextControl
                                label={__('URL', 'first-church-core-blocks')}
                                value={link.url}
                                onChange={(val) => updateLink(index, 'url', val)}
                            />
                            <ToggleControl
                                label={__('Open in new tab', 'first-church-core-blocks')}
                                checked={link.isExternal}
                                onChange={(val) => updateLink(index, 'isExternal', val)}
                            />
                            <Button 
                                isDestructive 
                                isSmall
                                variant="secondary"
                                onClick={() => removeLink(index)}
                            >
                                {__('Remove Link', 'first-church-core-blocks')}
                            </Button>
                        </div>
                    ))}
                    <Button variant="primary" onClick={addLink} isFullWidth>
                        {__('Add New Link', 'first-church-core-blocks')}
                    </Button>
                    <hr />
                    <ToggleControl
                        label={__('Hide Title on Desktop', 'first-church-core-blocks')}
                        help={__('Title will remain visible on mobile for toggle context.', 'first-church-core-blocks')}
                        checked={attributes.hideTitleDesktop}
                        onChange={(val) => setAttributes({ hideTitleDesktop: val })}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Editor Visual Preview */}
            <div className="fc-local-nav__inner">
                <RichText
                    tagName="h4"
                    className="fc-local-nav__title"
                    value={title}
                    onChange={(val) => setAttributes({ title: val })}
                    placeholder={__('Navigation Title...', 'first-church-core-blocks')}
                />
                
                <ul className="fc-local-nav__list">
                    {links.length > 0 ? (
                        links.map((link, index) => (
                            <li key={index} className="fc-local-nav__item">
                                <a href="#" className="fc-local-nav__link" onClick={(e) => e.preventDefault()}>
                                    {link.label || __('(Empty Label)', 'first-church-core-blocks')}
                                </a>
                            </li>
                        ))
                    ) : (
                        <li className="fc-local-nav__item" style={{ opacity: 0.6, fontStyle: 'italic' }}>
                            {__('No links added. Use the sidebar to add navigation items.', 'first-church-core-blocks')}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
