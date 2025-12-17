/**
 * Article Body Frontend Script
 * Handles Share Button interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all specific share buttons
    const shareButtons = document.querySelectorAll('.fc-article-body__share');

    shareButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const title = document.title;
            const url = window.location.href;
            const originalText = button.innerHTML; 

            // Try Web Share API first
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: title,
                        url: url
                    });
                    // Success (native dialog shown)
                    return;
                } catch (err) {
                    // Check if user cancelled or error
                    if (err.name !== 'AbortError') {
                        console.error('Share failed:', err);
                    }
                    // If share fails/cancels, do nothing or fallback? 
                    // Usually we don't fallback to clipboard if share was attempted but cancelled.
                    // But if it failed for not supported, we fallback.
                    // However, we checked navigator.share existance. 
                    // Proceeding to clipboard fallback only if share explicitly failed? 
                    // No, usually best to just stick to one or the other if possible, 
                    // but on desktop Safari, share exists but might fail.
                    // Let's fallback to clipboard only if share is NOT supported or fails badly.
                }
            }

            // Fallback: Clipboard
            try {
                await navigator.clipboard.writeText(url);
                
                // Show Feedback
                // Create a temporary feedback element or change icon??
                // Let's simpler: Tooltip or change text.
                // Since the button has an SVG, let's append a small tooltip.
                
                let tooltip = button.querySelector('.fc-share-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('span');
                    tooltip.className = 'fc-share-tooltip';
                    tooltip.textContent = 'Copied!';
                    tooltip.style.cssText = `
                        position: absolute;
                        top: -30px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #000;
                        color: #fff;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        opacity: 0;
                        transition: opacity 0.2s;
                        pointer-events: none;
                    `;
                    button.style.position = 'relative'; // Ensure positioning context
                    button.appendChild(tooltip);
                }
                
                // Show
                requestAnimationFrame(() => {
                    tooltip.style.opacity = '1';
                });

                // Hide after 2s
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
                    }, 200);
                }, 2000);

            } catch (err) {
                console.error('Clipboard failed:', err);
                alert('Could not copy link.');
            }
        });
    });
});
