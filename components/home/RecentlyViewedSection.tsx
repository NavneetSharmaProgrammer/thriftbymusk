import React from 'react';
import { useRecentlyViewed } from '../../RecentlyViewedContext';
import ProductCard from '../ProductCard';
import AnimatedSection from '../AnimatedSection';
import { Link } from 'react-router-dom';

const RecentlyViewedSection: React.FC = () => {
    const { recentlyViewedProducts } = useRecentlyViewed();

    if (recentlyViewedProducts.length === 0) {
        return null;
    }

    return (
        <section id="recently-viewed" className="py-16">
            <div className="container mx-auto px-6">
                <AnimatedSection as="div" className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold">Your Recent Finds</h2>
                    <p className="text-[var(--color-text-secondary)] mt-2">Just in case you wanted another look.</p>
                </AnimatedSection>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {recentlyViewedProducts.map((product, index) => (
                        <AnimatedSection key={product.id} as="div" style={{ transitionDelay: `${index * 100}ms` }}>
                            <ProductCard product={product} />
                        </AnimatedSection>
                    ))}
                </div>
                 <AnimatedSection as="div" className="text-center mt-12">
                    <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default RecentlyViewedSection;
