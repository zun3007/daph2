// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionContainer from '../utils/SectionContainer';
import ScrollIndicator from '../utils/ScrollIndicator';

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { number: '10,000+', label: 'Học sinh đã sử dụng' },
    { number: '95%', label: 'Độ hài lòng' },
    { number: '1,000+', label: 'Công ty đối tác' },
    { number: '15-20', label: 'Phút hoàn thành' },
  ];

  const testimonials = [
    {
      name: 'Ngô Thái Anh Bình',
      role: 'Học sinh lớp 12',
      avatar: 'MA',
      content:
        'PathX giúp mình tìm ra được đam mê thực sự và con đường nghề nghiệp phù hợp. Rất chi tiết và chuyên nghiệp!',
    },
    {
      name: 'Nguyễn Khắc Bình',
      role: 'Sinh viên năm 1',
      avatar: 'TK',
      content:
        'Kết quả phân tích rất chính xác, giúp mình hiểu rõ hơn về điểm mạnh và hướng phát triển của bản thân.',
    },
    {
      name: 'Nguyễn Tiến Bình',
      role: 'Học sinh lớp 11',
      avatar: 'PL',
      content:
        'Giao diện dễ sử dụng, các câu hỏi rất thú vị. Phần matching công ty rất hữu ích cho việc định hướng tương lai.',
    },
  ];

  return (
    <SectionContainer gradient>
      <div ref={ref} className='max-w-7xl mx-auto w-full'>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-20'
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
              className='text-center'
            >
              <div className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600 mb-2'>
                {stat.number}
              </div>
              <div className='text-gray-600 font-medium'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Học Sinh Nói Gì Về PathX
          </h2>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
              className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100'
            >
              <div className='flex items-center gap-4 mb-4'>
                <div className='w-12 h-12 bg-linear-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold'>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className='font-bold text-gray-900'>
                    {testimonial.name}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className='text-gray-600 leading-relaxed italic'>
                "{testimonial.content}"
              </p>
              <div className='flex gap-1 mt-4'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className='w-5 h-5 text-yellow-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ScrollIndicator index={5} />
    </SectionContainer>
  );
};

export default StatsSection;
