import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection.tsx';
import { useProducts } from '../../ProductContext.tsx';
import { useDrop } from '../../DropContext.tsx';
import { formatGoogleDriveLink } from '../../utils.ts';

const CategoryCard: React.FC<{title: string, imageUrl: string, linkTo: string, isLoading?: boolean}> = ({ title, imageUrl, linkTo, isLoading }) => (
    <Link to={linkTo} className="group block relative rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className={`relative w-full pt-[125%] bg-[var(--color-surface-alt)] ${isLoading ? 'is-loading' : ''}`}>
           {!isLoading && <img src={imageUrl} alt={`A collection of stylish ${title.toLowerCase()}`} className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /> }
        </div>
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
            <h3 className="text-3xl font-serif font-bold">{title}</h3>
            <span className="mt-4 inline-block border-2 border-white px-6 py-2 rounded-full font-semibold text-sm group-hover:bg-white group-hover:text-black transition-colors duration-300">Shop this Category</span>
        </div>
    </Link>
);

const FeaturedFindsSection: React.FC = () => {
    const { products, isLoading } = useProducts();
    const { isDropLive } = useDrop();

    const { topImage, shirtImage } = useMemo(() => {
        const availableProducts = products.filter(p => !p.sold && (!p.isUpcoming || isDropLive));
        const topProduct = availableProducts.find(p => p.category === 'Tops');
        const shirtProduct = availableProducts.find(p => p.category === 'Shirts');

        return {
          topImage: topProduct ? formatGoogleDriveLink(topProduct.imageUrls[0], 'image', { width: 500 }) : 'https://picsum.photos/seed/tops-category/500/625',
          shirtImage: shirtProduct ? formatGoogleDriveLink(shirtProduct.imageUrls[0], 'image', { width: 500 }) : 'https://picsum.photos/seed/shirts-category/500/625'
        };
    }, [isDropLive, products]);

    return (
        <AnimatedSection id="featured" className="py-16 md:py-0">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold">Featured Finds</h2>
                    <p className="text-lg text-[var(--color-text-secondary)] mt-2">A sneak peek of our latest curated pieces.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <CategoryCard title="Tops" imageUrl={topImage} linkTo="/shop?category=Tops" isLoading={isLoading} />
                    <CategoryCard title="Shirts" imageUrl={shirtImage} linkTo="/shop?category=Shirts" isLoading={isLoading} />
                </div>
                <div className="text-center mt-12">
                    <Link to="/shop" className="btn btn-secondary">View All Treasures</Link>
                </div>
            </div>
        </AnimatedSection>
    );
};

export default FeaturedFindsSection;