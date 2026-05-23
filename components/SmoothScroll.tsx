'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4, // Cinematic slow feeling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      infinite: false,
    });

    // Parallax update function
    const updateParallax = () => {
      const targets = document.querySelectorAll('.parallax-img');
      const viewHeight = window.innerHeight;
      
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        
        // Only transform if the image wrapper is currently in the viewport
        if (rect.top < viewHeight && rect.bottom > 0) {
          const elementCenter = rect.top + rect.height / 2;
          const scrollPercent = elementCenter / viewHeight;
          
          // Cinematic subtle translation between -35px and 35px
          const yVal = (scrollPercent - 0.5) * 70;
          (target as HTMLElement).style.transform = `translate3d(0, ${yVal}px, 0) scale(1.18)`;
        }
      });
    };

    // Tie parallax check to Lenis scroll ticks
    lenis.on('scroll', updateParallax);

    // Setup requestAnimationFrame loop for Lenis
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Initial position call
    setTimeout(updateParallax, 100);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
