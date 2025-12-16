import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, InnerBlocks, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, Button } from '@wordpress/components';
import { ArticleBody as ArticleBodyComponent } from '../../components/ArticleBody/ArticleBody';
import './style.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { authorName, authorTeam, authorLocation, authorImageId, authorImageUrl, showAuthor, dropCapColor } = attributes;

	const blockProps = useBlockProps({
		className: 'antigravity-article-body',
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
				<PanelBody title={ __( 'Author Card', 'antigravity' ) }>
					<ToggleControl
						label={ __( 'Show Author Card', 'antigravity' ) }
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
													{ authorImageId ? __( 'Replace', 'antigravity' ) : __( 'Upload', 'antigravity' ) }
												</Button>
											</div>
										</div>
									) }
								/>
							</MediaUploadCheck>
							<TextControl
								label={ __( 'Name', 'antigravity' ) }
								value={ authorName }
								onChange={ ( val ) => setAttributes( { authorName: val } ) }
							/>
							<TextControl
								label={ __( 'Team', 'antigravity' ) }
								value={ authorTeam }
								onChange={ ( val ) => setAttributes( { authorTeam: val } ) }
							/>
							<TextControl
								label={ __( 'Location', 'antigravity' ) }
								value={ authorLocation }
								onChange={ ( val ) => setAttributes( { authorLocation: val } ) }
							/>
						</>
					) }
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Dropcap Color', 'antigravity' ) }
					colorSettings={ [
						{
							value: dropCapColor,
							onChange: ( colorValue ) => setAttributes( { dropCapColor: colorValue } ),
							label: __( 'Dropcap Color', 'antigravity' ),
						},
					] }
				/>
			</InspectorControls>

			{/* 
				We cannot use the React Component directly here cleanly because 
				it expects `children` prop, but InnerBlocks doesn't pass itself as children simply.
				Also we want WYSIWYG editing.
				So we replicate the Component's structure but put <InnerBlocks /> inside the typography container.
			*/}
			<div className="article-body-grid">
				{/* Sidebar */}
				{ showAuthor && (
					<aside className="article-sidebar">
						<div className="sidebar-sticky">
							{/* Using the React Component for the card is fine */}
							<div className="antigravity-author-card">
								<div className="author-card-image">
									{authorImageUrl ? (
										<img src={authorImageUrl} alt={authorName} />
									) : (
										<div className="author-card-placeholder">{authorName.charAt(0)}</div>
									)}
								</div>
								<div className="author-card-info">
									<span className="author-card-name">{authorName}</span>
									<span className="author-card-team">{authorTeam}</span>
									<span className="author-card-location">{authorLocation}</span>
								</div>
							</div>
							
							{/* Share Button Placeholder (Editor Visual) */}
							<div className="article-share-button" style={{marginTop:'1rem', textAlign:'center', opacity:0.5}}>
								<span className="dashicons dashicons-share"></span> Share
							</div>
						</div>
					</aside>
				)}

				{/* Content */}
				<article className="article-content">
					<div className="article-typography">
						<InnerBlocks />
						
						<div className="article-tombstone">
							<span className="tombstone-icon">❖</span>
						</div>
					</div>
				</article>

				{/* Spacer */}
				<div className="article-right-spacer"></div>
			</div>
		</div>
	);
}
