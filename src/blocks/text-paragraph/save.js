import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { content } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<p { ...blockProps }>
			<RichText.Content tagName="span" value={ content } />
		</p>
	);
}
