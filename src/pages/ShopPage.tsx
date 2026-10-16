import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { KurtiSize, ProductCollection } from '../types';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    wishlist,
  } = useStore();

  const [selectedSizeFilter, setSelectedSizeFilter] = useState<KurtiSize | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Collections list
  const collections: { id: string; label: string; isWishlist?: boolean; isBestseller?: boolean }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'bestseller', label: '🔥 Bestseller', isBestseller: true },
    { id: 'Everyday Wear', label: 'Everyday Wear' },
    { id: 'Festive & Wedding Edits', label: 'Festive & Wedding Edits' },
    { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, isWishlist: true },
  ];

  // Dynamic Sub-tabs according to the active collection
  const subTabs = useMemo(() => {
    if (selectedCollectionFilter === 'Everyday Wear') {
      return [
        { id: 'all', label: 'All Everyday Wear' },
        { id: 'Kurti Set', label: 'Kurti Set' },
        { id: 'Bottom Wear', label: 'Bottom Wear' },
        { id: 'Coord Set', label: 'Coord Set' },
      ];
    }
    if (selectedCollectionFilter === 'Festive & Wedding Edits') {
      return [
        { id: 'all', label: 'All Festive & Wedding' },
        { id: 'Suit Sets', label: 'Suit Sets' },
        { id: 'Kurta Sets', label: 'Kurta Sets' },
        { id: 'Coord Sets', label: 'Coord Sets' },
        { id: 'Sharara Sets', label: 'Sharara Sets' },
      ];
    }
    if (selectedCollectionFilter === 'bestseller') {
      return [
        { id: 'all', label: 'All Bestsellers' },
        { id: 'Kurti Set', label: 'Kurti Sets' },
        { id: 'Bottom Wear', label: 'Bottom Wear' },
        { id: 'Suit Sets', label: 'Suit Sets' },
        { id: 'Kurta Sets', label: 'Kurta Sets' },
        { id: 'Coord Sets', label: 'Coord Sets' },
        { id: 'Sharara Sets', label: 'Sharara Sets' },
      ];
    }
    return [];
  }, [selectedCollectionFilter]);

  // Categories list for sidebar
  const categories = useMemo(() => {
    if (selectedCollectionFilter === 'Everyday Wear') {
      return ['all', 'Kurti Set', 'Bottom Wear', 'Coord Set'];
    }
    if (selectedCollectionFilter === 'Festive & Wedding Edits') {
      return ['all', 'Suit Sets', 'Kurta Sets', 'Coord Sets', 'Sharara Sets'];
    }
    return [
      'all',
      'Kurti Set',
      'Bottom Wear',
      'Coord Set',
      'Suit Sets',
      'Kurta Sets',
      'Coord Sets',
      'Sharara Sets',
    ];
  }, [selectedCollectionFilter]);

  const sizes: KurtiSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Wishlist / Collection filter
        if (selectedCollectionFilter === 'wishlist') {
          if (!wishlist.includes(p.id)) return false;
        } else if (selectedCollectionFilter === 'bestseller') {
          if (!p.isBestseller) return false;
        } else if (selectedCollectionFilter !== 'all') {
          if (
            p.collection !== selectedCollectionFilter &&
            !(selectedCollectionFilter === 'Everyday Wear' && (p.collection as string) === 'Everyday Elegance') &&
            !(selectedCollectionFilter === 'Festive & Wedding Edits' && (p.collection as string) === 'Festive Edit')
          ) {
            return false;
          }
        }

        // Category filter
        if (selectedCategoryFilter !== 'all') {
          if (p.category !== selectedCategoryFilter) {
            // Match singular vs plural coords if applicable
            const isCoordMatch =
              (selectedCategoryFilter === 'Coord Set' || selectedCategoryFilter === 'Coord Sets') &&
              (p.category === 'Coord Set' || p.category === 'Coord Sets' || (p.category as string) === 'Co-ord Set');
            if (!isCoordMatch) {
              return false;
            }
          }
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

  const handleCollectionSelect = (colId: string) => {
    setSelectedCollectionFilter(colId);
    setSelectedCategoryFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 px-1">
        <span className="text-[10.5px] sm:text-xs uppercase tracking-[0.25em] text-[#8C5A7D] font-semibold">
          Curated Catalog
        </span>
        <h1 className="font-serif text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-normal text-[#554052]">
          {selectedCollectionFilter === 'wishlist'
            ? 'My Saved Wishlist'
            : selectedCollectionFilter === 'bestseller'
            ? 'Bestsellers & Top Picks'
            : selectedCollectionFilter === 'all'
            ? 'All Kurtas & Ensembles'
            : selectedCollectionFilter}
        </h1>
        <p className="text-xs sm:text-sm text-[#554052]/80 font-normal">
          {selectedCollectionFilter === 'wishlist'
            ? 'Your shortlisted silhouettes and ensembles saved to revisit, customize, and add to your bag.'
            : selectedCollectionFilter === 'bestseller'
            ? 'Our most-loved silhouettes, top-rated sets, and crowd-favourite artisanal handcrafts.'
            : selectedCollectionFilter === 'Everyday Wear'
            ? 'Breathable cotton kurti sets, tailored bottom wear, and relaxed everyday coord sets designed for daily grace.'
            : selectedCollectionFilter === 'Festive & Wedding Edits'
            ? 'Grand suit sets, silk kurta sets, luxury festive coords, and tiered sharara sets crafted for celebratory moments.'
            : 'Handpicked silhouette cuts, authentic hand-block prints, and breathable fabrics tailored for effortless grace.'}
        </p>
      </div>

      {/* Primary Collections Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap p-1 sm:p-1.5 bg-[#F3E9EB] rounded-xs max-w-3xl mx-auto border border-[#D5C2D7]">
          {collections.map((col) => {
            const isActive = selectedCollectionFilter === col.id;
            return (
              <button
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10.5px] sm:text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8C5A7D] text-[#FAF7F2] shadow-xs'
                    : 'text-[#554052]/80 hover:text-[#8C5A7D] hover:bg-white/60'
                }`}
              >
                {col.isWishlist && (
                  <Heart className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : 'text-[#8C5A7D]'}`} />
                )}
                <span>{col.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Secondary Sub-tabs Bar */}
        {subTabs.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl mx-auto pt-1 animate-in fade-in duration-200">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C5A7D] mr-1 hidden sm:inline">
              Category:
            </span>
            {subTabs.map((sub) => {
              const isSubActive = selectedCategoryFilter === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedCategoryFilter(sub.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-[#8C5A7D] text-white border-[#8C5A7D] shadow-xs'
                      : 'bg-white/90 text-[#554052] border-[#D5C2D7] hover:border-[#8C5A7D] hover:text-[#8C5A7D]'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Controls Bar: Results Count, Mobile Filter Drawer Toggle, Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-[#D5C2D7]">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A185A4] font-medium">
            Showing <strong className="text-[#554052]">{filteredProducts.length}</strong> styles
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#8C5A7D] hover:underline flex items-center gap-1 cursor-pointer"
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
            className="lg:hidden px-3.5 py-1.5 border border-[#D5C2D7] bg-white text-xs font-medium flex items-center gap-1.5 text-[#554052] cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#8C5A7D]" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#A185A4] hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#D5C2D7] px-3 py-1.5 text-xs text-[#554052] outline-none font-medium cursor-pointer"
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
          className={`lg:col-span-1 space-y-6 bg-white p-5 border border-[#D5C2D7] ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#D5C2D7]">
            <h3 className="font-serif text-base font-bold text-[#554052] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8C5A7D]" />
              <span>Filter Kurtas</span>
            </h3>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-[11px] text-[#8C5A7D] hover:underline cursor-pointer">
                Clear All
              </button>
            )}
          </div>

          {/* Size Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-[#554052] uppercase tracking-wider block">
              Kurta Size (S to XXL)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSizeFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium border cursor-pointer ${
                  selectedSizeFilter === 'all'
                    ? 'border-[#8C5A7D] bg-[#8C5A7D] text-white'
                    : 'border-[#D5C2D7] text-[#554052] hover:border-[#8C5A7D]'
                }`}
              >
                All
              </button>
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSizeFilter(sz)}
                  className={`w-9 h-8 text-xs font-bold border transition-colors cursor-pointer ${
                    selectedSizeFilter === sz
                      ? 'border-[#8C5A7D] bg-[#8C5A7D] text-white'
                      : 'border-[#D5C2D7] text-[#554052] hover:border-[#8C5A7D]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5 pt-3 border-t border-[#D5C2D7]">
            <label className="text-xs font-semibold text-[#554052] uppercase tracking-wider block">
              Garment Style
            </label>
            <div className="space-y-1.5 text-xs">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer text-[#554052]/90">
                  <input
                    type="radio"
                    name="catFilter"
                    checked={selectedCategoryFilter === cat}
                    onChange={() => setSelectedCategoryFilter(cat)}
                    className="accent-[#8C5A7D]"
                  />
                  <span>{cat === 'all' ? 'All Styles' : cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5 pt-3 border-t border-[#D5C2D7]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#554052] uppercase tracking-wider">Max Price</span>
              <span className="font-mono font-bold text-[#8C5A7D] tabular-nums">
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
              className="w-full accent-[#8C5A7D]"
            />
            <div className="flex justify-between text-[10px] text-[#A185A4] font-mono">
              <span>₹1</span>
              <span>₹5,000</span>
            </div>
          </div>
        </aside>

        {/* Product Cards Grid (3 Columns on Desktop) */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            selectedCollectionFilter === 'wishlist' ? (
              <div className="bg-[#F3E9EB] border border-[#D5C2D7] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F3E9EB] border border-[#D5C2D7] flex items-center justify-center mx-auto text-[#8C5A7D]">
                  <Heart className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-[#554052]">Your Wishlist is Empty</p>
                  <p className="text-xs text-[#A185A4] mt-1.5 max-w-md mx-auto">
                    You haven't saved any styles yet. Click the heart icon on any product in our collections to curate your personal wardrobe shortlist!
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCollectionFilter('all')}
                  className="px-6 py-2.5 bg-[#8C5A7D] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#554052] transition-colors cursor-pointer"
                >
                  Explore All Styles
                </button>
              </div>
            ) : (
              <div className="bg-[#F3E9EB] border border-[#D5C2D7] p-12 text-center space-y-3">
                <p className="font-serif text-xl font-bold text-[#554052]">No products matched your filters</p>
                <p className="text-xs text-[#A185A4]">
                  Try resetting your filters or adjusting your size and price criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#8C5A7D] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#554052] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
