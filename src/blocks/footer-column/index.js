import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './style.scss';

registerBlockType('antigravity/footer-column', {
    edit: ({ attributes, setAttributes }) => {
        const { title } = attributes;
        const blockProps = useBlockProps({
            className: 'footer-nav-col'
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title="Column Settings">
                        <TextControl
                            label="Column Title"
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <RichText
                        tagName="h4"
                        className="footer-heading"
                        value={title}
                        onChange={(val) => setAttributes({ title: val })}
                        placeholder="Column Title"
                        allowedFormats={[]} // Plain text only
                    />
                    <InnerBlocks 
                        allowedBlocks={['core/list', 'core/paragraph', 'core/separator']} 
                        template={[['core/list', {}]]}
                    />
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const { title } = attributes;
        const blockProps = useBlockProps.save({
            className: 'footer-nav-col'
        });

        return (
            <div {...blockProps}>
                <h4 className="footer-heading">{title}</h4>
                <InnerBlocks.Content />
            </div>
        );
    }
});
