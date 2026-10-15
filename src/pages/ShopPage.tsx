import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { KurtiSize, ProductCollection } from '../types';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [selectedSizeFilter, setSelectedSizeFilter] = useState<KurtiSize | 'all'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Collections list
  const collections: { id: string; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'Everyday Elegance', label: 'Everyday Elegance' },
    { id: 'Festive Edit', label: 'Festive Edit' },
    { id: 'Office & College Wear', label: 'Office & College Wear' },
  ];

  const categories = ['all', 'Kurti Set', 'Straight Kurti', 'Anarkali Kurti', 'Co-ord Set'];
  const sizes: KurtiSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Collection filter
        if (selectedCollectionFilter !== 'all' && p.collection !== selectedCollectionFilter) {
          return false;
        }
        // Category filter
        if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
          return false;
        }
        // Size filter
        if (selectedSizeFilter !== 'all' && !p.sizes.includes(selectedSizeFilter)) {
          return false;
        }
        // Price filter
        if (p.price > maxPrice) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFabric = p.fabric.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchFabric && !matchCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0; // featured default
      });
  }, [
    products,
    selectedCollectionFilter,
    selectedCategoryFilter,
    selectedSizeFilter,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedCollectionFilter !== 'all' ||
    selectedCategoryFilter !== 'all' ||
    selectedSizeFilter !== 'all' ||
    maxPrice < 5000 ||
    searchQuery !== '';

  const clearAllFilters = () => {
    setSelectedCollectionFilter('all');
    setSelectedCategoryFilter('all');
    setSelectedSizeFilter('all');
    setMaxPrice(5000);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#651F32] font-semibold">
          Curated Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#292522]">
          {selectedCollectionFilter === 'all' ? 'All Kurtis & Sets' : selectedCollectionFilter}
        </h1>
        <p className="text-xs sm:text-sm text-[#292522]/80 font-normal">
          Handpicked silhouette cuts, authentic hand-block prints, and breathable fabrics tailored for effortless grace.
        </p>
      </div>

      {/* Filter Chips Bar (Collections Tabs) adhering to Interactive Filter Controls rule */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap p-1 bg-[#F2ECE1]/60 rounded-xs max-w-2xl mx-auto border border-[#E8DED2]">
        {collections.map((col) => {
          const isActive = selectedCollectionFilter === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setSelectedCollectionFilter(col.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                isActive
                  ? 'bg-[#5B1E22] text-[#FAF7F2] shadow-xs'
                  : 'text-[#292522]/80 hover:text-[#5B1E22] hover:bg-white/60'
              }`}
            >
              {col.label}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Results Count, Mobile Filter Drawer Toggle, Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-[#E8DED2]">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9E897A] font-medium">
            Showing <strong className="text-[#292522]">{filteredProducts.length}</strong> styles
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#5B1E22] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3.5 py-1.5 border border-[#E8DED2] bg-white text-xs font-medium flex items-center gap-1.5 text-[#292522]"
          >
            <Filter className="w-3.5 h-3.5 text-[#5B1E22]" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#9E897A] hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E8DED2] px-3 py-1.5 text-xs text-[#292522] outline-none font-medium"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Desktop Sidebar Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside
          className={`lg:col-span-1 space-y-6 bg-white p-5 border border-[#E8DED2] ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DED2]">
            <h3 className="font-serif text-base font-bold text-[#292522] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#5B1E22]" />
              <span>Filter Kurtis</span>
            </h3>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-[11px] text-[#5B1E22] hover:underline">
                Clear All
              </button>
            )}
          </div>

          {/* Size Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-[#292522] uppercase tracking-wider block">
              Kurti Size (S to XXL)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSizeFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium border ${
                  selectedSizeFilter === 'all'
                    ? 'border-[#5B1E22] bg-[#5B1E22] text-white'
                    : 'border-[#E8DED2] text-[#292522] hover:border-[#5B1E22]'
                }`}
              >
                All
              </button>
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSizeFilter(sz)}
                  className={`w-9 h-8 text-xs font-bold border transition-colors ${
                    selectedSizeFilter === sz
                      ? 'border-[#5B1E22] bg-[#5B1E22] text-white'
                      : 'border-[#E8DED2] text-[#292522] hover:border-[#5B1E22]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5 pt-3 border-t border-[#E8DED2]">
            <label className="text-xs font-semibold text-[#292522] uppercase tracking-wider block">
              Garment Style
            </label>
            <div className="space-y-1.5 text-xs">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer text-[#292522]/90">
                  <input
                    type="radio"
                    name="catFilter"
                    checked={selectedCategoryFilter === cat}
                    onChange={() => setSelectedCategoryFilter(cat)}
                    className="accent-[#5B1E22]"
                  />
                  <span>{cat === 'all' ? 'All Styles' : cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5 pt-3 border-t border-[#E8DED2]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#292522] uppercase tracking-wider">Max Price</span>
              <span className="font-mono font-bold text-[#5B1E22] tabular-nums">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#5B1E22]"
            />
            <div className="flex justify-between text-[10px] text-[#9E897A] font-mono">
              <span>₹1</span>
              <span>₹5,000</span>
            </div>

          </div>
        </aside>

        {/* Product Cards Grid (3 Columns on Desktop) */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E8DED2] p-12 text-center space-y-3">
              <p className="font-serif text-xl font-bold text-[#292522]">No kurtis matched your filters</p>
              <p className="text-xs text-[#9E897A]">
                Try resetting your filters or adjusting your size and price criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#5B1E22] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#421417]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
