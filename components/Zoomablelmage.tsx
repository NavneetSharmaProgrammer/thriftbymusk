import React, { useState, useRef, TouchEvent, useEffect } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const lastTap = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0, scale: 1, distance: 0 });

  // Reset state when image source changes (e.g., when clicking a thumbnail)
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  const getDistance = (touches: React.TouchList) => {
    const [touch1, touch2] = [touches[0], touches[1]];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: TouchEvent<HTMLImageElement>) => {
    if (!isMobile) return;

    const now = new Date().getTime();
    const timeSinceLastTap = now - lastTap.current;

    // Double tap to zoom
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2);
      }
      e.preventDefault(); // Prevent default browser zoom
    }
    lastTap.current = now;

    // Pan & Pinch start
    touchStartRef.current = {
        ...touchStartRef.current,
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
        scale,
    };

    if (e.touches.length === 2) {
      touchStartRef.current.distance = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLImageElement>) => {
    if (!isMobile) return;

    // Pan
    if (e.touches.length === 1 && scale > 1) {
      e.preventDefault(); // Prevent page scrolling while panning
      const img = imageRef.current;
      if (!img) return;
      
      const newX = e.touches[0].clientX - touchStartRef.current.x;
      const newY = e.touches[0].clientY - touchStartRef.current.y;
      
      // Calculate boundaries to prevent panning out of view
      const max_x = (img.clientWidth * scale - img.clientWidth) / 2;
      const max_y = (img.clientHeight * scale - img.clientHeight) / 2;

      const clampedX = Math.max(-max_x, Math.min(max_x, newX));
      const clampedY = Math.max(-max_y, Math.min(max_y, newY));

      setPosition({ x: clampedX, y: clampedY });
    }

    // Pinch
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent page scrolling while zooming
      const newDist = getDistance(e.touches);
      const newScale = touchStartRef.current.scale * (newDist / touchStartRef.current.distance);
      const clampedScale = Math.max(1, Math.min(newScale, 4)); // Clamp scale between 1x and 4x
      setScale(clampedScale);
    }
  };

  const handleTouchEnd = () => {
    if (scale <= 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const imageStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transition: scale === 1 ? 'transform 0.3s ease-out' : 'none',
    touchAction: 'none',
    willChange: 'transform',
    cursor: isMobile ? (scale > 1 ? 'grab' : 'zoom-in') : 'auto',
  };

  const touchHandlers = isMobile ? { 
    onTouchStart: handleTouchStart, 
    onTouchMove: handleTouchMove, 
    onTouchEnd: handleTouchEnd 
  } : {};

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      style={imageStyle}
      className="w-full h-full object-cover" // Ensure base layout styles are applied
      {...touchHandlers}
    />
  );
};

export default ZoomableImage;