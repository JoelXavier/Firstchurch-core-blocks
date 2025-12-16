import { __ } from '@wordpress/i18n';
import { Card, CardBody, Button, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function TemplateCard({ template }) {
    const [isCreating, setIsCreating] = useState(false);

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
                    // 2. Inject Pattern Content (Conceptually - in real app might need block parsing)
                    // For now, assume pattern slug is handled or just placeholder.
                    // A real implementation would fetch the pattern content first.
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
            <div className="fc-dashboard__card-preview">
                {/* Placeholder for thumbnail */}
                <div className="fc-dashboard__card-thumbnail-placeholder" />
            </div>
            <CardBody>
                <h3>{template.title}</h3>
                <p>{template.description}</p>
                <Button variant="primary" onClick={handleCreate} isBusy={isCreating} disabled={isCreating}>
                    { __('Use Template', 'first-church-core-blocks') }
                </Button>
            </CardBody>
        </Card>
    );
}
