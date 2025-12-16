import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, FormTokenField, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Listing } from '../../components/Listing/Listing';

// Mock FALLBACK if API fails or is empty, to keep Editor looking nice
const MOCK_ITEMS = [
    { id: 1, title: 'Example Post 1', excerpt: 'Sample excerpt text...', date: 'Oct 12', image: '', category: 'News', label: 'News', linkText: 'READ MORE' },
    { id: 2, title: 'Example Post 2', excerpt: 'Sample excerpt text...', date: 'Oct 15', image: '', category: 'Events', label: 'Events', linkText: 'READ MORE' },
    { id: 3, title: 'Example Post 3', excerpt: 'Sample excerpt text...', date: 'Oct 20', image: '', category: 'Sermons', label: 'Sermons', linkText: 'READ MORE' }
];

export default function Edit({ attributes, setAttributes }) {
    const { 
        postType, perPage, layout, columns, 
        cardType, selectedTaxonomy, selectedTermIds,
        filterStyle, blockTitle, blockSubtitle
    } = attributes;

    // 1. Fetch Taxonomies
    const taxonomies = useSelect((select) => {
        return select('core').getTaxonomies({ type: postType, per_page: -1 });
    }, [postType]);

    // 2. Fetch Terms for the selected taxonomy (for filtering query)
    const { terms } = useSelect((select) => {
        if (!selectedTaxonomy) return { terms: [] };
        const query = { taxonomy: selectedTaxonomy, per_page: -1, hide_empty: true };
        return {
            terms: select('core').getEntityRecords('taxonomy', selectedTaxonomy, query)
        };
    }, [selectedTaxonomy]);

    // 3. Helper: Map selected term IDs back to names for FormTokenField
    const selectedTerms = (terms || [])
        .filter((term) => selectedTermIds.includes(term.id))
        .map((term) => term.name);

    // 4. Fetch Actual Posts based on setup
    const { posts, hasPosts } = useSelect((select) => {
        const query = {
            status: 'publish',
            per_page: perPage,
        };
        if (selectedTaxonomy && selectedTermIds.length > 0) {
            query[selectedTaxonomy] = selectedTermIds; // e.g. 'categories': [1, 2]
        }
        return {
            posts: select('core').getEntityRecords('postType', postType, query),
            hasPosts: select('core').hasFinishedResolution('getEntityRecords', ['postType', postType, query])
        };
    }, [postType, perPage, selectedTaxonomy, selectedTermIds]);

    // 5. Fetch ALL categories for the "Filter" UI (if we are building the sidebar)
    //    We ideally want the categories represented in the current/full dataset. 
    //    For editor simplicity, let's just fetch top categories of the main tax.
    const { filterCategories } = useSelect((select) => {
        // If taxonomy selected, show those. Else show 'category' or main tax?
        const taxToFetch = selectedTaxonomy || 'category'; 
        return {
            filterCategories: select('core').getEntityRecords('taxonomy', taxToFetch, { per_page: 5, hide_empty: true })
        };
    }, [selectedTaxonomy]);

    // 6. Map Posts to Listing Component Interface
    const listingItems = (posts || []).map(post => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''), // Strip output
        // We need to fetch the category name, which is async/complex in WP Data 
        // For editor speed, assume 'Label' or fetch logic later.
        category: 'Label', 
        label: 'Label',
        image: post.featured_media ? '...' : null, // Would need with_embedded or separate fetch
        linkText: 'LEARN MORE >',
        href: '#'
    }));

    const finalListItems = listingItems.length > 0 ? listingItems : MOCK_ITEMS;
    const finalCategories = (filterCategories || []).map(c => ({ id: c.id, name: c.name, count: c.count }));

    // Helpers options
    const taxonomyOptions = (taxonomies || [])
        .filter(tax => tax.visibility.public)
        .map((tax) => ({ label: tax.name, value: tax.slug }));

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Content Settings', 'antigravity-core-blocks')}>
                    <TextControl
                        label={__('Title', 'antigravity-core-blocks')}
                        value={blockTitle}
                        onChange={(val) => setAttributes({ blockTitle: val })}
                    />
                    <TextControl
                        label={__('Subtitle', 'antigravity-core-blocks')}
                        value={blockSubtitle}
                        onChange={(val) => setAttributes({ blockSubtitle: val })}
                    />
                </PanelBody>

                <PanelBody title={__('Query Settings', 'antigravity-core-blocks')}>
                    <SelectControl
                        label={__('Card Type', 'antigravity-core-blocks')}
                        value={cardType}
                        options={[
                            { label: 'Standard Card', value: 'standard' },
                            { label: 'Event Card', value: 'event' },
                        ]}
                        onChange={(val) => setAttributes({ cardType: val })}
                    />
                    <SelectControl
                        label={__('Post Type', 'antigravity-core-blocks')}
                        value={postType}
                        options={[
                          { label: 'Posts', value: 'post' },
                          { label: 'Pages', value: 'page' },
                          { label: 'Events', value: 'events' }, // Custom
                          { label: 'Locations', value: 'location' }
                        ]}
                        onChange={(val) => setAttributes({ postType: val, selectedTaxonomy: '' })}
                    />
                    
                     {taxonomyOptions.length > 0 && (
                        <SelectControl
                            label={__('Query Taxonomy (Pre-Filter)', 'antigravity-core-blocks')}
                            help="Only show posts from these terms initially."
                            value={selectedTaxonomy}
                            options={[{ label: 'None (Show All)', value: '' }, ...taxonomyOptions]}
                            onChange={(val) => setAttributes({ selectedTaxonomy: val, selectedTermIds: [] })}
                        />
                    )}

                    {selectedTaxonomy && (
                        <FormTokenField
                            label={__('Select Terms', 'antigravity-core-blocks')}
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
                        label={__('Items Limit per Page', 'antigravity-core-blocks')}
                        value={perPage}
                        onChange={(val) => setAttributes({ perPage: val })}
                        min={1}
                        max={12}
                    />
                </PanelBody>

                <PanelBody title={__('Display Layout', 'antigravity-core-blocks')}>
                     <SelectControl
                        label={__('Filter Style', 'antigravity-core-blocks')}
                        value={filterStyle}
                        options={[
                            { label: 'Sidebar (Left)', value: 'sidebar' },
                            { label: 'Pills (Top)', value: 'pills' },
                        ]}
                        onChange={(val) => setAttributes({ filterStyle: val })}
                    />
                    <RangeControl
                        label={__('Columns', 'antigravity-core-blocks')}
                        value={columns}
                        onChange={(val) => setAttributes({ columns: val })}
                        min={2}
                        max={4}
                    />
                </PanelBody>
            </InspectorControls>

            {/* Render the React Component */}
            <Listing 
                items={finalListItems}
                categories={finalCategories.length > 0 ? finalCategories : [{id:1, name:'Category A'}, {id:2, name:'Category B'}]}
                filterStyle={filterStyle}
                columns={columns}
                title={blockTitle}
                subtitle={blockSubtitle}
            />
        </div>
    );
}
