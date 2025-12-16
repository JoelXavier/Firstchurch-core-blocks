import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Listing.scss';
import { CardItem as Card } from '../Card/Card';
import '../Card/Card.scss';

export const Listing = ({ 
    items = [], 
    categories = [], 
    filterStyle = 'sidebar', 
    columns = 3,
    title = "Content Listings",
    subtitle = "From testimonials, to success stories"
}) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Toggle logic
    const toggleCategory = (catId) => {
        setSelectedCategories(prev => {
            if (prev.includes(catId)) {
                return prev.filter(id => id !== catId);
            } else {
                return [...prev, catId];
            }
        });
    };

    // Filter logic
    const filteredItems = useMemo(() => {
        if (selectedCategories.length === 0) return items;
        return items.filter(item => {
            return item.categoryIds && item.categoryIds.some(id => selectedCategories.includes(id));
        });
    }, [items, selectedCategories]);

    // Render Filters
    const renderFilters = () => {
        return (
            <div className={`fc-listing__filters fc-listing__filters--${filterStyle}`}>
                {categories.map(cat => {
                    const isActive = selectedCategories.includes(cat.id);
                    return (
                        <button
                            key={cat.id}
                            className={`fc-filter-btn ${isActive ? 'is-active' : ''}`}
                            onClick={() => toggleCategory(cat.id)}
                        >
                            <span className="fc-filter-label">{cat.name}</span>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={`fc-listing layout-${filterStyle}`}>
            
            {/* Header Section */}
            <div className="fc-listing__header">
                {title && <h2 className="fc-listing__title">{title}</h2>}
                {subtitle && <p className="fc-listing__subtitle">{subtitle}</p>}
                <div className="fc-listing__decoration"></div>
            </div>

            <div className="fc-listing__body">
                {/* Sidebar */}
                {filterStyle === 'sidebar' && (
                    <div className="fc-listing__sidebar">
                        <div className="fc-listing__sidebar-sticky">
                             {renderFilters()}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="fc-listing__main">
                    {/* Top Bar for Pills Layout */}
                    {filterStyle === 'pills' && (
                        <div className="fc-listing__top-bar">
                            {renderFilters()}
                        </div>
                    )}

                    {/* Grid */}
                    <div 
                        className="fc-listing__grid"
                        style={{ '--columns': columns }}
                    >
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <div key={item.id} className="fc-card-item">
                                <Card 
                                    {...item} 
                                    label={item.category || item.label} 
                                />
                            </div>
                        ))
                    ) : (
                        <div className="fc-no-results">
                            <p>No items match your selected filters.</p>
                            <button className="fc-filter-btn" onClick={() => setSelectedCategories([])}>View All</button>
                        </div>
                    )}
                    </div>

                    {/* Pagination */}
                    <div className="fc-listing__pagination">
                        <button className="fc-pagination-btn is-active">1</button>
                        <button className="fc-pagination-btn">2</button>
                        <button className="fc-pagination-btn">3</button>
                        <span className="fc-pagination-ellipsis">...</span>
                        <button className="fc-pagination-btn">Next &gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Listing.propTypes = {
    items: PropTypes.array,
    categories: PropTypes.array,
    filterStyle: PropTypes.oneOf(['pills', 'sidebar']),
    columns: PropTypes.number,
    title: PropTypes.string,
    subtitle: PropTypes.string
};
