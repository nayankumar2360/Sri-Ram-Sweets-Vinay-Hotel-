import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, searchQuery, onSearchChange }) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="max-w-md mx-auto sm:mx-0">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-2 scrollbar-custom -mx-4 px-4 sm:mx-0 sm:px-0 space-x-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-text-secondary border border-border hover:border-primary hover:text-primary'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category._id
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary border border-border hover:border-primary hover:text-primary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
