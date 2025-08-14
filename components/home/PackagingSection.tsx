import React, { useRef, useEffect, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver.tsx';
import { PACKAGING_VIDEO_URL } from '../../constants.ts';
import { SparklesIcon } from '../Icons.tsx';

const PackagingSection: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.3, triggerOnce: false });

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (isVisible) {
                videoElement.play().catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error("Video autoplay error:", error);
                    }
                });
            } else {
                videoElement.pause();
            }
        }
    }, [isVisible]);

    const handleUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
            videoRef.current.play();
        }
    };

    return (
        <section
            ref={sectionRef}
            id="packaging"
            className="py-16 bg-[var(--color-surface)] overflow-x-hidden"
        >
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className={`lg:order-2 animate-slideInRight ${isVisible ? 'visible' : ''}`}>
                        <div className="relative rounded-lg shadow-2xl overflow-hidden border-4 border-[var(--color-surface-alt)]">
                            <video
                                ref={videoRef}
                                loop
                                muted={isMuted}
                                playsInline
                                className="w-full h-full object-cover"
                                preload="metadata"
                            >
                                <source src={PACKAGING_VIDEO_URL} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Unmute Button */}
                            {isMuted && (
                                <button
                                    onClick={handleUnmute}
                                    className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm hover:bg-black"
                                >
                                    🔊 Unmute
                                </button>
                            )}
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
                           <br /><br />
                           Because when you thrift with us, you’re not just buying clothes—you’re receiving a story, <strong>wrapped in love</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackagingSection;
