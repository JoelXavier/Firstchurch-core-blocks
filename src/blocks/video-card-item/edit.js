import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { 
        label, 
        title, 
        linkUrl, 
        linkText, 
        videoUrl,
        videoId,
        mediaUrl,
        cardLabelColor,
        cardTitleColor,
        cardLinkColor
    } = attributes;

    const extractVideoId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    };

    const handleVideoUrlChange = (newUrl) => {
        setAttributes({ videoUrl: newUrl });
        const extractedId = extractVideoId(newUrl);
        if (extractedId) {
            setAttributes({ 
                videoId: extractedId,
                mediaUrl: `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg` 
            });
        } else {
            setAttributes({ videoId: '', mediaUrl: '' });
        }
    };

    const style = {
        '--local-card-label-color': cardLabelColor,
        '--local-card-title-color': cardTitleColor,
        '--local-card-link-color': cardLinkColor,
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Content Settings', 'first-church-core-blocks')}>
                    <TextControl
                        label={__('YouTube Video URL', 'first-church-core-blocks')}
                        value={videoUrl}
                        onChange={handleVideoUrlChange}
                        help={__('Paste a YouTube link to auto-generate the thumbnail.', 'first-church-core-blocks')}
                    />
                    <TextControl
                        label={__('Link URL (Click Destination)', 'first-church-core-blocks')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                    />
                    <TextControl
                        label={__('Button Text', 'first-church-core-blocks')}
                        value={linkText}
                        onChange={(value) => setAttributes({ linkText: value })}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Text Colors', 'first-church-core-blocks')}
                    initialOpen={false}
                    colorSettings={[
                        {
                            value: cardLabelColor,
                            onChange: (value) => setAttributes({ cardLabelColor: value }),
                            label: __('Label Color', 'first-church-core-blocks'),
                        },
                        {
                            value: cardTitleColor,
                            onChange: (value) => setAttributes({ cardTitleColor: value }),
                            label: __('Title Color', 'first-church-core-blocks'),
                        },
                        {
                            value: cardLinkColor,
                            onChange: (value) => setAttributes({ cardLinkColor: value }),
                            label: __('Button Color', 'first-church-core-blocks'),
                        },
                    ]}
                />
            </InspectorControls>

            <div { ...useBlockProps({ className: 'fc-card-item fc-video-card-item', style: style }) }>
                <div className="fc-card-link-wrapper">
                    
                    {/* Image Area */}
                    <div className="fc-card-image-wrapper">
                        {videoId ? (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${videoId}?controls=0`} 
                                title={title} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            ></iframe>
                        ) : (
                            <div 
                                className="fc-card-image-placeholder"
                                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center', color: '#666' }}
                            >
                                <span style={{fontSize: '24px', marginBottom: '8px'}}>📺</span>
                                {__('Paste YouTube URL', 'first-church-core-blocks')}
                            </div>
                        )}
                    </div>

                    <div className="fc-card-content">
                        {/* Label */}
                        <RichText
                            tagName="span"
                            className="fc-card-label"
                            value={label}
                            onChange={(value) => setAttributes({ label: value })}
                            placeholder={__('LABEL', 'first-church-core-blocks')}
                            allowedFormats={[]} // Plain text only
                        />

                        {/* Title */}
                        <RichText
                            tagName="h3"
                            className="fc-card-title"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder={__('Enter Video Title...', 'first-church-core-blocks')}
                        />

                        <span className="fc-card-cta">{linkText}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
