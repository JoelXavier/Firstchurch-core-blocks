import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import './editor.scss';

export default function Edit( { attributes, setAttributes, onReplace, mergeBlocks } ) {
	const { level, content } = attributes;
	const blockProps = useBlockProps();
	const tagName = 'h' + level;

	function createLevelControl( targetLevel, selectedLevel, onChange ) {
		return {
			icon: 'heading',
			title: `Heading ${ targetLevel }`,
			isActive: targetLevel === selectedLevel,
			onClick: () => onChange( targetLevel ),
			subscript: String( targetLevel ),
		};
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup
					isCollapsed={ true }
					icon="heading"
					label={ __( 'Change heading level', 'first-church-core-blocks' ) }
					controls={ [ 1, 2, 3, 4, 5, 6 ].map( ( index ) =>
						createLevelControl( index, level, ( newLevel ) =>
							setAttributes( { level: newLevel } )
						)
					) }
				/>
			</BlockControls>
			<RichText
				tagName={ tagName }
				{ ...blockProps }
				value={ content }
				onChange={ ( newContent ) => setAttributes( { content: newContent } ) }
				placeholder={ __( 'Heading', 'first-church-core-blocks' ) }
				onReplace={ onReplace }
				onMerge={ mergeBlocks }
				onSplit={ ( value ) => {
					// Good UX: Enter at end of heading -> creates Paragraph
					if ( ! value ) {
						return createBlock( 'core/paragraph' );
					}
					// Enter in middle -> splits heading (keeps level)
					return createBlock( 'firstchurch/heading', {
						...attributes,
						content: value,
					} );
				} }
			/>
		</>
	);
}
