// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const BACKGROUNDS = [
  'bg-white',
  'bg-linear-to-br from-emerald-50 to-white',
  'bg-linear-to-br from-teal-50 to-white',
  'bg-linear-to-br from-cyan-50 to-white',
  'bg-linear-to-br from-emerald-100/40 to-white',
  'bg-linear-to-br from-teal-100/40 to-white',
  'bg-linear-to-br from-emerald-600 to-teal-600',
];

export default function SnapScrollContainer({ sections }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);
  const containerRef = useRef(null);

  const total = sections.length;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const isIPad =
    typeof window !== 'undefined' &&
    window.innerWidth >= 768 &&
    window.innerWidth <= 1024;

  /* ========= CORE SLIDE CHANGE ========= */
  const goTo = useCallback(
    (index) => {
      if (isAnimating.current) return;
      if (index < 0 || index >= total) return;

      isAnimating.current = true;
      setActiveIndex(index);

      setTimeout(
        () => {
          isAnimating.current = false;
        },
        isIPad ? 700 : 900
      );
    },
    [isIPad, total]
  );

  /* ========= WHEEL CONTROL ========= */
  useEffect(() => {
    if (isMobile) return;

    const onWheel = (e) => {
      e.preventDefault();
      if (isAnimating.current) return;

      if (e.deltaY > 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [activeIndex, goTo, isMobile]);

  /* ========= KEYBOARD CONTROL ========= */
  useEffect(() => {
    if (isMobile) return;

    const onKey = (e) => {
      if (isAnimating.current) return;

      if (e.key === 'ArrowDown') goTo(activeIndex + 1);
      if (e.key === 'ArrowUp') goTo(activeIndex - 1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, goTo, isMobile]);

  /* ========= MOVE SLIDES ========= */
  useEffect(() => {
    if (!containerRef.current) return;

    if (isMobile) return;

    containerRef.current.style.transform = `translateY(-${
      activeIndex * 100
    }vh)`;
  }, [activeIndex, isMobile]);

  useEffect(() => {
    window.goToSlide = (index) => {
      goTo(index);
    };
  }, [goTo]);

  return (
    <div
      className={`relative min-h-svh ${
        isMobile ? 'overflow-visible' : 'overflow-hidden'
      } transition-colors duration-700 ${
        BACKGROUNDS[activeIndex] || 'bg-white'
      }`}
    >
      {/* ===== SLIDES ===== */}
      {isMobile ? null : (
        <div className='fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3'>
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === activeIndex
                  ? 'bg-emerald-600 scale-150'
                  : 'bg-gray-300 hover:scale-125'
              }`}
            />
          ))}
        </div>
      )}
      <motion.div
        ref={containerRef}
        className='absolute top-0 left-0 w-full'
        transition={{
          duration: isIPad ? 0.7 : 0.9,
          ease: [0.22, 1, 0.36, 1], // Apple easing
        }}
      >
        {sections.map((Section, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={index}
              className='min-h-svh flex items-center justify-center'
              animate={
                isMobile
                  ? {}
                  : {
                      y: isActive ? 0 : 40,
                    }
              }
              transition={{
                duration: isIPad ? 1.1 : 1.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* ===== PARALLAX CONTENT ===== */}
              <motion.div
                animate={{ y: isActive ? 0 : 16 }}
                transition={{
                  duration: isIPad ? 0.7 : 0.9,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
                className='w-full'
              >
                <Section />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
