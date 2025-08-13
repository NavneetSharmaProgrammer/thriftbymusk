import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection.tsx';
import { useProducts } from '../../ProductContext.tsx';
import { formatGoogleDriveLink } from '../../utils.ts';

const CategoryCard: React.FC<{title: string, description: string, imageUrl: string, linkTo: string, isLoading?: boolean}> = ({ title, description, imageUrl, linkTo, isLoading }) => (
    <Link to={linkTo} className="group block relative rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden category-card-hover">
        <div className={`relative w-full pt-[125%] bg-[var(--color-surface-alt)] ${isLoading ? 'is-loading' : ''}`}>
           {!isLoading && <img src={imageUrl} alt={`A collection of stylish ${title.toLowerCase()}`} className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 bg-image" loading="lazy" /> }
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end text-white p-6">
            <div className="content-overlay">
                <h3 className="font-serif font-bold">{title}</h3>
                <p className="text-sm mt-1 opacity-90">{description}</p>
                <span className="mt-4 inline-block border-2 border-white px-6 py-2 rounded-full font-semibold text-sm group-hover:bg-white group-hover:text-black transition-all duration-300">Shop this Category</span>
            </div>
        </div>
    </Link>
);

const FeaturedFindsSection: React.FC = () => {
    const { products, isLoading } = useProducts();

    const { topImage, shirtImage } = useMemo(() => {
        const now = new Date();
        const availableProducts = products.filter(p => 
            !p.sold && 
            (!p.dropDate || new Date(p.dropDate) <= now)
        );
        const topProduct = availableProducts.find(p => p.category === 'Tops');
        const shirtProduct = availableProducts.find(p => p.category === 'Shirts');

        return {
          topImage: topProduct ? formatGoogleDriveLink(topProduct.imageUrls[0], 'image', { width: 500 }) : 'https://picsum.photos/seed/tops-category/500/625',
          shirtImage: shirtProduct ? formatGoogleDriveLink(shirtProduct.imageUrls[0], 'image', { width: 500 }) : 'https://picsum.photos/seed/shirts-category/500/625'
        };
    }, [products]);

    return (
        <section id="featured" className="py-16 md:py-0">
            <div className="container mx-auto px-6">
                <AnimatedSection as="div" className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold">Featured Finds</h2>
                    <p className="text-[var(--color-text-secondary)] mt-2">A preview of what’s waiting for you:</p>
                </AnimatedSection>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <AnimatedSection as="div" style={{transitionDelay: '150ms'}}>
                        <CategoryCard 
                            title="Tops" 
                            description="Effortless silhouettes that transition from day to night."
                            imageUrl={topImage} 
                            linkTo="/shop?category=Tops" 
                            isLoading={isLoading} 
                        />
                    </AnimatedSection>
                    <AnimatedSection as="div" style={{transitionDelay: '300ms'}}>
                        <CategoryCard 
                            title="Shirts"
                            description="Classic tailoring with a touch of modern flair."
                            imageUrl={shirtImage} 
                            linkTo="/shop?category=Shirts" 
                            isLoading={isLoading} 
                        />
                    </AnimatedSection>
                </div>
                <AnimatedSection as="div" className="text-center mt-12" style={{transitionDelay: '450ms'}}>
                    <Link to="/shop" className="btn btn-secondary">View All Treasures</Link>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default FeaturedFindsSection;