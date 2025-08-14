import React, { useRef, useEffect } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { PACKAGING_VIDEO_URL } from '../../constants';
import { SparklesIcon } from '../Icons';

const PackagingSection: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    // Observer for the entire section to control video playback
    const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.3, triggerOnce: false });

    // Effect to play/pause video based on visibility
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (isVisible) {
                videoElement.play().catch(error => {
                    // Ignore AbortError which is expected if the user scrolls away quickly
                    if (error.name !== 'AbortError') {
                        console.error("Video autoplay error:", error);
                    }
                });
            } else {
                videoElement.pause();
            }
        }
    }, [isVisible]);

    // Effect to unmute video on the user's first click anywhere on the page
    useEffect(() => {
        const enableSound = () => {
            const videoElement = videoRef.current;
            if (videoElement) {
                videoElement.muted = false;
                // Attempt to play again in case it was paused, respecting visibility
                if (isVisible) {
                    videoElement.play().catch(e => console.error("Error playing video on unmute:", e));
                }
            }
            // This is a one-time event, so we remove the listener after it fires.
            window.removeEventListener('click', enableSound);
        };

        window.addEventListener('click', enableSound);

        // Cleanup function to remove the listener if the component unmounts
        return () => {
            window.removeEventListener('click', enableSound);
        };
    }, [isVisible]); // Dependency ensures play() is called correctly if video is visible

    return (
        <section
            ref={sectionRef}
            id="packaging"
            className="py-16 bg-[var(--color-surface)] overflow-x-hidden"
        >
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className={`lg:order-2 animate-slideInRight ${isVisible ? 'visible' : ''}`}>
                        {/* Container is styled to handle portrait aspect ratio */}
                        <div className="relative rounded-lg shadow-2xl overflow-hidden border-4 border-[var(--color-surface-alt)] bg-black max-h-[70vh] aspect-[9/16] mx-auto">
                            <video
                                ref={videoRef}
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-contain" // Use object-contain to prevent cropping
                                preload="metadata"
                            >
                                <source src={PACKAGING_VIDEO_URL} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                    <div className={`lg:order-1 text-center lg:text-left animate-slideInLeft ${isVisible ? 'visible' : ''}`}>
                        <div className="inline-flex items-center gap-2 font-semibold text-[var(--color-primary)] mb-4">
                            <SparklesIcon className="w-6 h-6" />
                            <span>The Thrift by Musk Signature Touch</span>
                        </div>
                        <h2 className="mb-4">An Unboxing Worth Savoring</h2>
                        <p className="text-[var(--color-text-secondary)]">
                           From our distinctive packaging to the handwritten notes inside, we believe your purchase should feel as special as the clothes themselves.
                           <br/><br/>
                           Because when you thrift with us, you’re not just buying clothes—you’re receiving a story, <strong>wrapped in love</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackagingSection;
