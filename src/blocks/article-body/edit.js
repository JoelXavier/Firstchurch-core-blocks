import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, InnerBlocks, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, Button } from '@wordpress/components';
import { ArticleBody as ArticleBodyComponent } from '../../components/ArticleBody/ArticleBody';
import './style.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { authorName, authorTeam, authorLocation, authorImageId, authorImageUrl, showAuthor, dropCapColor } = attributes;

	const blockProps = useBlockProps({
		className: 'fc-article-body',
		style: { '--dropcap-color': dropCapColor }
	});

	const onSelectImage = ( media ) => {
		setAttributes( {
			authorImageId: media.id,
			authorImageUrl: media.url,
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			authorImageId: 0,
			authorImageUrl: '',
		} );
	};

	// Mock author object for component
	const authorData = {
		name: authorName,
		team: authorTeam,
		location: authorLocation,
		imageUrl: authorImageUrl
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Author Card', 'first-church-core-blocks' ) }>
					<ToggleControl
						label={ __( 'Show Author Card', 'first-church-core-blocks' ) }
						checked={ showAuthor }
						onChange={ ( val ) => setAttributes( { showAuthor: val } ) }
					/>
					{ showAuthor && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectImage }
									allowedTypes={ [ 'image' ] }
									value={ authorImageId }
									render={ ( { open } ) => (
										<div style={ { marginBottom: '1rem', marginTop: '1rem' } }>
											<label style={{display:'block', marginBottom:'0.5rem'}}>Headshot</label>
											<div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
												{authorImageUrl ? (
													<img src={authorImageUrl} alt="Author" style={{width:'50px', height:'50px', borderRadius:'50%', objectFit:'cover'}} />
												) : (
													<div style={{width:'50px', height:'50px', borderRadius:'50%', background:'#eee'}}></div>
												)}
												<Button variant="secondary" onClick={ open }>
													{ authorImageId ? __( 'Replace', 'first-church-core-blocks' ) : __( 'Upload', 'first-church-core-blocks' ) }
												</Button>
											</div>
										</div>
									) }
								/>
							</MediaUploadCheck>
							<TextControl
								label={ __( 'Name', 'first-church-core-blocks' ) }
								value={ authorName }
								onChange={ ( val ) => setAttributes( { authorName: val } ) }
							/>
							<TextControl
								label={ __( 'Team', 'first-church-core-blocks' ) }
								value={ authorTeam }
								onChange={ ( val ) => setAttributes( { authorTeam: val } ) }
							/>
							<TextControl
								label={ __( 'Location', 'first-church-core-blocks' ) }
								value={ authorLocation }
								onChange={ ( val ) => setAttributes( { authorLocation: val } ) }
							/>
						</>
					) }
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Dropcap Color', 'first-church-core-blocks' ) }
					colorSettings={ [
						{
							value: dropCapColor,
							onChange: ( colorValue ) => setAttributes( { dropCapColor: colorValue } ),
							label: __( 'Dropcap Color', 'first-church-core-blocks' ),
						},
					] }
				/>
			</InspectorControls>

			<div className="fc-article-body__grid">
				{/* Sidebar */}
				{ showAuthor && (
					<aside className="fc-article-body__sidebar">
						<div className="fc-article-body__sticky">
							{/* Using the React Component for the card is fine */}
							<div className="fc-author-card">
								<div className="fc-author-card__media">
									{authorImageUrl ? (
										<img src={authorImageUrl} alt={authorName} />
									) : (
										<div className="fc-author-card__placeholder">{authorName.charAt(0)}</div>
									)}
								</div>
								<div className="fc-author-card__info">
									<span className="fc-author-card__name">{authorName}</span>
									<span className="fc-author-card__team">{authorTeam}</span>
									<span className="fc-author-card__location">{authorLocation}</span>
								</div>
							</div>
							
							{/* Share Button Placeholder (Editor Visual) */}
							<div className="fc-article-body__share" style={{marginTop:'1rem', textAlign:'center', opacity:0.5}}>
								<span className="dashicons dashicons-share"></span> Share
							</div>
						</div>
					</aside>
				)}

				{/* Content */}
				<article className="fc-article-body__content">
					<div className="fc-article-body__typography">
						<InnerBlocks />
						
						<div className="fc-article-body__tombstone">
							<span className="fc-article-body__tombstone-icon">❖</span>
						</div>
					</div>
				</article>

				{/* Spacer */}
				<div className="fc-article-body__spacer"></div>
			</div>
		</div>
	);
}
