import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard.tsx';
import { 
    SearchIcon, FilterIcon, CloseIcon, ChevronDownIcon, TagIcon, SparklesIcon,
    RulerIcon, ShieldCheckIcon, PriceTagIcon, ArrowsUpDownIcon, CheckCircleIcon
} from './Icons.tsx';
import { useProducts } from '../ProductContext.tsx';
import { Product } from '../types.ts';
import useDebounce from '../hooks/useDebounce.tsx';

const ITEMS_PER_PAGE = 12;

/**
 * The ShopPage component displays a grid of all available products.
 * It includes powerful filtering and searching capabilities and enhanced error handling.
 * All styles are now theme-aware.
 */
const ShopPage: React.FC = () => {
  const { products, isLoading, error, refetch } = useProducts();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay for search
  
  const [statusFilter, setStatusFilter] = useState('Available');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [maxPossiblePrice, setMaxPossiblePrice] = useState(5000);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Featured');
  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_PER_PAGE);

  const liveProducts = useMemo(() => {
    const now = new Date();
    return (products || []).filter(p => !p.dropDate || new Date(p.dropDate) <= now);
  }, [products]);

  useEffect(() => {
    if (liveProducts.length > 0) {
      const maxPrice = Math.max(...liveProducts.map(p => p.price));
      setMaxPossiblePrice(maxPrice);
      setPriceRange([0, maxPrice]);
    }
  }, [liveProducts]);

  const categories = useMemo(() => [...Array.from(new Set(liveProducts.map(p => p.category)))].sort(), [liveProducts]);

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
  
  const brands = useMemo(() => [...Array.from(new Set(liveProducts.map(p => p.brand)))].sort(), [liveProducts]);
  const sizes = useMemo(() => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].filter(size => liveProducts.some(p => p.size === size)), [liveProducts]);
  const conditions = useMemo(() => [...Array.from(new Set(liveProducts.map(p => p.condition)))].sort(), [liveProducts]);

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
      setter(prev => 
          prev.includes(value) 
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
  };
  
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('Available');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSelectedCategories([]);
    setPriceRange([0, maxPossiblePrice]);
    setSortOption('Featured');
  }, [maxPossiblePrice]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter !== 'Available') count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPossiblePrice) count++;
    count += selectedBrands.length;
    count += selectedSizes.length;
    count += selectedConditions.length;
    count += selectedCategories.length;
    return count;
  }, [searchQuery, statusFilter, priceRange, selectedBrands, selectedSizes, selectedConditions, selectedCategories, maxPossiblePrice]);


  const filteredProducts = useMemo(() => {
    const lowercasedSearch = debouncedSearchQuery.toLowerCase().trim();
    return liveProducts.filter(product => {
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Available' && !product.sold) || (statusFilter === 'Sold Out' && product.sold);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size);
      const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = !lowercasedSearch ||
                             product.name.toLowerCase().includes(lowercasedSearch) ||
                             product.brand.toLowerCase().includes(lowercasedSearch) ||
                             product.category.toLowerCase().includes(lowercasedSearch) ||
                             product.description.toLowerCase().includes(lowercasedSearch);

      return matchesStatus && matchesBrand && matchesSize && matchesCondition && matchesCategory && matchesPrice && matchesSearch;
    });
  }, [debouncedSearchQuery, statusFilter, selectedBrands, selectedSizes, selectedConditions, selectedCategories, priceRange, liveProducts]);

  useEffect(() => {
    setVisibleItemsCount(ITEMS_PER_PAGE);
  }, [filteredProducts]);

  const { freshDropProducts, otherProducts } = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const fresh: Product[] = [];
    const others: Product[] = [];

    for (const product of filteredProducts) {
        const dropDate = product.dropDate ? new Date(product.dropDate) : new Date(product.createdAt);
        if (dropDate >= sevenDaysAgo) {
            fresh.push(product);
        } else {
            others.push(product);
        }
    }
    
    fresh.sort((a, b) => {
        const dateA = a.dropDate ? new Date(a.dropDate) : new Date(a.createdAt);
        const dateB = b.dropDate ? new Date(b.dropDate) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });

    return { freshDropProducts: fresh, otherProducts: others };
  }, [filteredProducts]);

  const sortedOtherProducts = useMemo(() => {
    const sorted = [...otherProducts];
    switch (sortOption) {
        case 'Newest':
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case 'Price: Low to High':
            return sorted.sort((a, b) => a.price - b.price);
        case 'Price: High to Low':
            return sorted.sort((a, b) => b.price - a.price);
        case 'Name: A-Z':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'Featured':
        default:
            return sorted;
    }
  }, [otherProducts, sortOption]);
  
  const paginatedOtherProducts = useMemo(() => {
      return sortedOtherProducts.slice(0, visibleItemsCount);
  }, [sortedOtherProducts, visibleItemsCount]);

  const FilterSidebarContent = () => {
    const [openSections, setOpenSections] = useState<string[]>(['Category', 'Brand', 'Price']);

    const toggleSection = (section: string) => {
        setOpenSections(prev => 
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };
    
    const PriceSlider = () => {
        const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(Number(e.target.value), priceRange[1] - 1);
            setPriceRange([value, priceRange[1]]);
        };
        const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(Number(e.target.value), priceRange[0] + 1);
            setPriceRange([priceRange[0], value]);
        };

        const minPos = (priceRange[0] / maxPossiblePrice) * 100;
        const maxPos = (priceRange[1] / maxPossiblePrice) * 100;

        return (
            <div className="pt-4 px-2">
                 <div className="flex justify-between items-center text-sm mb-4">
                    <span className="font-medium text-[var(--color-text-secondary)]">₹{priceRange[0]}</span>
                    <span className="font-medium text-[var(--color-text-secondary)]">₹{priceRange[1]}</span>
                 </div>
                 <div className="price-slider-container">
                    <div className="price-slider-track-container">
                        <div className="price-slider-track-active" style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}></div>
                    </div>
                    <input type="range" min="0" max={maxPossiblePrice} value={priceRange[0]} onChange={handleMinChange} />
                    <input type="range" min="0" max={maxPossiblePrice} value={priceRange[1]} onChange={handleMaxChange} />
                 </div>
            </div>
        )
    };

    const AccordionItem: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => {
        const isOpen = openSections.includes(title);
        return (
            <div className="filter-accordion border-b border-[var(--color-border)]">
                <button
                    onClick={() => toggleSection(title)}
                    className="filter-accordion-header"
                    aria-expanded={isOpen}
                    aria-controls={`accordion-content-${title}`}
                >
                    <span className="flex items-center gap-3 font-semibold text-[var(--color-text-primary)]">
                        {icon}
                        {title}
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 text-[var(--color-text-secondary)] filter-accordion-icon transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  id={`accordion-content-${title}`}
                  className="filter-accordion-content overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? '1000px' : '0px' }}
                >
                  <div className="pt-2 pb-4 px-1">{children}</div>
                </div>
            </div>
        );
    };

    const CheckboxFilterGroup: React.FC<{options: string[], selected: string[], onChange: (value: string) => void}> = ({ options, selected, onChange }) => (
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
    );
    
    const statusFilters = ['All', 'Available', 'Sold Out'];

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2">
          <h2 className="text-xl font-bold font-serif">Filters</h2>
          {activeFilterCount > 0 && (
            <button onClick={clearAllFilters} className="text-sm text-[var(--color-primary)] hover:underline">Clear All</button>
          )}
        </div>
  
        <div className="relative p-2">
            <input type="text" placeholder="Search by name or brand..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition bg-[var(--color-surface)]" />
            <div className="absolute left-5 top-1/2 -translate-y-1/2"><SearchIcon className="w-5 h-5 text-[var(--color-text-muted)]" /></div>
        </div>
  
        <AccordionItem title="Sort By" icon={<ArrowsUpDownIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full custom-select">
                <option value="Featured">Featured</option>
                <option value="Newest">Newest</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Name: A-Z">Name: A-Z</option>
            </select>
        </AccordionItem>
        
        <AccordionItem title="Availability" icon={<CheckCircleIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}>
          <div className="segmented-control p-2">
              {statusFilters.map(filter => (
                  <button key={filter} onClick={() => setStatusFilter(filter)} className={`segmented-control-button ${statusFilter === filter ? 'active' : ''}`}>
                      {filter}
                  </button>
              ))}
          </div>
        </AccordionItem>

        <AccordionItem title="Price" icon={<PriceTagIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}>
          <PriceSlider />
        </AccordionItem>

        {categories.length > 0 && (
            <AccordionItem title="Category" icon={<TagIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}>
                <CheckboxFilterGroup options={categories} selected={selectedCategories} onChange={(val) => handleCheckboxChange(setSelectedCategories, val)} />
            </AccordionItem>
        )}
        {brands.length > 0 && (
            <AccordionItem title="Brand" icon={<SparklesIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}>
                <CheckboxFilterGroup options={brands} selected={selectedBrands} onChange={(val) => handleCheckboxChange(setSelectedBrands, val)} />
            </AccordionItem>
        )}
        {sizes.length > 0 && (
            <AccordionItem title="Size" icon={<RulerIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}>
                <CheckboxFilterGroup options={sizes} selected={selectedSizes} onChange={(val) => handleCheckboxChange(setSelectedSizes, val)} />
            </AccordionItem>
        )}
        {conditions.length > 0 && (
            <AccordionItem title="Condition" icon={<ShieldCheckIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}>
                <CheckboxFilterGroup options={conditions} selected={selectedConditions} onChange={(val) => handleCheckboxChange(setSelectedConditions, val)} />
            </AccordionItem>
        )}
      </div>
    );
  };

  const ProductGridSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-[var(--color-surface)] rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="product-card-image-container bg-[var(--color-surface-alt)]"></div>
          <div className="p-4 md:p-6 text-center">
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
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-bold">All Finds</h1>
                <p className="text-lg text-[var(--color-text-secondary)] mt-2">Our curated collection of vintage and pre-loved treasures.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
              <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 h-fit bg-[var(--color-surface)]/60 backdrop-blur-sm p-4 rounded-lg border border-[var(--color-border)]">
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
                 <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Showing {freshDropProducts.length + paginatedOtherProducts.length} of {liveProducts.length} products
                    </p>
                     <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm text-[var(--color-text-primary)] font-medium text-sm">
                        <FilterIcon className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>
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
                ) : (freshDropProducts.length > 0 || paginatedOtherProducts.length > 0) ? (
                    <>
                        {freshDropProducts.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-semibold font-serif my-4 text-center border-b border-t border-[var(--color-border)] py-3">— Fresh Drop —</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                                    {freshDropProducts.map(product => (
                                        <ProductCard key={product.id} product={product} isFreshDrop={true} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {paginatedOtherProducts.length > 0 && (
                          <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                                {paginatedOtherProducts.map(product => (
                                    <ProductCard key={product.id} product={product} isFreshDrop={false} />
                                ))}
                            </div>
                            {sortedOtherProducts.length > visibleItemsCount && (
                                <div className="text-center pt-4">
                                    <button onClick={() => setVisibleItemsCount(c => c + ITEMS_PER_PAGE)} className="btn btn-secondary">
                                        Load More Finds
                                    </button>
                                </div>
                            )}
                          </div>
                        )}
                    </>
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