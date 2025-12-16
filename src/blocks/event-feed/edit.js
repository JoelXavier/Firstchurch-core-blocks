import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, RangeControl } from '@wordpress/components';
import './style.scss';

export default function Edit({ attributes, setAttributes }) {
    const { blockTitle, blockSubtitle, perPage, columns, filterStyle, showCategory, showExcerpt } = attributes;
    
    const blockProps = useBlockProps({
        className: `firstchurch-event-feed firstchurch-listing-component layout-${filterStyle}`
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
                <div className="listing-header">
                     <RichText
                        tagName="h2"
                        className="listing-title"
                        value={blockTitle}
                        onChange={(value) => setAttributes({ blockTitle: value })}
                        placeholder={__('Section Title...', 'first-church-core-blocks')}
                    />
                    <div className="listing-decoration"></div>
                     <RichText
                        tagName="p"
                        className="listing-subtitle"
                        value={blockSubtitle}
                        onChange={(value) => setAttributes({ blockSubtitle: value })}
                        placeholder={__('Add a subtitle...', 'first-church-core-blocks')}
                    />
                </div>

                <div className="listing-body">
                    {filterStyle === 'sidebar' && (
                        <div className="listing-sidebar placeholder-sidebar">
                            <div className="filter-group">
                                <h4 className="filter-group-title">Filter By Month</h4>
                                <div className="filter-item">October 2025</div>
                                <div className="filter-item">November 2025</div>
                                <div className="filter-item">December 2025</div>
                            </div>
                        </div>
                    )}

                    <div className="listing-main placeholder-grid">
                        <div className="placeholder-card">Event Card 1</div>
                        <div className="placeholder-card">Event Card 2</div>
                        <div className="placeholder-card">Event Card 3</div>
                    </div>
                </div>
            </div>
        </>
    );
}
