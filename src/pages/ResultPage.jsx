import { useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function ResultsPage() {
  const { sessionId, token } = useParams();

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl'
      >
        <div className='text-6xl mb-4'>📊</div>

        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          Kết Quả Đánh Giá
        </h1>

        <p className='text-gray-600 mb-4'>Results page - Coming soon!</p>

        {sessionId && (
          <div className='text-sm text-gray-500 bg-gray-100 rounded-lg p-3'>
            Session ID: {sessionId}
          </div>
        )}

        {token && (
          <div className='text-sm text-gray-500 bg-gray-100 rounded-lg p-3'>
            Token: {token}
          </div>
        )}

        <div className='mt-8'>
          <a
            href='/'
            className='inline-block px-8 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all'
          >
            Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default ResultsPage;
