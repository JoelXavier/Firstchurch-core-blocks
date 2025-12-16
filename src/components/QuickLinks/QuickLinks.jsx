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
        <section className="fc-quick-links">
            <div className="fc-quick-links__inner">
                
                {/* Header (Left) */}
                <div className="fc-quick-links__header">
                    <h2 className="fc-quick-links__title">{title}</h2>
                    <div className="fc-quick-links__underline"></div>
                </div>

                {/* List (Right) */}
                <div className="fc-quick-links__list">
                    {links.map((link) => (
                        <a key={link.id} href={link.url} className="fc-quick-link-item">
                            <div className="fc-quick-link-item__image-wrapper">
                                <img src={link.image} alt="" className="fc-quick-link-item__image" />
                            </div>
                            <div className="fc-quick-link-item__content">
                                <span className="fc-quick-link-item__label">
                                    {link.label}
                                    <span className="fc-quick-link-item__arrow">→</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
}
