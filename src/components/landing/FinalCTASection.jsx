// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FinalCTASection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className='relative min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden'>
      {/* Background pattern */}
      <div className='absolute inset-0 opacity-10'>
        <svg width='100%' height='100%'>
          <defs>
            <pattern
              id='grid-pattern'
              width='60'
              height='60'
              patternUnits='userSpaceOnUse'
            >
              <circle cx='30' cy='30' r='2' fill='white' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid-pattern)' />
        </svg>
      </div>

      {/* Floating shapes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl'
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl'
      />

      <div ref={ref} className='relative z-10 max-w-4xl mx-auto text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className='inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-8'
          >
            <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>
            Hoàn toàn miễn phí
          </motion.div>

          <h2 className='text-4xl md:text-6xl font-bold text-white mb-6 leading-tight'>
            Sẵn Sàng Khám Phá
            <br />
            Con Đường Của Bạn?
          </h2>

          <p className='text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed'>
            Bắt đầu hành trình tìm kiếm định hướng nghề nghiệp của bạn ngay hôm
            nay
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'
          >
            <motion.button
              onClick={() => navigate('/test')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-10 py-5 bg-white text-emerald-600 rounded-xl text-xl font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300'
            >
              Bắt Đầu Đánh Giá Ngay
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90'
          >
            <div className='flex items-center gap-2'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <span>Không cần đăng ký</span>
            </div>
            <div className='flex items-center gap-2'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <span>Hoàn toàn miễn phí</span>
            </div>
            <div className='flex items-center gap-2'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <span>Kết quả ngay lập tức</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.8 }}
            className='mt-12 pt-12 border-t border-white/20'
          >
            <p className='text-white/70 text-sm'>
              Dữ liệu của bạn được bảo mật và xử lý theo tiêu chuẩn quốc tế
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
