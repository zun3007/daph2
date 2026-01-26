// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionContainer from '../utils/SectionContainer';
import ScrollIndicator from './../utils/ScrollIndicator';

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const problems = [
    {
      icon: (
        <svg
          className='w-12 h-12'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      title: 'Bối rối về tương lai',
      description: 'Không biết nên chọn ngành nghề nào phù hợp với bản thân',
    },
    {
      icon: (
        <svg
          className='w-12 h-12'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      ),
      title: 'Áp lực từ xung quanh',
      description: 'Chọn nghề theo mong muốn của gia đình hoặc bạn bè',
    },
    {
      icon: (
        <svg
          className='w-12 h-12'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      title: 'Lo lắng sai hướng',
      description:
        'Sợ đầu tư thời gian và công sức vào con đường không phù hợp',
    },
  ];

  return (
    <SectionContainer gradient>
      <div id='problem' ref={ref} className='max-w-7xl mx-auto w-full'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Bạn Đang Gặp Những Thách Thức Này?
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            97% học sinh Việt Nam đều trải qua những băn khoăn tương tự
          </p>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
              className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100'
            >
              <div className='text-emerald-600 mb-4'>{problem.icon}</div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {problem.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='text-center mt-12'
        >
          <p className='text-lg text-emerald-600 font-semibold'>
            PathX sẽ giúp bạn tìm ra câu trả lời
          </p>
        </motion.div>
      </div>
      <ScrollIndicator index={1} />
    </SectionContainer>
  );
};

export default ProblemSection;
