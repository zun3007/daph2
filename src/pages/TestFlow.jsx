import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

// ============================================
// TEST FLOW LAYOUT - FULL SCREEN & RESPONSIVE
// ============================================

function TestFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { modules, currentModule, progress, resetTest } = useTestContext();

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Memoize calculations to prevent constant re-renders
  const overallProgress = useMemo(() => {
    return Math.round(
      (progress.answeredQuestions / progress.totalQuestions) * 100,
    );
  }, [progress.answeredQuestions, progress.totalQuestions]);

  // Get current module info
  const currentModuleInfo = useMemo(
    () => modules.find((m) => m.id === currentModule),
    [modules, currentModule],
  );

  const currentModuleIndex = useMemo(
    () => modules.findIndex((m) => m.id === currentModule),
    [modules, currentModule],
  );

  // Handle exit
  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    navigate('/');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  return (
    <div className='h-screen flex flex-col bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden'>
      {/* Top Navigation Bar - Fixed height */}
      <nav className='shrink-0 bg-white border-b border-gray-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <div className='flex items-center gap-3'>
              <button
                onClick={handleExit}
                className='text-gray-600 hover:text-gray-900 transition-colors'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
              </button>
              <span className='text-xl font-bold text-gray-900'>PathX</span>
            </div>

            {/* Overall Progress - Desktop */}
            <div className='hidden md:flex items-center gap-4'>
              <span className='text-sm text-gray-600'>
                Module {currentModuleIndex + 1}/{modules.length}
              </span>
              <div className='w-48 h-2 bg-gray-200 rounded-full overflow-hidden'>
                <motion.div
                  className='h-full bg-linear-to-r from-emerald-500 to-teal-500'
                  initial={false}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className='text-sm font-bold text-emerald-600'>
                {overallProgress}%
              </span>
            </div>

            {/* Current Module Info */}
            <div className='flex items-center gap-2 bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full border border-emerald-200'>
              <span className='text-2xl'>{currentModuleInfo?.icon}</span>
              <span className='text-sm font-semibold text-gray-900 hidden sm:block'>
                {currentModuleInfo?.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Module Progress Stepper */}
      <div className='shrink-0 bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 py-3'>
          {/* Desktop - Full horizontal view */}
          <div className='hidden md:flex items-center justify-center gap-2'>
            {modules.map((module, idx) => {
              const isCompleted = progress.completedModules.includes(module.id);
              const isCurrent = module.id === currentModule;
              const isPast = idx < currentModuleIndex;

              return (
                <div key={module.id} className='flex items-center'>
                  <div className='flex flex-col items-center'>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-white border-emerald-500 text-emerald-600 shadow-lg'
                            : isPast
                              ? 'bg-gray-200 border-gray-300 text-gray-500'
                              : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? '✓' : module.icon}
                    </motion.div>
                    <span
                      className={`text-xs mt-1 font-medium whitespace-nowrap ${
                        isCurrent ? 'text-emerald-600' : 'text-gray-500'
                      }`}
                    >
                      {module.name}
                    </span>
                  </div>

                  {idx < modules.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 ${
                        isPast || isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile - Carousel view with current module */}
          <div className='md:hidden'>
            <div className='relative overflow-hidden py-2'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentModule}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className='flex flex-col items-center'
                >
                  {/* Current Module */}
                  <div className='flex items-center justify-center gap-3 mb-3'>
                    {/* Prev hint */}
                    {currentModuleIndex > 0 && (
                      <div className='opacity-30 scale-75'>
                        <div className='w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-lg'>
                          {modules[currentModuleIndex - 1].icon}
                        </div>
                      </div>
                    )}

                    {/* Current */}
                    <div className='flex flex-col items-center'>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.5 }}
                        className='w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl text-white shadow-lg border-2 border-white'
                      >
                        {currentModuleInfo?.icon}
                      </motion.div>
                      <span className='text-sm font-bold text-emerald-600 mt-2'>
                        {currentModuleInfo?.name}
                      </span>
                    </div>

                    {/* Next hint */}
                    {currentModuleIndex < modules.length - 1 && (
                      <div className='opacity-30 scale-75'>
                        <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg'>
                          {modules[currentModuleIndex + 1].icon}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dots Indicator */}
                  <div className='flex gap-1.5'>
                    {modules.map((module, idx) => (
                      <motion.div
                        key={module.id}
                        animate={{
                          width: idx === currentModuleIndex ? '24px' : '6px',
                          backgroundColor:
                            idx === currentModuleIndex
                              ? '#10b981'
                              : idx < currentModuleIndex
                                ? '#6ee7b7'
                                : '#d1d5db',
                        }}
                        transition={{ duration: 0.3 }}
                        className='h-1.5 rounded-full'
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress text */}
            <div className='text-center'>
              <span className='text-xs text-gray-500'>
                Module {currentModuleIndex + 1} / {modules.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Flexible, fills remaining space */}
      <main className='flex-1 overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='h-full'
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            onClick={cancelExit}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl'
            >
              <div className='text-center mb-6'>
                <div className='text-6xl mb-4'>⚠️</div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Thoát khỏi test?
                </h2>
                <p className='text-gray-600'>
                  Tiến trình của bạn đã được lưu. Bạn có thể tiếp tục sau.
                </p>
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={cancelExit}
                  className='flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors'
                >
                  Tiếp tục test
                </button>
                <button
                  onClick={confirmExit}
                  className='flex-1 py-3 px-6 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all'
                >
                  Thoát
                </button>
              </div>

              <button
                onClick={() => {
                  resetTest();
                  navigate('/');
                }}
                className='w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'
              >
                Xóa tiến trình và bắt đầu lại
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TestFlow;
