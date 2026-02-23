import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
import { callGeminiAPI, getErrorMessage, getFallbackResponse } from '../services/geminiAI';
import { saveResult } from '../services/database';

const messages = [
  { text: 'Đang chuẩn bị dữ liệu...', icon: '📋' },
  { text: 'AI đang phân tích tính cách...', icon: '🎭' },
  { text: 'Đang tìm nghề phù hợp cho bạn...', icon: '🎯' },
  { text: 'Xây dựng lộ trình học tập...', icon: '📈' },
  { text: 'Tính toán thần số học...', icon: '🔮' },
  { text: 'Hoàn thiện báo cáo...', icon: '📊' },
];

const funFacts = [
  'Người có định hướng rõ ràng hạnh phúc hơn 40% trong công việc',
  'AI có thể phân tích hơn 1,000 data points trong vài giây',
  '70% công việc tương lai chưa tồn tại ngày hôm nay',
  'IQ chỉ chiếm 20% thành công, phần còn lại là EQ và kỹ năng',
  'Tìm đúng nghề giúp bạn kiếm được 30% lương cao hơn',
  '97% học sinh Việt Nam chưa biết nghề phù hợp với mình',
];

const milestones = [
  { at: 25, label: 'Khởi đầu tốt!', icon: '🚀', color: 'emerald' },
  { at: 50, label: 'Đã được nửa rồi!', icon: '⚡', color: 'teal' },
  { at: 75, label: 'Gần xong rồi!', icon: '🔥', color: 'cyan' },
  { at: 100, label: 'Hoàn thành!', icon: '🎉', color: 'green' },
];

