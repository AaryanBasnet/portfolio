import { useEffect, useRef } from 'react';

/**
 * Wrapper component that uses IntersectionObserver to trigger
 * a CSS reveal animation when the element scrolls into view.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '-60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </Tag>
  );
}
