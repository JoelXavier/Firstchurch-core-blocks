import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, FormTokenField } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit({ attributes, setAttributes }) {
    const { 
        postType, perPage, layout, columns, 
        showDate, showCategory, showExcerpt, showMedia,
        cardType, selectedTaxonomy, selectedTermIds 
    } = attributes;

    // Fetch Taxonomies
    const taxonomies = useSelect((select) => {
        return select('core').getTaxonomies({ type: postType, per_page: -1 });
    }, [postType]);

    // Fetch Terms for the selected taxonomy
    const { terms, hasResolvedTerms } = useSelect((select) => {
        if (!selectedTaxonomy) return { terms: [], hasResolvedTerms: true };
        const query = { taxonomy: selectedTaxonomy, per_page: -1, hide_empty: true };
        return {
            terms: select('core').getEntityRecords('taxonomy', selectedTaxonomy, query),
            hasResolvedTerms: select('core').hasFinishedResolution('getEntityRecords', ['taxonomy', selectedTaxonomy, query])
        };
    }, [selectedTaxonomy]);

    // Helper: Map selected term IDs back to names for FormTokenField
    const selectedTerms = (terms || [])
        .filter((term) => selectedTermIds.includes(term.id))
        .map((term) => term.name);

    // Helpers options
    const taxonomyOptions = (taxonomies || [])
        .filter(tax => tax.visibility.public)
        .map((tax) => ({ label: tax.name, value: tax.slug }));

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Query Settings', 'antigravity-core-blocks')}>
                    <SelectControl
                        label={__('Card Type', 'antigravity-core-blocks')}
                        value={cardType}
                        options={[
                            { label: 'Standard Card', value: 'standard' },
                            { label: 'Event Card', value: 'event' },
                            { label: 'Location Card', value: 'location' },
                        ]}
                        onChange={(val) => setAttributes({ cardType: val })}
                    />
                    <SelectControl
                        label={__('Post Type', 'antigravity-core-blocks')}
                        value={postType}
                        options={[
                          { label: 'Posts', value: 'post' },
                          { label: 'Pages', value: 'page' },
                          { label: 'Events', value: 'event' }, // Assuming custom post type
                          { label: 'Locations', value: 'location' }
                        ]}
                        onChange={(val) => setAttributes({ postType: val, selectedTaxonomy: '', selectedTermIds: [] })}
                    />
                    
                    {/* Taxonomy Selector */}
                    {taxonomyOptions.length > 0 && (
                        <SelectControl
                            label={__('Filter by Taxonomy', 'antigravity-core-blocks')}
                            value={selectedTaxonomy}
                            options={[{ label: 'None', value: '' }, ...taxonomyOptions]}
                            onChange={(val) => setAttributes({ selectedTaxonomy: val, selectedTermIds: [] })}
                        />
                    )}

                    {/* Term Selector */}
                    {selectedTaxonomy && (
                        <FormTokenField
                            label={__('Select Terms', 'antigravity-core-blocks')}
                            value={selectedTerms}
                            suggestions={(terms || []).map((term) => term.name)}
                            onChange={(tokens) => {
                                // Convert names back to IDs
                                const newIds = tokens.map((token) => {
                                    const term = terms.find((t) => t.name === token);
                                    return term ? term.id : null;
                                }).filter(Boolean);
                                setAttributes({ selectedTermIds: newIds });
                            }}
                        />
                    )}

                    <RangeControl
                        label={__('Items Limit', 'antigravity-core-blocks')}
                        value={perPage}
                        onChange={(val) => setAttributes({ perPage: val })}
                        min={1}
                        max={12}
                    />
                </PanelBody>
                <PanelBody title={__('Layout Settings', 'antigravity-core-blocks')}>
                    <SelectControl
                        label={__('Layout', 'antigravity-core-blocks')}
                        value={layout}
                        options={[
                            { label: 'Grid', value: 'grid' },
                            { label: 'List', value: 'list' },
                        ]}
                        onChange={(val) => setAttributes({ layout: val })}
                    />
                    {layout === 'grid' && (
                        <RangeControl
                            label={__('Columns', 'antigravity-core-blocks')}
                            value={columns}
                            onChange={(val) => setAttributes({ columns: val })}
                            min={2}
                            max={4}
                        />
                    )}
                </PanelBody>
                <PanelBody title={__('Display Settings', 'antigravity-core-blocks')}>
                    <ToggleControl
                        label={__('Show Date', 'antigravity-core-blocks')}
                        checked={showDate}
                        onChange={(val) => setAttributes({ showDate: val })}
                    />
                    <ToggleControl
                        label={__('Show Category', 'antigravity-core-blocks')}
                        checked={showCategory}
                        onChange={(val) => setAttributes({ showCategory: val })}
                    />
                    <ToggleControl
                        label={__('Show Excerpt', 'antigravity-core-blocks')}
                        checked={showExcerpt}
                        onChange={(val) => setAttributes({ showExcerpt: val })}
                    />
                    <ToggleControl
                        label={__('Show Media', 'antigravity-core-blocks')}
                        checked={showMedia}
                        onChange={(val) => setAttributes({ showMedia: val })}
                    />
                </PanelBody>
            </InspectorControls>

            <ServerSideRender
                block="antigravity/listing"
                attributes={attributes}
            />
        </div>
    );
}
