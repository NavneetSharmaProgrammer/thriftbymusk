import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface AnimatedTextProps {
  text: string;
  el?: React.ElementType;
  className?: string;
  id?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, el: Wrapper = 'p', className, id }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <Wrapper
      ref={ref}
      id={id}
      className={`${className} animate-word-reveal ${isVisible ? 'visible' : ''}`}
      aria-label={text}
    >
      {text.split(' ').map((word, index) => (
        <span key={index} style={{ transitionDelay: `${index * 80}ms` }}>
          {word}&nbsp;
        </span>
      ))}
    </Wrapper>
  );
};

export default AnimatedText;