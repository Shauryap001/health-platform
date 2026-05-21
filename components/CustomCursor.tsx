'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    let isVisible = false;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      // Offset by half of the default width (12px) to center it on the tip of the pointer
      follower.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
      
      if (!isVisible) {
        isVisible = true;
        follower.classList.add('visible');
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      follower.classList.remove('visible');
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      try {
        const isHoverable =
          target.closest('a') ||
          target.closest('button') ||
          target.closest('h1, h2, h3, h4, h5, h6') ||
          target.closest('p, span, li, strong, em, label, input, select, textarea') ||
          window.getComputedStyle(target).cursor === 'pointer';

        if (isHoverable) {
          if (!isHovering) {
            isHovering = true;
            follower.classList.add('hovering');
          }
        } else {
          if (isHovering) {
            isHovering = false;
            follower.classList.remove('hovering');
          }
        }
      } catch (err) {
        if (isHovering) {
          isHovering = false;
          follower.classList.remove('hovering');
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <div
      ref={followerRef}
      className="custom-cursor-follower"
    />
  );
}

