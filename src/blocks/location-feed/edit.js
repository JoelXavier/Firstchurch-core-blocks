import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, FormTokenField, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Listing } from '../../components/Listing/Listing';

// Mock FALLBACK for Location Feed
const MOCK_ITEMS = [
    { id: 1, title: 'Main Campus', excerpt: '123 Divine Blvd...', category: 'Alabama', label: 'Alabama', linkText: 'View Map' },
    { id: 2, title: 'North Branch', excerpt: '456 Holy Way...', category: 'Alabama', label: 'Alabama', linkText: 'View Map' },
    { id: 3, title: 'International Mission', excerpt: '789 Globe St...', category: 'International', label: 'International', linkText: 'View Map' }
];

export default function Edit({ attributes, setAttributes }) {
    const { 
        perPage, columns, 
        selectedTaxonomy, selectedTermIds,
        filterStyle, blockTitle, blockSubtitle
    } = attributes;

    const postType = 'location'; // Hardcoded for this block

    // 1. Fetch Taxonomies (Only for Location)
    const taxonomies = useSelect((select) => {
        return select('core').getTaxonomies({ type: postType, per_page: -1 });
    }, [postType]);

    // 2. Fetch Terms for the selected taxonomy
    const { terms } = useSelect((select) => {
        if (!selectedTaxonomy) return { terms: [] };
        const query = { taxonomy: selectedTaxonomy, per_page: -1, hide_empty: true };
        return {
            terms: select('core').getEntityRecords('taxonomy', selectedTaxonomy, query)
        };
    }, [selectedTaxonomy]);

    // 3. Helper: Map selected term IDs back to names
    const selectedTerms = (terms || [])
        .filter((term) => selectedTermIds.includes(term.id))
        .map((term) => term.name);

    // 4. Fetch Actual Posts
    const { posts, hasPosts } = useSelect((select) => {
        const query = {
            status: 'publish',
            per_page: perPage,
        };
        if (selectedTaxonomy && selectedTermIds.length > 0) {
            query[selectedTaxonomy] = selectedTermIds; 
        }
        return {
            posts: select('core').getEntityRecords('postType', postType, query)
        };
    }, [postType, perPage, selectedTaxonomy, selectedTermIds]);

    // 5. Fetch Categories for Filter UI (Preview)
    const { filterCategories } = useSelect((select) => {
        const taxToFetch = selectedTaxonomy || 'location_category'; 
        return {
            filterCategories: select('core').getEntityRecords('taxonomy', taxToFetch, { per_page: 5, hide_empty: true })
        };
    }, [selectedTaxonomy]);

    // 6. Map Posts to Display
    const listingItems = (posts || []).map(post => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 50) + '...', 
        category: 'Location', 
        label: 'Location',
        image: null, 
        linkText: 'VIEW MAP >',
        href: '#'
    }));

    const finalListItems = listingItems.length > 0 ? listingItems : MOCK_ITEMS;
    const finalCategories = (filterCategories || []).map(c => ({ id: c.id, name: c.name, count: c.count }));

    // Helper options
    const taxonomyOptions = (taxonomies || [])
        .filter(tax => tax.visibility.public)
        .map((tax) => ({ label: tax.name, value: tax.slug }));

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Content Settings', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('Title', 'first-church-core-blocks')}
                        value={blockTitle}
                        onChange={(val) => setAttributes({ blockTitle: val })}
                    />
                    <TextControl
                        label={__('Subtitle', 'first-church-core-blocks')}
                        value={blockSubtitle}
                        onChange={(val) => setAttributes({ blockSubtitle: val })}
                    />
                </PanelBody>

                <PanelBody title={__('Query Settings', 'first-church-core-blocks')}>
                    {/* Simplified: Removed Card Type & Post Type since fixed */}
                    
                     {taxonomyOptions.length > 0 && (
                        <SelectControl
                            label={__('Filter Taxonomy', 'first-church-core-blocks')}
                            help="Select the category method (e.g. Location Category)"
                            value={selectedTaxonomy}
                            options={[{ label: 'None (Show All)', value: '' }, ...taxonomyOptions]}
                            onChange={(val) => setAttributes({ selectedTaxonomy: val, selectedTermIds: [] })}
                        />
                    )}

                    {selectedTaxonomy && (
                        <FormTokenField
                            label={__('Pre-filter by Terms', 'first-church-core-blocks')}
                            help="Only show locations from these specific categories initially."
                            value={selectedTerms}
                            suggestions={(terms || []).map((term) => term.name)}
                            onChange={(tokens) => {
                                const newIds = tokens.map((token) => {
                                    const term = terms.find((t) => t.name === token);
                                    return term ? term.id : null;
                                }).filter(Boolean);
                                setAttributes({ selectedTermIds: newIds });
                            }}
                        />
                    )}

                    <RangeControl
                        label={__('Locations per Page', 'first-church-core-blocks')}
                        value={perPage}
                        onChange={(val) => setAttributes({ perPage: val })}
                        min={1}
                        max={50}
                    />
                </PanelBody>

                <PanelBody title={__('Display Layout', 'first-church-core-blocks')}>
                     <SelectControl
                        label={__('Filter Bar Style', 'first-church-core-blocks')}
                        value={filterStyle}
                        options={[
                            { label: 'Pills (Top)', value: 'pills' },
                            { label: 'Sidebar (Left)', value: 'sidebar' },
                            { label: 'None', value: 'none' }
                        ]}
                        onChange={(val) => setAttributes({ filterStyle: val })}
                    />
                    <RangeControl
                        label={__('Columns', 'first-church-core-blocks')}
                        value={columns}
                        onChange={(val) => setAttributes({ columns: val })}
                        min={1}
                        max={4}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Render the React Component */}
            <Listing 
                items={finalListItems}
                categories={finalCategories.length > 0 ? finalCategories : []}
                filterStyle={filterStyle}
                columns={columns}
                title={blockTitle}
                subtitle={blockSubtitle}
            />
        </div>
    );
}