const LoadingScreen = () => {
  const navigate = useNavigate();
  const { sessionId } = useTestContext();
  const [progress, setProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [milestone, setMilestone] = useState(null);
  const [apiStatus, setApiStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const apiCalledRef = useRef(false);
  const progressTimerRef = useRef(null);

  const handleSuccess = useCallback(
    (result, personalInfo = null) => {
      // 1. localStorage (primary - always works offline)
      localStorage.setItem(
        `PathX_result_${sessionId}`,
        JSON.stringify(result),
      );

      // 2. Supabase (fire-and-forget - không block navigation)
      if (personalInfo) {
        saveResult(sessionId, result, personalInfo).catch(() => {
          // Silent fail - app works fine without Supabase
        });
      }

      setApiStatus('success');
      setProgress(100);
      setTimeout(() => {
        navigate(`/results/${sessionId}`);
      }, 1500);
    },
    [sessionId, navigate],
  );

  const handleUseFallback = useCallback(() => {
    const fallback = getFallbackResponse();
    handleSuccess(fallback);
  }, [handleSuccess]);

  const callAPI = useCallback(async () => {
    try {
      setApiStatus('loading');
      setErrorMessage('');

      const saved = localStorage.getItem(`PathX_prompt_${sessionId}`);
      if (!saved) {
        setErrorMessage('Không tìm thấy dữ liệu bài test. Vui lòng làm lại!');
        setApiStatus('error');
        return;
      }

      const { prompt, answers } = JSON.parse(saved);
      const result = await callGeminiAPI(prompt);
      // Truyền personalInfo để lưu vào Supabase
      handleSuccess(result, answers?.personal ?? null);
    } catch (error) {
      console.error('AI API error:', error);
      setErrorMessage(getErrorMessage(error));
      setApiStatus('error');
    }
  }, [sessionId, handleSuccess]);

  useEffect(() => {
    if (!apiCalledRef.current) {
      apiCalledRef.current = true;
      callAPI();
    }
  }, [callAPI]);

  useEffect(() => {
    if (apiStatus !== 'loading') return;

    const interval = 100;
    const maxProgress = 90;
    const increment = 0.15;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= maxProgress) {
          clearInterval(progressTimerRef.current);
          return maxProgress;
        }
        const newProgress = Math.min(prev + increment, maxProgress);

        milestones.forEach((m) => {
          if (prev < m.at && newProgress >= m.at && m.at <= maxProgress) {
            setMilestone(m);
            setTimeout(() => setMilestone(null), 2000);
          }
        });

        return newProgress;
      });
    }, interval);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [apiStatus]);

  const currentMessage = useMemo(() => {
    const messageIndex = Math.floor((progress / 100) * messages.length);
    return Math.min(messageIndex, messages.length - 1);
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentMsg = messages[currentMessage];

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6 overflow-hidden relative'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute rounded-full opacity-20'
            style={{
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              background: `radial-gradient(circle, ${
                ['#10b981', '#14b8a6', '#06b6d4'][i % 3]
              } 0%, transparent 70%)`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className='relative z-10 max-w-2xl w-full'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50'
        >
          {apiStatus === 'error' ? (
            <div className='text-center'>
              <div className='text-6xl mb-6'>😅</div>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>
                Oops! Có lỗi xảy ra
              </h2>
              <p className='text-gray-600 mb-8'>{errorMessage}</p>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button
                  onClick={() => {
                    apiCalledRef.current = false;
                    setProgress(0);
                    callAPI();
                  }}
                  className='px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all'
                >
                  Thử lại
                </button>
                <button
                  onClick={handleUseFallback}
                  className='px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all'
                >
                  Xem kết quả demo
                </button>
                <button
                  onClick={() => navigate('/')}
                  className='px-6 py-3 text-gray-500 hover:text-gray-700 transition-all'
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          ) : (
            <>
              <motion.div
                className='text-center mb-8'
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className='text-7xl md:text-8xl mb-4'
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {currentMsg.icon}
                </motion.div>
              </motion.div>

              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className='text-center mb-8'
                >
                  <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
                    {currentMsg.text}
                  </h2>
                  <p className='text-gray-600'>Vui lòng đợi trong giây lát...</p>
                </motion.div>
              </AnimatePresence>

              <div className='mb-8'>
                <div className='flex justify-between items-center mb-3'>
                  <span className='text-sm font-semibold text-gray-700'>
                    Đang xử lý
                  </span>
                  <span className='text-sm font-bold text-emerald-600'>
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className='relative h-3 bg-gray-200 rounded-full overflow-hidden'>
                  <motion.div
                    className='absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full'
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className='absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent'
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  {milestones.slice(0, -1).map((m) => (
                    <motion.div
                      key={m.at}
                      className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                        progress >= m.at ? 'bg-white shadow-lg' : 'bg-gray-300'
                      }`}
                      style={{ left: `${m.at}%`, marginLeft: '-6px' }}
                      animate={progress >= m.at ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </div>

                <div className='flex justify-between mt-3 px-1'>
                  {milestones.map((m) => (
                    <motion.span
                      key={m.at}
                      className={`text-xs font-medium ${
                        progress >= m.at ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                      animate={progress >= m.at ? { scale: [1, 1.1, 1] } : {}}
                    >
                      {m.at}%
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className='h-24 mb-6 relative'>
                <AnimatePresence>
                  {milestone && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: -20 }}
                      className='absolute inset-0 bg-linear-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center'
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className='text-4xl mb-2'
                      >
                        {milestone.icon}
                      </motion.div>
                      <p className='text-lg font-bold text-emerald-700'>
                        {milestone.label}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className='mb-8'>
                <div className='flex items-center justify-center gap-3 mb-4'>
                  <motion.div
                    className='w-16 h-16 rounded-full bg-linear-to-br from-emerald-400 to-teal-500'
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className='text-left'>
                    <p className='text-sm font-semibold text-gray-700'>
                      Hãy thư giãn...
                    </p>
                    <p className='text-sm text-gray-500'>
                      Thở sâu cùng với vòng tròn
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100'>
                <div className='flex items-start gap-3'>
                  <div className='text-2xl shrink-0'>💡</div>
                  <div>
                    <p className='text-sm font-semibold text-gray-700 mb-1'>
                      Bạn có biết?
                    </p>
                    <AnimatePresence mode='wait'>
                      <motion.p
                        key={currentFact}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className='text-gray-600 leading-relaxed'
                      >
                        {funFacts[currentFact]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className='flex justify-center gap-2 mt-8'>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className='w-2 h-2 bg-emerald-500 rounded-full'
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
