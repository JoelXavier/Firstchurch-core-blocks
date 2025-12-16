import React from 'react';
import { AuthorCard } from '../AuthorCard/AuthorCard';
import './ArticleBody.scss';

/**
 * Article Body Component
 * 
 * @param {object} author - Author data object
 * @param {React.ReactNode} children - Article content
 */
export const ArticleBody = ({
    author = {
        name: "Brother Joel Guerrero",
        team: "IT Team",
        location: "Bronx Temple",
        imageUrl: "https://placehold.co/200x200/222/gold?text=JG"
    },
    children
}) => {
    return (
        <section className="antigravity-article-body">
            <div className="article-body-grid">
                {/* Author Sidebar (Left on Desktop, Bottom on Mobile) */}
                <aside className="article-sidebar">
                    <div className="sidebar-sticky">
                        <AuthorCard {...author} />
                    </div>
                </aside>

                {/* Main Content (Center) */}
                <article className="article-content">
                    {/* Simulated InnerBlocks Content */}
                    <div className="article-typography">
                         {children}
                        
                        {/* Tombstone */}
                        <div className="article-tombstone">
                            <span className="tombstone-icon">❖</span>
                        </div>
                    </div>
                </article>
                
                {/* Empty Right Column for Balance (Optional, or just use Grid centering) */}
                <div className="article-right-spacer"></div>
            </div>
        </section>
    );
};
