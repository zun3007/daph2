// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// ============================================
// GAMIFICATION WRAPPER
// ============================================

// Static milestone configuration
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
  const hasCompletedRef = useRef(false);

  const progress = Math.round((currentQuestion / totalQuestions) * 100);

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

    if (milestone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowMilestone(milestone);
      triggerConfetti();

      setTimeout(() => {
        setShowMilestone(null);
      }, 2000); // Reduced to 2s
    }
  }, [progress, currentQuestion]);

  // Completion - only call once when reaching 100%
  useEffect(() => {
    if (
      currentQuestion === totalQuestions &&
      currentQuestion > 0 &&
      !hasCompletedRef.current
    ) {
      hasCompletedRef.current = true;
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
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4'>
      {/* Top Bar */}
      <div className='max-w-4xl mx-auto mb-6'>
        <div className='bg-white rounded-2xl shadow-lg p-4'>
          {/* Progress Bar */}
          <div className='mb-3'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-semibold text-gray-700'>
                Câu {currentQuestion}/{totalQuestions}
              </span>
              <span className='text-sm font-bold text-emerald-600'>
                {progress}%
              </span>
            </div>

            <div className='relative h-3 bg-gray-200 rounded-full overflow-hidden'>
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
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${
                    progress >= m.at
                      ? 'bg-white border-2 border-emerald-600'
                      : 'bg-gray-300'
                  }`}
                  style={{ left: `${m.at}%`, marginLeft: '-8px' }}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className='flex items-center justify-between text-sm'>
            {/* Time */}
            <div className='flex items-center gap-2'>
              <span className='text-blue-500'>⏱️</span>
              <span className='font-semibold text-gray-700'>
                {formatTime(totalTime)}
              </span>
            </div>

            {/* Speed indicator */}
            {totalTime > 0 && currentQuestion > 0 && (
              <div className='flex items-center gap-2'>
                <span className='text-purple-500'>⚡</span>
                <span className='font-semibold text-gray-700'>
                  {Math.round(currentQuestion / (totalTime / 60))}/min
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className='max-w-4xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 min-h-125 flex items-center justify-center'
        >
          {children}
        </motion.div>
      </div>

      {/* Milestone Celebration - Compact Notification (NO MORE BLOCKING!) */}
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
              className='bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-8 py-4 shadow-2xl border-2 border-white flex items-center gap-3'
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.6 }}
                className='text-4xl'
              >
                {showMilestone.icon}
              </motion.span>
              <div>
                <p className='text-xl font-bold'>{showMilestone.label}</p>
                <p className='text-sm text-emerald-100'>Keep going! 💪</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// PROGRESS INDICATOR COMPONENT
// ============================================

export const ProgressIndicator = ({ current, total, module }) => {
  const progress = Math.round((current / total) * 100);

  return (
    <div className='sticky top-4 z-40'>
      <div className='bg-white rounded-xl shadow-lg p-3'>
        <div className='flex items-center gap-3'>
          {/* Module Icon */}
          <div className='text-3xl'>{module.icon}</div>

          {/* Progress Info */}
          <div className='flex-1'>
            <div className='flex justify-between items-center mb-1'>
              <span className='text-xs font-semibold text-gray-600'>
                {module.name}
              </span>
              <span className='text-xs font-bold text-emerald-600'>
                {current}/{total}
              </span>
            </div>

            <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
              <motion.div
                className='h-full bg-linear-to-r from-emerald-500 to-teal-500'
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STREAK COUNTER
// ============================================

export const StreakCounter = ({ streak }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className='fixed bottom-8 right-8 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-2'
    >
      <motion.span
        animate={{
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 0.5 }}
        className='text-2xl'
      >
        🔥
      </motion.span>
      <div>
        <div className='text-2xl font-bold'>{streak}</div>
        <div className='text-xs'>Streak!</div>
      </div>
    </motion.div>
  );
};

// ============================================
// COMPLETION CELEBRATION
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
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className='bg-white rounded-3xl p-12 max-w-2xl w-full text-center'
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className='text-9xl mb-6'
        >
          🎉
        </motion.div>

        {/* Title */}
        <h1 className='text-5xl font-bold text-gray-900 mb-4'>
          Module Complete!
        </h1>
        <p className='text-xl text-gray-600 mb-8'>
          Amazing work! You're making great progress! 🚀
        </p>

        {/* Stats */}
        <div className='grid grid-cols-3 gap-6 mb-8'>
          <div className='bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200'>
            <div className='text-4xl mb-2'>⏱️</div>
            <div className='text-3xl font-bold text-emerald-600 mb-1'>
              {stats.time}
            </div>
            <div className='text-sm text-gray-600'>Time</div>
          </div>

          <div className='bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200'>
            <div className='text-4xl mb-2'>⚡</div>
            <div className='text-3xl font-bold text-blue-600 mb-1'>
              {stats.speed}
            </div>
            <div className='text-sm text-gray-600'>Speed</div>
          </div>

          <div className='bg-linear-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200'>
            <div className='text-4xl mb-2'>🔥</div>
            <div className='text-3xl font-bold text-orange-600 mb-1'>
              {stats.streak}
            </div>
            <div className='text-sm text-gray-600'>Max Streak</div>
          </div>
        </div>

        {/* Badges */}
        {stats.badges && stats.badges.length > 0 && (
          <div className='mb-8'>
            <h3 className='text-lg font-bold text-gray-700 mb-4'>
              Unlocked Badges! 🏆
            </h3>
            <div className='flex justify-center gap-4'>
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
                  className='bg-linear-to-br from-yellow-100 to-yellow-200 rounded-2xl p-4 border-2 border-yellow-400'
                >
                  <div className='text-4xl mb-2'>{badge.icon}</div>
                  <div className='text-xs font-semibold text-gray-700'>
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
          className='px-12 py-5 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-xl shadow-2xl'
        >
          Continue! 🚀
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// FUN INTERLUDE COMPONENT
// Show tips/facts between questions (every 5 questions)
// ============================================

const FUN_CONTENT = [
  { icon: '💡', title: 'Tip!', text: '80% người thành công có EQ cao hơn IQ!' },
  {
    icon: '🎯',
    title: 'Fun Fact!',
    text: 'Bill Gates làm bài test tính cách mỗi năm để tự nhận thức',
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
    text: 'Mỗi câu trả lời giúp bạn hiểu mình hơn một chút!',
  },
  {
    icon: '🎨',
    title: 'Fun Fact!',
    text: 'Tính cách có thể thay đổi theo thời gian và kinh nghiệm!',
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
  // Pick random content
  // eslint-disable-next-line react-hooks/purity
  const content = FUN_CONTENT[Math.floor(Math.random() * FUN_CONTENT.length)];

  // Auto-continue after 3 seconds
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
      className='fixed inset-0 flex items-center justify-center z-40 bg-linear-to-br from-emerald-50/50 to-teal-50/50 backdrop-blur-sm'
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className='bg-white rounded-3xl p-12 max-w-lg text-center shadow-2xl border-2 border-emerald-200'
      >
        {/* Icon */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 0.6, repeat: 1 }}
          className='text-8xl mb-6'
        >
          {content.icon}
        </motion.div>

        {/* Title */}
        <h3 className='text-2xl font-bold text-emerald-600 mb-3'>
          {content.title}
        </h3>

        {/* Text */}
        <p className='text-lg text-gray-700 mb-6'>{content.text}</p>

        {/* Progress indicator */}
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

        {/* Skip button */}
        <button
          onClick={onContinue}
          className='mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors'
        >
          Skip →
        </button>
      </motion.div>
    </motion.div>
  );
};

export default {
  GameWrapper,
  ProgressIndicator,
  StreakCounter,
  CompletionCelebration,
  FunInterlude,
};
