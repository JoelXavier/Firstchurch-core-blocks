import { __ } from '@wordpress/i18n';
import { Card, CardBody, Button, Dashicon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function TemplateCard({ template }) {
    const [isCreating, setIsCreating] = useState(false);

    // Helper: Select Icon based on context
    const getIcon = () => {
        if (template.postType === 'event') return 'calendar-alt';
        if (template.postType === 'location') return 'location';
        if (template.title.toLowerCase().includes('homepage')) return 'admin-home';
        if (template.title.toLowerCase().includes('profile')) return 'admin-users';
        if (template.title.toLowerCase().includes('mission')) return 'admin-site';
        return 'layout'; // Default
    };

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            // 1. Create Draft
            const post = await apiFetch({
                path: `/wp/v2/${template.postType}s`, // e.g., posts, pages
                method: 'POST',
                data: {
                    status: 'draft',
                    title: `New ${template.title}`, 
                    content: `<!-- wp:pattern {"slug":"${template.pattern}"} /-->` 
                }
            });

            // 3. Redirect
            if (post && post.id) {
                window.location.href = `post.php?post=${post.id}&action=edit`;
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setIsCreating(false);
        }
    };

    return (
        <Card className="fc-dashboard__card">
             <div className="fc-dashboard__card-header">
                <div className="fc-card-icon">
                    <Dashicon icon={getIcon()} />
                </div>
                <div className="fc-card-label">{template.postType === 'post' ? 'Article' : template.postType}</div>
            </div>
            
            <CardBody className="fc-dashboard__card-body">
                <h3>{template.title}</h3>
                <p>{template.description || __('Start with this pre-designed template.', 'first-church-core-blocks')}</p>
                
                <div className="fc-card-actions">
                    <Button variant="primary" onClick={handleCreate} isBusy={isCreating} disabled={isCreating}>
                        { __('Create', 'first-church-core-blocks') }
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
