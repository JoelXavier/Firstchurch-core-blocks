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
        <section className="fc-article-body">
            <div className="fc-article-body__grid">
                {/* Author Sidebar (Left on Desktop, Bottom on Mobile) */}
                <aside className="fc-article-body__sidebar">
                    <div className="fc-article-body__sticky">
                        <AuthorCard {...author} />
                    </div>
                </aside>

                {/* Main Content (Center) */}
                <article className="fc-article-body__content">
                    {/* Simulated InnerBlocks Content */}
                    <div className="fc-article-body__typography">
                         {children}
                        
                        {/* Tombstone */}
                        <div className="fc-article-body__tombstone">
                            <span className="fc-article-body__tombstone-icon">❖</span>
                        </div>
                    </div>
                </article>
                
                {/* Empty Right Column for Balance (Optional, or just use Grid centering) */}
                <div className="fc-article-body__spacer"></div>
            </div>
        </section>
    );
};
