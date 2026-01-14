import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function HistoryLookup() {
  const [lookupMethod, setLookupMethod] = useState('email'); // 'email' or 'token'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleEmailLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Replace with actual Supabase call
      // const { data, error } = await supabase
      //   .from('result_tokens')
      //   .select('token, session_id')
      //   .eq('email', email)
      //   .single();

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo: Mock successful lookup
      const mockSessionId = 'demo-session-123';

      setMessage({
        type: 'success',
        text: 'Email đã được gửi! Kiểm tra hộp thư của bạn.',
      });

      // Option: Navigate directly (for demo)
      setTimeout(() => {
        navigate(`/results/${mockSessionId}`);
      }, 2000);
    } catch {
      setMessage({
        type: 'error',
        text: 'Không tìm thấy kết quả với email này!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Replace with actual Supabase call
      // const { data, error } = await supabase
      //   .from('result_tokens')
      //   .select('session_id')
      //   .eq('token', token)
      //   .single();

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate token format (basic check)
      if (token.length < 10) {
        throw new Error('Token không hợp lệ');
      }

      // Demo: Navigate to results
      const mockSessionId = 'demo-session-' + token.slice(0, 8);
      navigate(`/results/${mockSessionId}`);
    } catch {
      setMessage({
        type: 'error',
        text: 'Token không hợp lệ hoặc đã hết hạn!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6'>
      <div className='max-w-2xl w-full'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50'
        >
          {/* Header */}
          <div className='text-center mb-8'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className='text-6xl mb-4'
            >
              🔍
            </motion.div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
              Tra Cứu Kết Quả
            </h1>
            <p className='text-gray-600 text-lg'>
              Tìm lại báo cáo đánh giá của bạn
            </p>
          </div>

          {/* Tab Selection */}
          <div className='flex gap-4 mb-8'>
            <button
              onClick={() => {
                setLookupMethod('email');
                setMessage({ type: '', text: '' });
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                lookupMethod === 'email'
                  ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📧 Email
            </button>
            <button
              onClick={() => {
                setLookupMethod('token');
                setMessage({ type: '', text: '' });
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                lookupMethod === 'token'
                  ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔑 Token
            </button>
          </div>

          {/* Email Lookup Form */}
          {lookupMethod === 'email' && (
            <motion.form
              key='email-form'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleEmailLookup}
              className='space-y-6'
            >
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email của bạn
                </label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='example@email.com'
                  required
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
                />
                <p className='text-sm text-gray-500 mt-2'>
                  Chúng tôi sẽ gửi link truy cập đến email này
                </p>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Đang xử lý...
                  </span>
                ) : (
                  'Gửi Link Tra Cứu'
                )}
              </button>
            </motion.form>
          )}

          {/* Token Lookup Form */}
          {lookupMethod === 'token' && (
            <motion.form
              key='token-form'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleTokenLookup}
              className='space-y-6'
            >
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Access Token
                </label>
                <input
                  type='text'
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder='Nhập mã token của bạn'
                  required
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors font-mono text-sm'
                />
                <p className='text-sm text-gray-500 mt-2'>
                  Token được gửi qua email khi bạn hoàn thành test
                </p>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Đang kiểm tra...
                  </span>
                ) : (
                  'Xem Kết Quả'
                )}
              </button>
            </motion.form>
          )}

          {/* Message Display */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <div className='flex items-start gap-3'>
                <span className='text-2xl'>
                  {message.type === 'success' ? '✅' : '❌'}
                </span>
                <p className='flex-1'>{message.text}</p>
              </div>
            </motion.div>
          )}

          {/* Back to Home */}
          <div className='mt-8 pt-6 border-t border-gray-200 text-center'>
            <button
              onClick={() => navigate('/')}
              className='text-gray-600 hover:text-emerald-600 font-medium transition-colors'
            >
              ← Quay lại trang chủ
            </button>
          </div>

          {/* Help Section */}
          <div className='mt-8 bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100'>
            <h3 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
              <span>💡</span> Cần trợ giúp?
            </h3>
            <ul className='space-y-2 text-sm text-gray-700'>
              <li className='flex items-start gap-2'>
                <span className='text-emerald-600'>•</span>
                <span>Nếu không nhận được email, kiểm tra thư mục spam</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-emerald-600'>•</span>
                <span>
                  Token có hiệu lực trong 30 ngày kể từ ngày hoàn thành test
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-emerald-600'>•</span>
                <span>Liên hệ support@daph2.com nếu cần hỗ trợ thêm</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HistoryLookup;
