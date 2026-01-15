// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// ============================================
// GAMIFICATION WRAPPER - FIXED VERSION
// ============================================
//
// 🔧 FIXES:
// 1. Không trigger onComplete ngay khi mount (dùng hasMountedRef)
// 2. hasCompletedRef để tránh double trigger
// 3. Chỉ trigger khi question THAY ĐỔI (không phải initial)
// 4. Responsive CompletionCelebration (không scroll)

const MILESTONES = [
  { at: 25, label: 'Great Start!', icon: '🚀', color: 'blue' },
  { at: 50, label: 'Halfway Hero!', icon: '⚡', color: 'yellow' },
  { at: 75, label: 'Almost There!', icon: '🔥', color: 'orange' },
  { at: 100, label: 'Legend!', icon: '🎉', color: 'green' },
];

export const GameWrapper = ({
  children,
  currentQuestion,
  totalQuestions,
  onComplete,
}) => {
  const [showMilestone, setShowMilestone] = useState(null);
  const [totalTime, setTotalTime] = useState(0);

  // Refs để tránh bugs
  const hasCompletedRef = useRef(false);
  const hasMountedRef = useRef(false);
  const previousQuestionRef = useRef(currentQuestion);

  const progress = Math.round((currentQuestion / totalQuestions) * 100);

  // Mark as mounted after first render
  useEffect(() => {
    // Delay để đảm bảo không trigger ngay khi mount
    const timer = setTimeout(() => {
      hasMountedRef.current = true;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  };

  // Check milestones
  useEffect(() => {
    const milestone = MILESTONES.find(
      (m) => m.at === progress && currentQuestion > 0
    );

    if (milestone && hasMountedRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowMilestone(milestone);
      triggerConfetti();

      setTimeout(() => {
        setShowMilestone(null);
      }, 2000);
    }
  }, [progress, currentQuestion]);

  // Completion - CHỈ trigger khi user thực sự hoàn thành (không phải khi mount)
  useEffect(() => {
    // Kiểm tra xem question có thay đổi không
    const questionChanged = previousQuestionRef.current !== currentQuestion;
    previousQuestionRef.current = currentQuestion;

    // Điều kiện trigger:
    // 1. Đã mount xong (không phải initial render)
    // 2. currentQuestion === totalQuestions
    // 3. currentQuestion > 0 (có câu hỏi)
    // 4. Chưa complete trước đó
    // 5. Question đã thay đổi (user vừa trả lời xong câu cuối)

    if (
      hasMountedRef.current &&
      currentQuestion === totalQuestions &&
      currentQuestion > 0 &&
      !hasCompletedRef.current &&
      questionChanged
    ) {
      hasCompletedRef.current = true;
      console.log('GameWrapper: triggering onComplete');

      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 300);
    }
  }, [currentQuestion, totalQuestions, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='h-full flex flex-col bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50'>
      {/* Top Stats Bar - Compact */}
      <div className='shrink-0 px-4 pt-4 pb-3'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-lg p-3 sm:p-4'>
            {/* Progress Bar */}
            <div className='mb-2'>
              <div className='flex justify-between items-center mb-1.5'>
                <span className='text-xs sm:text-sm font-semibold text-gray-700'>
                  Câu {currentQuestion}/{totalQuestions}
                </span>
                <span className='text-xs sm:text-sm font-bold text-emerald-600'>
                  {progress}%
                </span>
              </div>

              <div className='relative h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden'>
                <motion.div
                  className='absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full'
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Milestone markers */}
                {MILESTONES.map((m) => (
                  <div
                    key={m.at}
                    className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                      progress >= m.at
                        ? 'bg-white border-2 border-emerald-600'
                        : 'bg-gray-300'
                    }`}
                    style={{ left: `${m.at}%`, marginLeft: '-6px' }}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className='flex items-center justify-between text-xs sm:text-sm'>
              {/* Time */}
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <span className='text-blue-500'>⏱️</span>
                <span className='font-semibold text-gray-700'>
                  {formatTime(totalTime)}
                </span>
              </div>

              {/* Speed indicator */}
              {totalTime > 0 && currentQuestion > 0 && (
                <div className='flex items-center gap-1.5 sm:gap-2'>
                  <span className='text-purple-500'>⚡</span>
                  <span className='font-semibold text-gray-700'>
                    {Math.round(currentQuestion / (totalTime / 60))}/min
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Content - Fills remaining space */}
      <div className='flex-1 overflow-y-auto px-4 pb-4'>
        <div className='max-w-4xl mx-auto h-full'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 h-full flex items-center justify-center'
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Milestone Celebration - Compact Notification */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className='fixed top-20 left-1/2 transform -translate-x-1/2 z-50'
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5 }}
              className='bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-2xl border-2 border-white flex items-center gap-2 sm:gap-3'
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.6 }}
                className='text-3xl sm:text-4xl'
              >
                {showMilestone.icon}
              </motion.span>
              <div>
                <p className='text-lg sm:text-xl font-bold'>
                  {showMilestone.label}
                </p>
                <p className='text-xs sm:text-sm text-emerald-100'>
                  Keep going! 💪
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// COMPLETION CELEBRATION - RESPONSIVE (NO SCROLL)
// ============================================

export const CompletionCelebration = ({ stats, onContinue }) => {
  useEffect(() => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 2,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: Math.random() - 0.2 },
        disableForReducedMotion: true,
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4'
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className='bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-lg w-full text-center'
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className='text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-4'
        >
          🎉
        </motion.div>

        {/* Title */}
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2'>
          Module Complete!
        </h1>
        <p className='text-sm sm:text-base text-gray-600 mb-4 sm:mb-6'>
          Amazing work! You're making great progress! 🚀
        </p>

        {/* Stats Cards */}
        <div className='grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6'>
          {/* Time */}
          <div className='bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 border border-emerald-200'>
            <div className='text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1'>
              ⏱️
            </div>
            <div className='text-base sm:text-lg md:text-xl font-bold text-emerald-600'>
              {stats.time}
            </div>
            <div className='text-[10px] sm:text-xs text-gray-600'>Time</div>
          </div>

          {/* Speed */}
          <div className='bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 border border-blue-200'>
            <div className='text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1'>
              ⚡
            </div>
            <div className='text-base sm:text-lg md:text-xl font-bold text-blue-600'>
              {stats.speed}
            </div>
            <div className='text-[10px] sm:text-xs text-gray-600'>Speed</div>
          </div>

          {/* Streak */}
          <div className='bg-linear-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 border border-orange-200'>
            <div className='text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1'>
              🔥
            </div>
            <div className='text-base sm:text-lg md:text-xl font-bold text-orange-600'>
              {stats.streak}
            </div>
            <div className='text-[10px] sm:text-xs text-gray-600'>Streak</div>
          </div>
        </div>

        {/* Badges */}
        {stats.badges && stats.badges.length > 0 && (
          <div className='mb-4 sm:mb-6'>
            <h3 className='text-sm sm:text-base font-bold text-gray-700 mb-2 sm:mb-3'>
              Unlocked Badges! 🏆
            </h3>
            <div className='flex justify-center gap-2 sm:gap-3 flex-wrap'>
              {stats.badges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: idx * 0.1,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  className='bg-linear-to-br from-yellow-100 to-yellow-200 rounded-xl sm:rounded-2xl p-2 sm:p-3 border-2 border-yellow-400 min-w-18 sm:min-w-21.25'
                >
                  <div className='text-xl sm:text-2xl md:text-3xl mb-0.5 sm:mb-1'>
                    {badge.icon}
                  </div>
                  <div className='text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-700 leading-tight'>
                    {badge.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className='w-full px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow'
        >
          Continue! 🚀
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// FUN INTERLUDE COMPONENT
// ============================================

const FUN_CONTENT = [
  { icon: '💡', title: 'Tip!', text: '80% người thành công có EQ cao hơn IQ!' },
  {
    icon: '🎯',
    title: 'Fun Fact!',
    text: 'Bill Gates làm bài test tính cách mỗi năm!',
  },
  {
    icon: '🚀',
    title: 'Keep Going!',
    text: 'Bạn đang làm rất tốt! Chỉ còn chút nữa thôi!',
  },
  {
    icon: '🌟',
    title: 'Did You Know?',
    text: 'Chỉ 5% người hoàn thành hết bài test này!',
  },
  {
    icon: '🧠',
    title: 'Brain Break!',
    text: 'Take a deep breath... Bạn đang làm tuyệt vời!',
  },
  {
    icon: '💪',
    title: 'Motivation!',
    text: 'Mỗi câu trả lời giúp bạn hiểu mình hơn!',
  },
  {
    icon: '🎨',
    title: 'Fun Fact!',
    text: 'Tính cách có thể thay đổi theo thời gian!',
  },
  {
    icon: '⚡',
    title: 'Quick Tip!',
    text: 'Trả lời theo intuition đầu tiên - thường đúng nhất!',
  },
  {
    icon: '🔥',
    title: 'You Rock!',
    text: 'Bạn thuộc top 10% người kiên nhẫn nhất!',
  },
  {
    icon: '🎁',
    title: 'Almost There!',
    text: 'Kết quả của bạn đang được chuẩn bị... 🎉',
  },
];

export const FunInterlude = ({ onContinue }) => {
  // eslint-disable-next-line react-hooks/purity
  const content = FUN_CONTENT[Math.floor(Math.random() * FUN_CONTENT.length)];

  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='fixed inset-0 flex items-center justify-center z-40 bg-linear-to-br from-emerald-50/50 to-teal-50/50 backdrop-blur-sm p-4'
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className='bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 max-w-lg w-full text-center shadow-2xl border-2 border-emerald-200'
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 0.6, repeat: 1 }}
          className='text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6'
        >
          {content.icon}
        </motion.div>

        <h3 className='text-lg sm:text-xl md:text-2xl font-bold text-emerald-600 mb-2 sm:mb-3'>
          {content.title}
        </h3>

        <p className='text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6'>
          {content.text}
        </p>

        <div className='flex justify-center gap-1'>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className='w-2 h-2 bg-emerald-500 rounded-full'
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className='w-2 h-2 bg-emerald-500 rounded-full'
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className='w-2 h-2 bg-emerald-500 rounded-full'
          />
        </div>

        <button
          onClick={onContinue}
          className='mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors'
        >
          Skip →
        </button>
      </motion.div>
    </motion.div>
  );
};

export default {
  GameWrapper,
  CompletionCelebration,
  FunInterlude,
};
