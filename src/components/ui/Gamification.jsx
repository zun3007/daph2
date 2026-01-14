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
      particleCount: 50, // Reduced from 100
      spread: 60, // Reduced from 70
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  };

  // Check milestones
  useEffect(() => {
    const milestone = MILESTONES.find(
      (m) => m.at === progress && currentQuestion > 0
    );

    if (milestone && milestone != showMilestone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowMilestone(milestone);
      triggerConfetti();

      setTimeout(() => {
        setShowMilestone(null);
      }, 3000);
    }
  }, [progress, currentQuestion, showMilestone]); // Removed milestones - it's static

  // Completion - only call once when reaching 100%
  useEffect(() => {
    if (
      currentQuestion === totalQuestions &&
      currentQuestion > 0 &&
      !hasCompletedRef.current
    ) {
      hasCompletedRef.current = true;
      // Don't trigger confetti here - let CompletionCelebration handle it
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
              {showMilestone?.map((m) => (
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

      {/* Milestone Celebration Overlay */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className='fixed inset-0 flex items-center justify-center z-50 pointer-events-none'
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.5 }}
              className='bg-white rounded-3xl p-12 shadow-2xl border-4 border-emerald-300'
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: 2 }}
                className='text-8xl mb-4 text-center'
              >
                {showMilestone.icon}
              </motion.div>
              <h2 className='text-4xl font-bold text-center text-emerald-700'>
                {showMilestone.label}
              </h2>
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
    // Optimized confetti - lighter and faster
    const duration = 2 * 1000; // Reduced from 3s to 2s
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // Reduced particle count for performance
      confetti({
        particleCount: 2, // Reduced from 3 to 2
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: Math.random() - 0.2 },
        disableForReducedMotion: true, // Respect user preferences
      });
    }, 30); // Increased interval from 20ms to 30ms

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
        transition={{ type: 'spring', duration: 0.5 }} // Faster animation
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
                    delay: idx * 0.1, // Reduced from 0.2 to 0.1
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

export default {
  GameWrapper,
  ProgressIndicator,
  StreakCounter,
  CompletionCelebration,
};
