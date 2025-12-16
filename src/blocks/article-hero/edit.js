import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, Button } from '@wordpress/components';
import { ArticleHero } from '../../components/ArticleHero/ArticleHero';
import './style.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { variant, title, authorName, category, date, heroImageId, heroImageUrl } = attributes;

	const onSelectImage = ( media ) => {
		setAttributes( {
			heroImageId: media.id,
			heroImageUrl: media.url,
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			heroImageId: 0,
			heroImageUrl: '',
		} );
	};

	// Map attributes to Component Props
	const componentProps = {
		variant,
		imageUrl: heroImageUrl,
		title,
		author: authorName,
		date,
		category,
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Hero Settings', 'firstchurch' ) }>
					<SelectControl
						label={ __( 'Variant', 'firstchurch' ) }
						value={ variant }
						options={ [
							{ label: 'Standard', value: 'standard' },
							{ label: 'Immersive', value: 'immersive' },
						] }
						onChange={ ( newVariant ) => setAttributes( { variant: newVariant } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Content', 'firstchurch' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ heroImageId }
							render={ ( { open } ) => (
								<div style={ { marginBottom: '1rem' } }>
									<label style={{display:'block', marginBottom:'0.5rem'}}>Hero Image</label>
									{!heroImageId && (
										<Button variant="secondary" onClick={ open }>
											{ __( 'Upload Image', 'first-church-core-blocks' ) }
										</Button>
									)}
									{heroImageId && (
										<>
											<div style={{marginBottom:'0.5rem', width:'100%', height:'150px', display: 'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#f0f0f0'}}>
												<img src={heroImageUrl} alt="Hero" style={{width:'100%', height:'100%', objectFit:'cover'}} />
											</div>
											<Button variant="link" isDestructive onClick={ onRemoveImage }>
												{ __( 'Remove Image', 'first-church-core-blocks' ) }
											</Button>
											<Button variant="secondary" onClick={ open }>
												{ __( 'Replace Image', 'first-church-core-blocks' ) }
											</Button>
										</>
									)}
								</div>
							) }
						/>
					</MediaUploadCheck>
					<TextControl
						label={ __( 'Title', 'first-church-core-blocks' ) }
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
					/>
					<TextControl
						label={ __( 'Category', 'first-church-core-blocks' ) }
						value={ category }
						onChange={ ( val ) => setAttributes( { category: val } ) }
					/>
					<TextControl
						label={ __( 'Author Name', 'first-church-core-blocks' ) }
						value={ authorName }
						onChange={ ( val ) => setAttributes( { authorName: val } ) }
					/>
					<TextControl
						label={ __( 'Date', 'first-church-core-blocks' ) }
						value={ date }
						onChange={ ( val ) => setAttributes( { date: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ArticleHero { ...componentProps } />
		</div>
	);
}
