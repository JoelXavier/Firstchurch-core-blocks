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
            return item.categoryIds.some(id => selectedCategories.includes(id));
        });
    }, [items, selectedCategories]);

    // Render Filters
    const renderFilters = () => {
        return (
            <div className={`listing-filters listing-filters--${filterStyle}`}>
                {categories.map(cat => {
                    const isActive = selectedCategories.includes(cat.id);
                    return (
                        <button
                            key={cat.id}
                            className={`filter-btn ${isActive ? 'is-active' : ''}`}
                            onClick={() => toggleCategory(cat.id)}
                        >
                            <span className="filter-label">{cat.name}</span>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={`antigravity-listing-component layout-${filterStyle}`}>
            
            {/* Header Section */}
            <div className="listing-header">
                {title && <h2 className="listing-title">{title}</h2>}
                {subtitle && <p className="listing-subtitle">{subtitle}</p>}
                <div className="listing-decoration"></div>
            </div>

            <div className="listing-body">
                {/* Sidebar */}
                {filterStyle === 'sidebar' && (
                        <div className="listing-sidebar-sticky">
                             {renderFilters()}
                        </div>
                )}

                {/* Main Content */}
                <div className="listing-main">
                    {/* Top Bar for Pills Layout */}
                    {filterStyle === 'pills' && (
                        <div className="listing-top-bar">
                            {renderFilters()}
                        </div>
                    )}

                    {/* Grid */}
                    <div 
                        className="listing-grid"
                        style={{ '--columns': columns }}
                    >
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <Card 
                                key={item.id} 
                                {...item} 
                                label={item.category || item.label} 
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No items match your selected filters.</p>
                            <button onClick={() => setSelectedCategories([])}>View All</button>
                        </div>
                    )}
                    </div>

                    {/* Pagination */}
                    <div className="listing-pagination">
                        <button className="pagination-btn is-active">1</button>
                        <button className="pagination-btn">2</button>
                        <button className="pagination-btn">3</button>
                        <span className="pagination-ellipsis">...</span>
                        <button className="pagination-btn">Next &gt;</button>
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
