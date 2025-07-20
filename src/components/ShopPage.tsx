import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard.tsx';
import { SearchIcon, FilterIcon, CloseIcon } from './Icons.tsx';
import { useDrop } from '../DropContext.tsx';
import { useProducts } from '../ProductContext.tsx';

/**
 * The ShopPage component displays a grid of all available products.
 * It includes powerful filtering and searching capabilities and enhanced error handling.
 * All styles are now theme-aware.
 */
const ShopPage: React.FC = () => {
  const { isDropLive } = useDrop();
  const { products, isLoading, error, refetch } = useProducts();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Available');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    return (products || []).filter(p => !p.isUpcoming || isDropLive);
  }, [isDropLive, products]);
  
  const categories = useMemo(() => [...Array.from(new Set(visibleProducts.map(p => p.category)))].sort(), [visibleProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && categories.includes(category)) {
        setSelectedCategories([category]);
    }
  }, [location.search, categories]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);
  
  const statusFilters = ['All', 'Available', 'Sold Out'];
  const brands = useMemo(() => [...Array.from(new Set(visibleProducts.map(p => p.brand)))].sort(), [visibleProducts]);
  const sizes = useMemo(() => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].filter(size => visibleProducts.some(p => p.size === size)), [visibleProducts]);
  const conditions = useMemo(() => [...Array.from(new Set(visibleProducts.map(p => p.condition)))].sort(), [visibleProducts]);
  const priceRanges = {
      'All': [0, Infinity],
      'Under ₹1000': [0, 999],
      '₹1000 - ₹1500': [1000, 1500],
      'Over ₹1500': [1501, Infinity],
  };

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
      setter(prev => 
          prev.includes(value) 
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter !== 'Available') count++;
    if (priceFilter !== 'All') count++;
    count += selectedBrands.length;
    count += selectedSizes.length;
    count += selectedConditions.length;
    count += selectedCategories.length;
    return count;
  }, [searchQuery, statusFilter, priceFilter, selectedBrands, selectedSizes, selectedConditions, selectedCategories]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('Available');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSelectedCategories([]);
    setPriceFilter('All');
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const priceRange = priceRanges[priceFilter as keyof typeof priceRanges];

    return visibleProducts.filter(product => {
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Available' && !product.sold) || (statusFilter === 'Sold Out' && product.sold);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size);
      const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesBrand && matchesSize && matchesCondition && matchesCategory && matchesPrice && matchesSearch;
    });
  }, [searchQuery, statusFilter, selectedBrands, selectedSizes, selectedConditions, selectedCategories, priceFilter, visibleProducts, products]);

  const CheckboxFilterGroup: React.FC<{title: string, options: string[], selected: string[], onChange: (value: string) => void}> = ({ title, options, selected, onChange }) => (
    <div className="py-4 border-b border-[var(--color-border)]">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              className="custom-checkbox"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const FilterSidebarContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif">Filters</h2>
        <button onClick={clearAllFilters} className="text-sm text-[var(--color-primary)] hover:underline">Clear All</button>
      </div>
      <div className="relative">
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition bg-[var(--color-surface)]" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon className="w-5 h-5 text-[var(--color-text-muted)]" /></div>
      </div>
      <div className="border-b border-[var(--color-border)] py-4">
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(filter => (<button key={filter} onClick={() => setStatusFilter(filter)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${statusFilter === filter ? 'bg-[var(--color-text-primary)] text-[var(--color-background)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)]'}`}>{filter}</button>))}
        </div>
      </div>
      <CheckboxFilterGroup title="Category" options={categories} selected={selectedCategories} onChange={(val) => handleCheckboxChange(setSelectedCategories, val)} />
      <CheckboxFilterGroup title="Brand" options={brands} selected={selectedBrands} onChange={(val) => handleCheckboxChange(setSelectedBrands, val)} />
      <CheckboxFilterGroup title="Size" options={sizes} selected={selectedSizes} onChange={(val) => handleCheckboxChange(setSelectedSizes, val)} />
      <CheckboxFilterGroup title="Condition" options={conditions} selected={selectedConditions} onChange={(val) => handleCheckboxChange(setSelectedConditions, val)} />
      <div>
        <h3 className="font-semibold mb-2">Price</h3>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="w-full p-2 border border-[var(--color-border)] rounded-lg focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition bg-[var(--color-surface)]">
            {Object.keys(priceRanges).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );

  const ProductGridSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-[var(--color-surface)] rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="product-card-image-container bg-[var(--color-surface-alt)]"></div>
          <div className="p-6 text-center">
            <div className="h-4 bg-[var(--color-surface-alt)] rounded w-1/2 mx-auto mb-3"></div>
            <div className="h-6 bg-[var(--color-surface-alt)] rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-4 bg-[var(--color-surface-alt)] rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-7 bg-[var(--color-surface-alt)] rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-11 bg-[var(--color-border)] rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in">
        <div className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-bold">All Finds</h1>
                <p className="text-lg text-[var(--color-text-secondary)] mt-2">Our curated collection of vintage and pre-loved treasures.</p>
            </div>
            <div className="lg:hidden mb-6">
                <button onClick={() => setIsFilterOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm text-[var(--color-text-primary)] font-semibold">
                    <FilterIcon className="w-5 h-5" />
                    Filters
                    {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
              <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 h-fit bg-[var(--color-surface-alt)]/70 p-6 rounded-lg border border-[var(--color-border)]">
                <FilterSidebarContent />
              </aside>

              {isFilterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setIsFilterOpen(false)}>
                  <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-[var(--color-surface)] shadow-xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setIsFilterOpen(false)} className="absolute top-4 right-4 p-2">
                        <CloseIcon className="w-6 h-6 text-[var(--color-text-secondary)]" />
                    </button>
                    <FilterSidebarContent />
                  </div>
                </div>
              )}

              <main className="lg:col-span-3">
                {isLoading ? (
                  <ProductGridSkeleton />
                ) : error ? (
                   <div className="text-center py-16 flex flex-col items-center justify-center h-full bg-[var(--color-surface)] rounded-lg border border-[var(--color-danger)]/30 p-6">
                      <h2 className="text-2xl font-serif text-[var(--color-danger)]">Failed to Load Products</h2>
                      <p className="text-[var(--color-text-secondary)] mt-2 mb-6 max-w-md">{error}</p>
                      <button onClick={refetch} className="btn btn-secondary">
                        Try Again
                      </button>
                   </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-16 flex flex-col items-center justify-center h-full bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
                        <h2 className="text-2xl font-serif text-[var(--color-text-secondary)]">No Treasures Found</h2>
                        <p className="text-[var(--color-text-secondary)] mt-2 max-w-xs">Try adjusting your search or filters to find your next favorite piece.</p>
                        <button onClick={clearAllFilters} className="btn btn-secondary mt-6">Clear All Filters</button>
                    </div>
                )}
              </main>
            </div>
        </div>
    </div>
  );
};

export default ShopPage;
