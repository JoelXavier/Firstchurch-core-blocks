import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, RangeControl } from '@wordpress/components';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
    const { blockTitle, blockSubtitle, perPage, columns, filterStyle, showCategory, showExcerpt } = attributes;
    
    const blockProps = useBlockProps({
        className: `fc-listing fc-event-feed layout-${filterStyle}`
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Feed Settings', 'first-church-core-blocks')}>
                     <RangeControl
                        label={__('Items Per Page', 'first-church-core-blocks')}
                        value={perPage}
                        onChange={(value) => setAttributes({ perPage: value })}
                        min={3}
                        max={24}
                    />
                     <RangeControl
                        label={__('Columns (Grid)', 'first-church-core-blocks')}
                        value={columns}
                        onChange={(value) => setAttributes({ columns: value })}
                        min={1}
                        max={4}
                    />
                    <SelectControl
                        label={__('Filter Style', 'first-church-core-blocks')}
                        value={filterStyle}
                        options={[
                            { label: 'Sidebar (Left)', value: 'sidebar' },
                            { label: 'Pills (Top)', value: 'pills' },
                            { label: 'None', value: 'none' },
                        ]}
                        onChange={(value) => setAttributes({ filterStyle: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Display Options', 'first-church-core-blocks')}>
                    <ToggleControl
                        label={__('Show Event Type', 'first-church-core-blocks')}
                        checked={showCategory}
                        onChange={(value) => setAttributes({ showCategory: value })}
                    />
                    <ToggleControl
                        label={__('Show Excerpt', 'first-church-core-blocks')}
                        checked={showExcerpt}
                        onChange={(value) => setAttributes({ showExcerpt: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="fc-listing__header">
                     <RichText
                        tagName="h2"
                        className="fc-listing__title"
                        value={blockTitle}
                        onChange={(value) => setAttributes({ blockTitle: value })}
                        placeholder={__('Section Title...', 'first-church-core-blocks')}
                    />
                    <div className="fc-listing__decoration"></div>
                     <RichText
                        tagName="p"
                        className="fc-listing__subtitle"
                        value={blockSubtitle}
                        onChange={(value) => setAttributes({ blockSubtitle: value })}
                        placeholder={__('Add a subtitle...', 'first-church-core-blocks')}
                    />
                </div>

                <div className="fc-listing__body">
                    {filterStyle === 'sidebar' && (
                        <div className="fc-listing__sidebar placeholder-sidebar">
                            <div className="fc-listing__filters fc-listing__filters--sidebar">
                                <h4 className="fc-listing__filter-group-title">Filter By Month</h4>
                                <div className="fc-filter-btn">October 2025</div>
                                <div className="fc-filter-btn">November 2025</div>
                                <div className="fc-filter-btn">December 2025</div>
                            </div>
                        </div>
                    )}

                    <div className="fc-listing__main placeholder-grid">
                        <div className="fc-listing__grid">
                            <div className="placeholder-card">Event Card 1</div>
                            <div className="placeholder-card">Event Card 2</div>
                            <div className="placeholder-card">Event Card 3</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
