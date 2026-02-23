import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GameWrapper,
  CompletionCelebration,
} from '../components/ui/Gamification';

// ============================================
// PERSONAL INFO FORM - REDESIGNED & FIXED
// ============================================

function PersonalInfoForm() {
  const navigate = useNavigate();
  const { saveAnswer, submitTest, currentModule, answers } = useTestContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [startTime] = useState(Date.now());

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    likes: '',
    dislikes: '',
    dreams: '',
  });

  // Questions config
  const questions = [
    {
      id: 'fullName',
      type: 'text',
      question: 'Tên đầy đủ của bạn?',
      placeholder: 'Nguyễn Văn A',
      emoji: '👤',
      validation: (val) => val.trim().length >= 3,
      errorMsg: 'Vui lòng nhập tên (ít nhất 3 ký tự)',
    },
    {
      id: 'birthDate',
      type: 'date',
      question: 'Ngày sinh của bạn?',
      subtext: 'Quan trọng cho thần số học',
      emoji: '🎂',
      validation: (data) => {
        const day = parseInt(data.birthDay);
        const month = parseInt(data.birthMonth);
        const year = parseInt(data.birthYear);

        return (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1990 &&
          year <= 2015
        );
      },
      errorMsg: 'Vui lòng nhập ngày sinh hợp lệ',
    },
    {
      id: 'gender',
      type: 'choice',
      question: 'Bạn là...?',
      emoji: '⚡',
      options: [
        { value: 'male', label: 'Nam', icon: '👨' },
        { value: 'female', label: 'Nữ', icon: '👩' },
        { value: 'other', label: 'Khác', icon: '✨' },
      ],
    },
    {
      id: 'likes',
      type: 'textarea',
      question: 'Điều bạn yêu thích?',
      subtext: 'Sở thích, hobbies, đam mê...',
      placeholder: 'VD: Thích code, game, indie music...',
      emoji: '💝',
      validation: (val) => val.trim().length >= 20,
      errorMsg: 'Chia sẻ ít nhất 20 ký tự nhé',
      minLength: 20,
    },
    {
      id: 'dislikes',
      type: 'textarea',
      question: 'Điều bạn không thích?',
      subtext: 'Red flags, điều làm bạn khó chịu',
      placeholder: 'VD: Ghét deadline gấp, nơi đông...',
      emoji: '😤',
      validation: (val) => val.trim().length >= 20,
      errorMsg: 'Chia sẻ ít nhất 20 ký tự nhé',
      minLength: 20,
    },
    {
      id: 'dreams',
      type: 'textarea',
      question: 'Ước mơ của bạn?',
      subtext: 'Mục tiêu, điều muốn đạt được',
      placeholder: 'VD: Founder startup, tạo impact...',
      emoji: '🌟',
      validation: (val) => val.trim().length >= 20,
      errorMsg: 'Chia sẻ ít nhất 20 ký tự nhé',
      minLength: 20,
    },
  ];

  const totalSteps = questions.length;
  const currentQuestion = questions[currentStep];

  const handleComplete = () => {
    setShowCompletion(true);
  };

  const handleNext = useCallback(() => {
    const q = currentQuestion;

    // Validate
    if (q.type === 'text' || q.type === 'textarea') {
      if (!q.validation(formData[q.id])) {
        alert(q.errorMsg);
        return;
      }
    } else if (q.type === 'date') {
      if (!q.validation(formData)) {
        alert(q.errorMsg);
        return;
      }
    } else if (q.type === 'choice') {
      if (!formData[q.id]) {
        alert('Vui lòng chọn một lựa chọn');
        return;
      }
    }

    // Next or complete
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }, [currentQuestion, currentStep, formData, totalSteps]);

  // Handle Enter key (desktop only, not in textarea)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (window.innerWidth < 768) return;
      if (document.activeElement.tagName === 'TEXTAREA') return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]);

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = async () => {
    setIsSubmitting(true);

    const personalAnswers = {
      full_name: formData.fullName,
      birth_date: `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`,
      birth_day: formData.birthDay,
      birth_month: formData.birthMonth,
      birth_year: formData.birthYear,
      gender: formData.gender,
      likes: formData.likes,
      dislikes: formData.dislikes,
      dreams: formData.dreams,
      age: new Date().getFullYear() - parseInt(formData.birthYear),
    };

    // Save all data
    Object.entries(personalAnswers).forEach(([key, value]) => {
      saveAnswer(currentModule, key, value);
    });

    const nextAnswers = {
      ...answers,
      [currentModule]: {
        ...(answers?.[currentModule] || {}),
        ...personalAnswers,
      },
    };

    // Submit test
    await submitTest(nextAnswers);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Slide variants - smoother!
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const renderQuestion = () => {
    const q = currentQuestion;

    // TEXT INPUT
    if (q.type === 'text') {
      return (
        <div className='w-full max-w-xl'>
          <input
            type='text'
            value={formData[q.id]}
            onChange={(e) => updateField(q.id, e.target.value)}
            placeholder={q.placeholder}
            autoFocus={window.innerWidth >= 768}
            className='w-full px-4 py-3 text-lg font-semibold bg-white border-2 border-gray-300 rounded-xl focus:border-emerald-500 outline-none transition-colors text-gray-900 placeholder:text-gray-400'
          />
        </div>
      );
    }

    // DATE INPUT
    if (q.type === 'date') {
      return (
        <div className='w-full max-w-md'>
          <div className='flex gap-2 justify-center'>
            <div className='flex-1'>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5'>
                Ngày
              </label>
              <input
                type='number'
                inputMode='numeric'
                value={formData.birthDay}
                onChange={(e) => updateField('birthDay', e.target.value)}
                placeholder='DD'
                min='1'
                max='31'
                autoFocus={window.innerWidth >= 768}
                className='w-full px-3 py-3 text-lg font-bold text-center bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 outline-none transition-colors'
              />
            </div>

            <div className='flex-1'>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5'>
                Tháng
              </label>
              <input
                type='number'
                inputMode='numeric'
                value={formData.birthMonth}
                onChange={(e) => updateField('birthMonth', e.target.value)}
                placeholder='MM'
                min='1'
                max='12'
                className='w-full px-3 py-3 text-lg font-bold text-center bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 outline-none transition-colors'
              />
            </div>

            <div className='flex-1'>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5'>
                Năm
              </label>
              <input
                type='number'
                inputMode='numeric'
                value={formData.birthYear}
                onChange={(e) => updateField('birthYear', e.target.value)}
                placeholder='YYYY'
                min='1990'
                max='2015'
                className='w-full px-3 py-3 text-lg font-bold text-center bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 outline-none transition-colors'
              />
            </div>
          </div>
        </div>
      );
    }

    // CHOICE - ✅ FIXED: Show selected state properly!
    if (q.type === 'choice') {
      return (
        <div className='w-full max-w-md'>
          <div className='grid grid-cols-3 gap-3'>
            {q.options.map((option) => {
              const isSelected = formData[q.id] === option.value;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    updateField(q.id, option.value);
                    // Don't auto-advance, let user confirm
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-white border-gray-300 hover:border-emerald-400 text-gray-900'
                  }`}
                >
                  <div className='text-4xl mb-2'>{option.icon}</div>
                  <div className='text-sm font-bold'>{option.label}</div>
                  {isSelected && <div className='text-xs mt-1'>✓ Đã chọn</div>}
                </motion.button>
              );
            })}
          </div>
        </div>
      );
    }

    // TEXTAREA - ✅ FIXED: No scroll, compact!
    if (q.type === 'textarea') {
      return (
        <div className='w-full max-w-xl'>
          <textarea
            value={formData[q.id]}
            onChange={(e) => updateField(q.id, e.target.value)}
            placeholder={q.placeholder}
            autoFocus={window.innerWidth >= 768}
            rows={3}
            className='w-full px-3 py-3 text-sm bg-white border-2 border-gray-300 rounded-xl focus:border-emerald-500 outline-none transition-colors text-gray-900 placeholder:text-gray-400 resize-none'
          />
          {q.minLength && (
            <div className='text-right text-xs mt-1'>
              <span
                className={
                  formData[q.id].length >= q.minLength
                    ? 'text-emerald-600 font-semibold'
                    : 'text-gray-500'
                }
              >
                {formData[q.id].length}/{q.minLength}
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <GameWrapper
        currentQuestion={currentStep + 1}
        totalQuestions={totalSteps}
        onComplete={handleComplete}
      >
        <div className='w-full flex flex-col h-full'>
          {/* Back button */}
          {currentStep > 0 && (
            <div className='mb-3'>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <svg
                  className='w-5 h-5 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </motion.button>
            </div>
          )}

          {/* Main content - NO SCROLL! */}
          <div className='flex-1 flex items-center justify-center'>
            <AnimatePresence mode='wait' custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                className='text-center w-full px-4'
              >
                {/* Emoji */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  className='text-5xl mb-3'
                >
                  {currentQuestion.emoji}
                </motion.div>

                {/* Question */}
                <div className='mb-6'>
                  <h2 className='text-lg md:text-xl font-bold text-gray-900 mb-1'>
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.subtext && (
                    <p className='text-xs text-gray-500'>
                      {currentQuestion.subtext}
                    </p>
                  )}
                </div>

                {/* Input */}
                <div className='flex justify-center'>{renderQuestion()}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom button */}
          <div className='pt-4 border-t border-gray-100'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className='w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-shadow'
            >
              {currentStep === totalSteps - 1 ? '✨ Hoàn thành' : 'Tiếp theo →'}
            </motion.button>

            {/* Hint - desktop only */}
            {currentQuestion.type !== 'choice' && (
              <div className='text-center mt-2 hidden md:block'>
                <p className='text-xs text-gray-500'>
                  <kbd className='px-1.5 py-0.5 bg-gray-200 rounded text-xs'>
                    Enter ↵
                  </kbd>{' '}
                  để tiếp tục
                </p>
              </div>
            )}
          </div>
        </div>
      </GameWrapper>

      {/* ✅ FIXED: Actually use isSubmitting! */}
      {showCompletion && (
        <CompletionCelebration
          stats={{
            time: `${Math.floor((Date.now() - startTime) / 60000)}:${(
              ((Date.now() - startTime) / 1000) %
              60
            )
              .toFixed(0)
              .padStart(2, '0')}`,
            speed: 'Thoughtful',
            streak: 6,
            badges: [
              { icon: '✨', name: 'Self Aware' },
              { icon: '🎯', name: 'Goal Oriented' },
              { icon: '💝', name: 'Open Minded' },
            ],
          }}
          onContinue={handleContinue}
          isLoading={isSubmitting}
        />
      )}
    </>
  );
}

export default PersonalInfoForm;
