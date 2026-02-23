import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchByPersonalInfo } from '../services/database';
import { isSupabaseAvailable } from '../services/supabase';

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => currentYear - 16 - i);

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ResultCard({ result, index }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow'
    >
      <div className='flex items-center gap-4'>
        <div className='text-4xl shrink-0'>{result.personality_emoji || '🌟'}</div>
        <div className='flex-1 min-w-0'>
          <div className='font-bold text-gray-900 text-lg leading-tight mb-1'>
            {result.personality_title || 'Kết quả test'}
          </div>
          {result.top_career && (
            <div className='flex items-center gap-1.5 text-emerald-700 font-medium text-sm mb-1'>
              <span>🎯</span>
              <span>{result.top_career}</span>
            </div>
          )}
          <div className='text-xs text-gray-400'>{formatDate(result.created_at)}</div>
        </div>
        <button
          onClick={() => navigate(`/results/${result.session_id}`)}
          className='shrink-0 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all'
        >
          Xem kết quả →
        </button>
      </div>
    </motion.div>
  );
}

function HistoryLookup() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabaseOk = isSupabaseAvailable();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (searched) setSearched(false);
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.fullName.trim().length < 2) {
      setError('Vui lòng nhập họ tên (ít nhất 2 ký tự)');
      return;
    }

    setLoading(true);
    try {
      const { data, error: dbError } = await searchByPersonalInfo(
        formData.fullName,
        formData.birthDay || null,
        formData.birthMonth || null,
        formData.birthYear || null,
      );

      if (dbError && dbError !== 'SUPABASE_UNAVAILABLE') {
        setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!');
      } else {
        setResults(data ?? []);
        setSearched(true);
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 md:p-6'>
      <div className='max-w-2xl w-full'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white rounded-3xl shadow-2xl border border-white/50 overflow-hidden'
        >
          {/* Header */}
          <div className='bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white text-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className='text-5xl mb-3'
            >
              🔍
            </motion.div>
            <h1 className='text-2xl md:text-3xl font-bold mb-2'>Tra Cứu Kết Quả</h1>
            <p className='text-white/80 text-sm md:text-base'>
              Nhập thông tin để tìm lại báo cáo hướng nghiệp của bạn
            </p>
          </div>

          <div className='p-6 md:p-8'>
            {/* Supabase unavailable warning */}
            {!supabaseOk && (
              <div className='mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2'>
                <span className='shrink-0 text-lg'>⚠️</span>
                <span>Tính năng tra cứu đang tạm thời không khả dụng. Vui lòng thử lại sau.</span>
              </div>
            )}

            {/* Search Form */}
            <form onSubmit={handleSearch} className='space-y-5'>
              {/* Name field */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Họ và tên <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  placeholder='Nguyễn Văn A'
                  disabled={!supabaseOk}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400'
                />
              </div>

              {/* Birth date fields */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Ngày sinh{' '}
                  <span className='text-gray-400 font-normal'>(không bắt buộc, nhưng giúp tìm chính xác hơn)</span>
                </label>
                <div className='grid grid-cols-3 gap-3'>
                  <select
                    value={formData.birthDay}
                    onChange={handleChange('birthDay')}
                    disabled={!supabaseOk}
                    className='px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm disabled:bg-gray-50'
                  >
                    <option value=''>Ngày</option>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthMonth}
                    onChange={handleChange('birthMonth')}
                    disabled={!supabaseOk}
                    className='px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm disabled:bg-gray-50'
                  >
                    <option value=''>Tháng</option>
                    {MONTHS.map((m, i) => (
                      <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthYear}
                    onChange={handleChange('birthYear')}
                    disabled={!supabaseOk}
                    className='px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-sm disabled:bg-gray-50'
                  >
                    <option value=''>Năm</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className='flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200'>
                  <span>❌</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type='submit'
                disabled={loading || !supabaseOk}
                className='w-full py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Đang tìm kiếm...
                  </span>
                ) : (
                  '🔍 Tìm kết quả'
                )}
              </button>
            </form>

            {/* Results */}
            <AnimatePresence>
              {searched && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-8'
                >
                  <div className='flex items-center gap-2 mb-4'>
                    <h2 className='font-bold text-gray-900'>
                      {results.length > 0
                        ? `Tìm thấy ${results.length} kết quả`
                        : 'Không tìm thấy kết quả'}
                    </h2>
                    {results.length > 0 && (
                      <span className='text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium'>
                        {results.length}
                      </span>
                    )}
                  </div>

                  {results.length === 0 ? (
                    <div className='text-center py-8 text-gray-500'>
                      <div className='text-4xl mb-3'>😕</div>
                      <p className='font-medium mb-1'>Chưa tìm thấy kết quả nào</p>
                      <p className='text-sm'>
                        Kiểm tra lại chính tả tên và thêm ngày sinh để tìm chính xác hơn
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {results.map((r, i) => (
                        <ResultCard key={r.session_id} result={r} index={i} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className='mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4'>
              <Link
                to='/'
                className='text-gray-500 hover:text-emerald-600 font-medium transition-colors text-sm'
              >
                ← Về trang chủ
              </Link>
              <Link
                to='/test'
                className='px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition-colors'
              >
                Làm bài test mới ✨
              </Link>
            </div>

            {/* Help */}
            <div className='mt-6 bg-blue-50 rounded-2xl p-5 border border-blue-100'>
              <h3 className='font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm'>
                <span>💡</span> Mẹo tìm kiếm
              </h3>
              <ul className='space-y-1.5 text-sm text-gray-600'>
                <li className='flex items-start gap-2'>
                  <span className='text-emerald-500 mt-0.5 shrink-0'>•</span>
                  <span>Nhập đúng họ tên như khi làm bài test</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-emerald-500 mt-0.5 shrink-0'>•</span>
                  <span>Thêm ngày sinh để thu hẹp kết quả nếu tên phổ biến</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-emerald-500 mt-0.5 shrink-0'>•</span>
                  <span>Kết quả được lưu trên hệ thống trong 1 năm</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HistoryLookup;
