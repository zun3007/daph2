// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';

import BackgroundPattern from '../utils/BackgroundPattern';
import ScrollIndicator from '../utils/ScrollIndicator';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.section
      style={{ y, opacity }}
      className='relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50'
    >
      <BackgroundPattern />

      {/* Subtle floating shapes */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-20 right-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl'
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute bottom-20 left-20 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl'
        />
      </div>

      {/* Content */}
      <div className='relative z-10 text-center px-6 max-w-5xl'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className='inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-8'
          >
            <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
            Hướng nghiệp thông minh với AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight'
          >
            Tìm Ra Con Đường
            <br />
            <span className='text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600'>
              Nghề Nghiệp Phù Hợp
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed'
          >
            Khám phá tài năng và định hướng tương lai của bạn thông qua <br />
            phân tích AI chuyên sâu, kết hợp khoa học tâm lý học hiện đại
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate('/test');
              }}
              className='px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
            >
              Bắt Đầu Đánh Giá
            </motion.button>

            <motion.button
              onClick={() => {
                window.goToSlide(1);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-200 rounded-xl text-lg font-semibold hover:border-emerald-300 transition-all duration-300'
            >
              Tìm Hiểu Thêm
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className='mt-12 flex items-center justify-center gap-8 text-sm text-gray-500'
          >
            <div className='flex items-center gap-2'>
              <svg
                className='w-5 h-5 text-emerald-600'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              Miễn phí 100%
            </div>
            <div className='flex items-center gap-2'>
              <svg
                className='w-5 h-5 text-emerald-600'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              Không cần đăng ký
            </div>
            <div className='flex items-center gap-2'>
              <svg
                className='w-5 h-5 text-emerald-600'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              15-20 phút
            </div>
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator index={0} />
    </motion.section>
  );
};

export default HeroSection;
