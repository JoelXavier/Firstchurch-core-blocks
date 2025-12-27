import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    useInnerBlocksProps, 
    MediaPlaceholder,
    BlockControls,
    MediaReplaceFlow,
    InspectorControls
} from '@wordpress/block-editor';
import { 
    ToolbarButton, 
    PanelBody, 
    SelectControl,
    ToggleControl,
    Spinner
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
    const { mediaId, mediaUrl, layout, useDashboardData, fundraiserId } = attributes;

    const [allFundraisers, setAllFundraisers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch centralized data for the dropdown
    useEffect(() => {
        if (useDashboardData) {
            setIsLoading(true);
            apiFetch({ path: '/firstchurch/v1/templates' })
                .then(response => {
                    setAllFundraisers(response.fundraiserData || []);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [useDashboardData]);

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

    const innerBlocksProps = useInnerBlocksProps({
        className: 'fc-magazine-item__content'
    }, {
        template: TEMPLATE,
        templateLock: false,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Data Settings', 'first-church-core-blocks')}>
                    <ToggleControl
                        label={__('Use Dashboard Data', 'first-church-core-blocks')}
                        help={__('Pull title and progress from Mission Control.', 'first-church-core-blocks')}
                        checked={useDashboardData}
                        onChange={(val) => setAttributes({ useDashboardData: val })}
                    />
                    
                    {useDashboardData && (
                        isLoading ? <Spinner /> : (
                            <SelectControl
                                label={__('Select Campaign', 'first-church-core-blocks')}
                                value={fundraiserId}
                                options={[
                                    { label: __('Select a campaign...', 'first-church-core-blocks'), value: '' },
                                    ...allFundraisers.map(f => ({ label: f.title, value: f.id }))
                                ]}
                                onChange={(val) => setAttributes({ fundraiserId: parseInt(val) })}
                            />
                        )
                    )}
                </PanelBody>

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
                    {layout === 'vertical' && (
                        <ToggleControl
                            label={__('Show Text Background', 'first-church-core-blocks')}
                            help={__('Disable to make text transparent and aligned with image edge.', 'first-church-core-blocks')}
                            checked={attributes.showBackground !== false} // Default true
                            onChange={(val) => setAttributes({ showBackground: val })}
                        />
                    )}
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
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}
