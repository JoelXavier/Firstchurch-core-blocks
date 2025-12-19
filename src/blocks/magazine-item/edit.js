import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InnerBlocks, 
    MediaPlaceholder,
    BlockControls,
    MediaReplaceFlow,
    InspectorControls
} from '@wordpress/block-editor';
import { 
    ToolbarButton, 
    PanelBody, 
    SelectControl 
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { mediaId, mediaUrl, layout } = attributes;

    const onSelectMedia = (media) => {
        setAttributes({
            mediaId: media.id,
            mediaUrl: media.url
        });
    };

    const TEMPLATE = [
        ['core/paragraph', { 
            content: 'LABEL', 
            style: { 
                typography: { textTransform: 'uppercase', letterSpacing: '0.1em' }
            }
        }],
        ['core/heading', { 
            level: 3, 
            placeholder: 'Card Title'
        }],
        ['core/paragraph', { 
            placeholder: 'Add a short description or excerpt here...'
        }],
        ['core/buttons', {}, [
            ['core/button', { 
                text: 'LEARN MORE >'
            }]
        ]]
    ];

    const blockProps = useBlockProps({
        className: `fc-magazine-item is-layout-${layout}`
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Card Layout', 'first-church-core-blocks')}>
                    <SelectControl
                        label={__('Orientation', 'first-church-core-blocks')}
                        value={layout}
                        options={[
                            { label: __('Vertical (Standard)', 'first-church-core-blocks'), value: 'vertical' },
                            { label: __('Horizontal (List)', 'first-church-core-blocks'), value: 'horizontal' }
                        ]}
                        onChange={(val) => setAttributes({ layout: val })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div className="fc-magazine-item__image-wrapper">
                    { ! mediaUrl ? (
                        <MediaPlaceholder
                            onSelect={ onSelectMedia }
                            allowedTypes={ [ 'image' ] }
                            multiple={ false }
                            labels={ { title: 'Card Image' } }
                        />
                    ) : (
                        <>
                            <BlockControls>
                                <MediaReplaceFlow
                                    mediaId={ mediaId }
                                    mediaUrl={ mediaUrl }
                                    allowedTypes={ [ 'image' ] }
                                    accept="image/*"
                                    onSelect={ onSelectMedia }
                                />
                            </BlockControls>
                            <img src={ mediaUrl } alt="" />
                        </>
                    ) }
                </div>
                <div className="fc-magazine-item__content">
                    <InnerBlocks
                        template={ TEMPLATE }
                        templateLock={ false }
                    />
                </div>
            </div>
        </>
    );
}
