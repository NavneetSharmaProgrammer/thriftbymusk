import React from 'react';
import { Link } from 'react-router-dom';
import { useSaved } from '../SavedContext.tsx';
import ProductCard from './ProductCard.tsx';
import { HeartIcon } from './Icons.tsx';

const SavedItemsPage: React.FC = () => {
  const { savedItems } = useSaved();

  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Your Saved Items</h1>
          <p className="text-lg text-[var(--color-text-secondary)] mt-2">
            The treasures you've bookmarked. Don't let them get away!
          </p>
        </div>

        {savedItems.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {savedItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center justify-center h-full bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
            <HeartIcon className="w-16 h-16 text-[var(--color-text-muted)] opacity-50 mb-4" />
            <h2 className="text-2xl font-serif text-[var(--color-text-secondary)]">
              Nothing Saved Yet
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-2 max-w-xs">
              Click the heart icon on any product to save it here for later.
            </p>
            <Link to="/shop" className="btn btn-primary mt-8">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItemsPage;