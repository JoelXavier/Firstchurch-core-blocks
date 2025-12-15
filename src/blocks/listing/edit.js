import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit({ attributes, setAttributes }) {
    const { postType, perPage, layout, columns, showDate, showCategory, showExcerpt } = attributes;

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Query Settings', 'antigravity-core-blocks')}>
                    <SelectControl
                        label={__('Post Type', 'antigravity-core-blocks')}
                        value={postType}
                        options={[
                            { label: 'Posts', value: 'post' },
                            { label: 'Pages', value: 'page' },
                        ]}
                        onChange={(val) => setAttributes({ postType: val })}
                    />
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
                </PanelBody>
            </InspectorControls>

            <ServerSideRender
                block="antigravity/listing"
                attributes={attributes}
            />
        </div>
    );
}
