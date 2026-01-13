// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionContainer from '../utils/SectionContainer';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: (
        <svg
          className='w-8 h-8'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
          />
        </svg>
      ),
      title: 'Phân Tích AI Chuyên Sâu',
      description:
        'Sử dụng Claude AI để phân tích đa chiều và đưa ra insights chính xác',
    },
    {
      icon: (
        <svg
          className='w-8 h-8'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
          />
        </svg>
      ),
      title: '7 Loại Đánh Giá',
      description:
        'Tính cách, hành vi, IQ, EQ, Ikigai, nghề nghiệp và hoài bão',
    },
    {
      icon: (
        <svg
          className='w-8 h-8'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          />
        </svg>
      ),
      title: 'Matching Công Ty',
      description:
        'Kết nối với hơn 1,000+ công ty đang tuyển dụng tại Việt Nam',
    },
    {
      icon: (
        <svg
          className='w-8 h-8'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      ),
      title: 'Lộ Trình Phát Triển',
      description:
        'Kế hoạch chi tiết từng bước để đạt được mục tiêu nghề nghiệp',
    },
    {
      icon: (
        <svg
          className='w-8 h-8'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
          />
        </svg>
      ),
      title: 'Bảo Mật Tuyệt Đối',
      description:
        'Dữ liệu của bạn được mã hóa và bảo vệ theo tiêu chuẩn quốc tế',
    },
    {
      icon: (
        <svg
          className='w-8 h-8'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
          />
        </svg>
      ),
      title: 'Xuất PDF & Email',
      description:
        'Lưu trữ và chia sẻ kết quả một cách dễ dàng và chuyên nghiệp',
    },
  ];

  return (
    <SectionContainer>
      <div ref={ref} className='max-w-7xl mx-auto w-full'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Tính Năng Nổi Bật
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Công cụ hướng nghiệp toàn diện với công nghệ tiên tiến
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + idx * 0.05, duration: 0.5 }}
              className='bg-linear-to-br from-white to-emerald-50/30 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300 group'
            >
              <div className='text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300'>
                {feature.icon}
              </div>
              <h3 className='text-lg font-bold text-gray-900 mb-2'>
                {feature.title}
              </h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeaturesSection;
