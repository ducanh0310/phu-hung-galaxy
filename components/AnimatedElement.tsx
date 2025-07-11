
import React, { useRef, ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  delay?: string;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className = '', delay = 'delay-0' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${delay} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};
