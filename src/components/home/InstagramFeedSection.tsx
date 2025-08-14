import React from 'react';
import AnimatedSection from '../AnimatedSection';
import { GALLERY_ITEMS, INSTAGRAM_HANDLE } from '../../constants';
import { formatGoogleDriveLink } from '../../utils';
import { HeartIcon, InstagramIcon, ChatBubbleIcon } from '../Icons';

const InstagramPost: React.FC<{ item: typeof GALLERY_ITEMS[0], delay: number }> = ({ item, delay }) => {
    // Generate pseudo-random numbers for likes and comments based on ID for consistency
    const likes = (parseInt(item.id.replace(/\D/g,'')) % 150) + 50; // likes between 50 and 200
    const comments = (parseInt(item.id.replace(/\D/g,'')) % 20) + 5; // comments between 5 and 25

    return (
        <AnimatedSection 
            as="a"
            href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square w-full overflow-hidden rounded-lg shadow-md"
            style={{ transitionDelay: `${delay}ms` }}
            animationClass="animate-fadeInScale"
        >
            <img 
                src={formatGoogleDriveLink(item.url, 'image', { width: 400 })} 
                alt={item.caption || 'Thrift by Musk Instagram post'}
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                <div className="absolute inset-0 flex items-center justify-center gap-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                        <HeartIcon className="h-6 w-6" />
                        <span className="font-bold">{likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ChatBubbleIcon className="h-6 w-6" />
                        <span className="font-bold">{comments}</span>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};


const InstagramFeedSection: React.FC = () => {
    // We'll take the first 6 images from the gallery for the feed.
    const feedItems = GALLERY_ITEMS.slice(0, 6);

    return (
        <section id="instagram" className="py-16 bg-[var(--color-surface-alt)]">
            <div className="container mx-auto px-6">
                <AnimatedSection as="div" className="text-center mb-12">
                    <h2>Follow Our Journey</h2>
                    <p className="text-[var(--color-text-secondary)] mt-2">Get inspiration, see our latest finds, and join the community.</p>
                </AnimatedSection>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                    {feedItems.map((item, index) => (
                        <InstagramPost key={item.id} item={item} delay={index * 100} />
                    ))}
                </div>
                <AnimatedSection as="div" className="text-center mt-12">
                    <a 
                        href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary"
                    >
                        <InstagramIcon className="w-5 h-5"/>
                        Follow on Instagram
                    </a>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default InstagramFeedSection;