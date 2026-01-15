// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const SolutionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      label: 'Cá nhân hóa',
      color: 'emerald',
      position: { desktop: { top: '10%', left: '50%' }, mobile: 0 },
    },
    {
      label: 'Đánh giá đa chiều',
      color: 'teal',
      position: { desktop: { top: '50%', left: '10%' }, mobile: 1 },
    },
    {
      label: 'Phân tích AI',
      color: 'cyan',
      position: { desktop: { top: '50%', left: '90%' }, mobile: 2 },
    },
    {
      label: 'Khoa học tâm lý',
      color: 'emerald',
      position: { desktop: { top: '90%', left: '50%' }, mobile: 3 },
    },
  ];

  const benefits = [
    '7 loại đánh giá khoa học được công nhận quốc tế',
    'Phân tích AI sâu sắc từ Claude Sonnet',
    'Matching với hơn 1,000+ công ty tại Việt Nam',
    'Lộ trình phát triển nghề nghiệp chi tiết',
  ];

  return (
    <section className='relative min-h-screen flex items-center justify-center px-6 py-20 bg-white'>
      <div ref={ref} className='max-w-7xl mx-auto w-full'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* LEFT SIDE - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className='relative order-2 lg:order-1'
          >
            {/* Desktop Version - Orbiting Elements */}
            <div className='hidden lg:block relative w-full h-125'>
              {/* Center Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
              >
                <div className='w-40 h-40 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl'>
                  <svg
                    className='w-20 h-20 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Orbiting Elements - Desktop */}
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          scale: 1,
                        }
                      : {}
                  }
                  transition={{
                    delay: 0.5 + idx * 0.1,
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  className='absolute transform -translate-x-1/2 -translate-y-1/2'
                  style={{
                    top: feature.position.desktop.top,
                    left: feature.position.desktop.left,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`px-6 py-3 bg-white text-${feature.color}-700 rounded-full text-sm font-semibold border-2 border-${feature.color}-200 shadow-xl whitespace-nowrap cursor-pointer hover:shadow-2xl transition-shadow`}
                  >
                    {feature.label}
                  </motion.div>
                </motion.div>
              ))}

              {/* Connecting Lines - Subtle */}
              <svg className='absolute inset-0 w-full h-full pointer-events-none opacity-20'>
                <motion.circle
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ delay: 0.8, duration: 1.5 }}
                  cx='50%'
                  cy='50%'
                  r='35%'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeDasharray='5,5'
                  className='text-emerald-300'
                />
              </svg>
            </div>

            {/* Mobile/Tablet Version - Stacked Cards */}
            <div className='lg:hidden space-y-4'>
              {/* Center Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className='flex justify-center mb-8'
              >
                <div className='w-32 h-32 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl'>
                  <svg
                    className='w-16 h-16 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Feature Cards - Mobile */}
              <div className='grid grid-cols-2 gap-4'>
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                    className={`p-4 bg-linear-to-br from-${feature.color}-50 to-${feature.color}-100 rounded-2xl border border-${feature.color}-200 text-center`}
                  >
                    <p
                      className={`text-${feature.color}-700 font-semibold text-sm`}
                    >
                      {feature.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className='order-1 lg:order-2'
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'
            >
              Giải Pháp Hướng Nghiệp{' '}
              <span className='text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600'>
                Toàn Diện
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className='text-lg md:text-xl text-gray-600 mb-8 leading-relaxed'
            >
              DAPH2 kết hợp sức mạnh của trí tuệ nhân tạo, nghiên cứu tâm lý học
              và dữ liệu nghề nghiệp để tạo ra lộ trình phát triển cá nhân hóa
              cho bạn.
            </motion.p>

            {/* Benefits List */}
            <div className='space-y-4'>
              {benefits.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                  className='flex items-start gap-3 group'
                >
                  {/* Animated Checkmark */}
                  <div className='shrink-0 mt-0.5'>
                    <div className='w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300'>
                      <svg
                        className='w-4 h-4 text-emerald-600 group-hover:text-white transition-colors duration-300'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  </div>
                  <span className='text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors'>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Optional CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 0.6 }}
              className='mt-8'
            >
              <motion.button
                onClick={() => {
                  window.goToSlide(3);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2'
              >
                Tìm Hiểu Thêm
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
