import React from 'react';
import './QuickLinks.scss';

export function QuickLinks({
    title = "Quick Links",
    links = [
        { id: 1, label: "TOG Times", image: "https://placehold.co/100x100/333/gold?text=TOG", url: "#" },
        { id: 2, label: "FC Medical Unit", image: "https://placehold.co/100x100/333/gold?text=FC", url: "#" },
        { id: 3, label: "FC ByLaws", image: "https://placehold.co/100x100/333/gold?text=Law", url: "#" }
    ]
}) {
    return (
        <section className="antigravity-quick-links">
            <div className="quick-links-inner">
                
                {/* Header (Left) */}
                <div className="quick-links-header">
                    <h2 className="quick-links-title">{title}</h2>
                    <div className="quick-links-underline"></div>
                </div>

                {/* List (Right) */}
                <div className="quick-links-list">
                    {links.map((link) => (
                        <a key={link.id} href={link.url} className="quick-link-item">
                            <div className="quick-link-image-wrapper">
                                <img src={link.image} alt="" className="quick-link-image" />
                            </div>
                            <div className="quick-link-content">
                                <span className="quick-link-label">
                                    {link.label}
                                    <span className="quick-link-arrow">→</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
}
