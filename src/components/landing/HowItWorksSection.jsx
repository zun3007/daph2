// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionContainer from '../utils/SectionContainer';
import { useNavigate } from 'react-router-dom';

const HowItWorksSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: '01',
      title: 'Hoàn Thành Đánh Giá',
      description:
        'Trả lời các câu hỏi về tính cách, năng lực và sở thích. Quy trình được thiết kế thân thiện và dễ dàng.',
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
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'AI Phân Tích Dữ Liệu',
      description:
        'Hệ thống AI xử lý câu trả lời của bạn, kết hợp với dữ liệu nghề nghiệp và xu hướng thị trường.',
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
    },
    {
      number: '03',
      title: 'Nhận Kết Quả Chi Tiết',
      description:
        'Xem báo cáo toàn diện về điểm mạnh, nghề nghiệp phù hợp và lộ trình phát triển cá nhân.',
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
    },
  ];

  return (
    <SectionContainer gradient>
      <div id='how-it-works' ref={ref} className='max-w-7xl mx-auto w-full'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Quy Trình Đơn Giản
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Chỉ 3 bước để khám phá con đường nghề nghiệp phù hợp với bạn
          </p>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8 relative'>
          {/* Connecting line - desktop only */}
          <div
            className='hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-linear-to-r from-emerald-200 via-teal-200 to-cyan-200'
            style={{ top: '4rem', left: '16.67%', right: '16.67%' }}
          />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + idx * 0.15, duration: 0.6 }}
              className='relative'
            >
              <div className='bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                {/* Number badge */}
                <div className='absolute -top-4 -left-4 w-12 h-12 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg'>
                  {step.number}
                </div>

                {/* Icon */}
                <div className='text-emerald-600 mb-6 mt-4'>{step.icon}</div>

                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  {step.title}
                </h3>

                <p className='text-gray-600 leading-relaxed'>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='text-center mt-12'
        >
          <p className='text-gray-600 mb-6'>
            Toàn bộ quá trình chỉ mất 15-20 phút
          </p>
          <motion.button
            onClick={() => navigate('/test')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
          >
            Bắt Đầu Ngay
          </motion.button>
        </motion.div>
      </div>
    </SectionContainer>
  );
};

export default HowItWorksSection;
