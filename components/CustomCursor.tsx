'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const followerRef = useRef<HTMLDivElement>(null);
  const lensContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const follower = followerRef.current;
    const lensContent = lensContentRef.current;
    if (!follower || !lensContent) return;

    let isVisible = false;
    let isHovering = false;
    let currentR = 12; // default radius is 12px (half of 24px)
    let activeTarget: HTMLElement | null = null;
    let activeClone: HTMLElement | null = null;

    const SCALE = 1.4;    // Magnification factor
    const LENS_R = 60;   // Lens radius (120px diameter)
    const DEFAULT_R = 12; // Default cursor radius (24px diameter)

    // Dynamically retrieve parent background color to mask underlying text
    const getAncestorBackgroundColor = (el: HTMLElement): string => {
      let current: HTMLElement | null = el;
      while (current) {
        const bg = window.getComputedStyle(current).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          return bg;
        }
        current = current.parentElement;
      }
      return '#FAFAF5'; // fallback cream
    };

    // Copies critical styles to ensure cloned text matches the original look
    const copyComputedStyles = (source: HTMLElement, dest: HTMLElement) => {
      const computed = window.getComputedStyle(source);
      const props = [
        'fontFamily', 'fontWeight', 'color', 'textAlign', 'textTransform',
        'whiteSpace', 'letterSpacing', 'textDecoration', 'fontStyle',
        'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
        'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
        'lineHeight'
      ];
      props.forEach(prop => {
        (dest.style as any)[prop] = (computed as any)[prop];
      });
      
      const rect = source.getBoundingClientRect();
      dest.style.width = `${rect.width}px`;
      dest.style.height = `${rect.height}px`;
      dest.style.position = 'absolute';
      dest.style.transformOrigin = '0 0';
      dest.style.transform = `scale(${SCALE})`;
    };

    const onMouseMove = (e: MouseEvent) => {
      // Center the lens directly on the mouse pointer tip
      follower.style.transform = `translate3d(${e.clientX - currentR}px, ${e.clientY - currentR}px, 0)`;
      
      if (!isVisible) {
        isVisible = true;
        follower.classList.add('visible');
      }

      // Keep magnified clone aligned with the background text
      if (isHovering && activeTarget && activeClone) {
        const rect = activeTarget.getBoundingClientRect();
        const dx = e.clientX - rect.left;
        const dy = e.clientY - rect.top;

        activeClone.style.left = `${LENS_R - dx * SCALE}px`;
        activeClone.style.top = `${LENS_R - dy * SCALE}px`;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      follower.classList.remove('visible');
      clearMagnifier();
    };

    const clearMagnifier = () => {
      isHovering = false;
      currentR = DEFAULT_R;
      follower.classList.remove('hovering');
      lensContent.innerHTML = '';
      activeTarget = null;
      activeClone = null;
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
          // Find closest typography element
          const textContainer = (
            target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, li, label, strong, em') ||
            target
          ) as HTMLElement;

          if (textContainer && textContainer.textContent?.trim()) {
            if (activeTarget !== textContainer) {
              activeTarget = textContainer;
              lensContent.innerHTML = '';
              
              const clone = textContainer.cloneNode(true) as HTMLElement;
              clone.removeAttribute('id');
              copyComputedStyles(textContainer, clone);
              lensContent.appendChild(clone);
              activeClone = clone;

              // Color match the background to conceal background text ghosting
              const bg = getAncestorBackgroundColor(textContainer);
              follower.style.backgroundColor = bg;

              isHovering = true;
              currentR = LENS_R;
              follower.classList.add('hovering');
            }
          } else {
            // General element hover (non-text, like small icon/button wrapper)
            clearMagnifier();
            isHovering = true;
            currentR = 24; // Medium size
            follower.classList.add('hovering');
            follower.style.backgroundColor = 'rgba(230, 74, 25, 0.15)';
          }
        } else {
          if (isHovering) {
            clearMagnifier();
            follower.style.backgroundColor = 'rgba(230, 74, 25, 0.08)';
          }
        }
      } catch (err) {
        clearMagnifier();
        follower.style.backgroundColor = 'rgba(230, 74, 25, 0.08)';
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
    <div ref={followerRef} className="custom-cursor-follower">
      <div ref={lensContentRef} className="lens-content" />
    </div>
  );
}

