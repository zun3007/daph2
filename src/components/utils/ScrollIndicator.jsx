// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ScrollIndicator = () => {
  return (
    <motion.div
      onClick={() => {
        window.goToSlide(1);
      }}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className='absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer'
    >
      <div className='flex flex-col items-center gap-2 text-emerald-600'>
        <span className='text-sm font-medium'>Cuộn xuống</span>
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 14l-7 7m0 0l-7-7m7 7V3'
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default ScrollIndicator;
