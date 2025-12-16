import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './style.scss';

registerBlockType('firstchurch/footer-column', {
    edit: ({ attributes, setAttributes }) => {
        const { title } = attributes;
        const blockProps = useBlockProps({
            className: 'fc-footer__nav-col'
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
                        className="fc-footer__heading"
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
            className: 'fc-footer__nav-col'
        });

        return (
            <div {...blockProps}>
                <h4 className="fc-footer__heading">{title}</h4>
                <InnerBlocks.Content />
            </div>
        );
    }
});
