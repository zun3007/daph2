import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6'>
      <div className='max-w-2xl w-full text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className='bg-white rounded-3xl shadow-2xl p-12 border border-white/50'
        >
          {/* 404 Icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='text-8xl mb-6'
          >
            🧭
          </motion.div>

          {/* Error Message */}
          <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
          <h2 className='text-2xl font-bold text-gray-700 mb-4'>
            Trang Không Tồn Tại
          </h2>
          <p className='text-gray-600 text-lg mb-8'>
            Oops! Có vẻ như bạn đã đi lạc đường. Trang bạn tìm kiếm không tồn
            tại hoặc đã bị xóa.
          </p>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className='px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
            >
              🏠 Về Trang Chủ
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className='px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-200 rounded-xl font-semibold hover:border-emerald-300 transition-all duration-300'
            >
              ← Quay Lại
            </motion.button>
          </div>

          {/* Popular Pages */}
          <div className='mt-12 pt-8 border-t border-gray-200'>
            <p className='text-gray-600 mb-4'>Hoặc truy cập:</p>
            <div className='flex flex-wrap gap-3 justify-center'>
              <button
                onClick={() => navigate('/test')}
                className='px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium'
              >
                Làm Test Mới
              </button>
              <button
                onClick={() => navigate('/lookup')}
                className='px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium'
              >
                Tra Cứu Kết Quả
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
