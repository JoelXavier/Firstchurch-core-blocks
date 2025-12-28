import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit( { attributes, setAttributes, onReplace, mergeBlocks } ) {
	const { content } = attributes;
	const blockProps = useBlockProps();

	return (
		<p { ...blockProps }>
			<RichText
				tagName="span"
				value={ content }
				onChange={ ( newContent ) => setAttributes( { content: newContent } ) }
				placeholder={ __( 'Type / to choose a block', 'first-church-core-blocks' ) }
				onReplace={ onReplace }
				onMerge={ mergeBlocks }
			/>
		</p>
	);
}
