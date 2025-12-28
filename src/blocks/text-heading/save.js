import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { level, content } = attributes;
	const tagName = 'h' + level;
	const blockProps = useBlockProps.save();

	return (
		<RichText.Content tagName={ tagName } { ...blockProps } value={ content } />
	);
}
