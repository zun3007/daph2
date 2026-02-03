/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import {
  GameWrapper,
  CompletionCelebration,
} from '../components/ui/Gamification';
import { RapidTapQuestion, ImageQuestion } from '../components/ui/QuestionType';

// ============================================
// IQ TEST MODULE
// Pattern recognition, logic, quick thinking
// ============================================

function IQTest() {
  const { saveAnswer, goToNextModule, currentModule } = useTestContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [startTime] = useState(Date.now());

  // IQ Questions - Teen friendly
  const questions = [
    {
      id: 'iq_001',
      type: 'rapid',
      question: 'Lướt feed thấy dãy số: 2, 6, 12, 20, 30, ? Số tiếp theo là gì?',
      timeLimit: 10,
      options: [
        { value: 38, label: '38', icon: '🔢' },
        { value: 40, label: '40', icon: '🔢' },
        { value: 42, label: '42', icon: '🔢' },
        { value: 44, label: '44', icon: '🔢' },
      ],
    },
    {
      id: 'iq_002',
      type: 'image',
      question: 'Trong nhóm sticker này, cái nào khác biệt?',
      options: [
        { value: 'A', icon: '🔺', label: 'A' },
        { value: 'B', icon: '🔻', label: 'B' },
        { value: 'C', icon: '🔺', label: 'C' },
        { value: 'D', icon: '🔺', label: 'D' },
      ],
    },
    {
      id: 'iq_003',
      type: 'rapid',
      question: '5 bạn làm xong project nhóm trong 5 ngày. Nếu có 10 bạn thì mất bao lâu?',
      timeLimit: 8,
      options: [
        { value: 2.5, label: '2.5 ngày', icon: '⏰' },
        { value: 5, label: '5 ngày', icon: '⏰' },
        { value: 10, label: '10 ngày', icon: '⏰' },
        { value: 20, label: '20 ngày', icon: '⏰' },
      ],
    },
    {
      id: 'iq_004',
      type: 'image',
      question: 'So sánh size thú cưng: Chó > Mèo, Mèo > Chuột, Chuột > Vẹt. Con nào to nhất?',
      options: [
        { value: 'dog', icon: '🐕', label: 'Chó' },
        { value: 'cat', icon: '🐱', label: 'Mèo' },
        { value: 'mouse', icon: '🐭', label: 'Chuột' },
        { value: 'parrot', icon: '🦜', label: 'Vẹt' },
      ],
    },
    {
      id: 'iq_005',
      type: 'rapid',
      question: 'Game phân loại: Cái nào KHÔNG cùng nhóm?',
      timeLimit: 8,
      options: [
        { value: 'apple', label: 'Táo 🍎', icon: '🍎' },
        { value: 'banana', label: 'Chuối 🍌', icon: '🍌' },
        { value: 'carrot', label: 'Cà rốt 🥕', icon: '🥕' },
        { value: 'orange', label: 'Cam 🍊', icon: '🍊' },
      ],
    },
  ];

  const handleAnswer = (answer) => {
    const question = questions[currentQ];
    saveAnswer(currentModule, question.id, answer);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setShowCompletion(true);
  };

  const handleContinue = () => {
    goToNextModule();
  };

  const renderQuestion = () => {
    const q = questions[currentQ];

    // Rapid questions
    if (q.type === 'rapid') {
      return (
        <RapidTapQuestion
          question={q.question}
          options={q.options}
          timeLimit={q.timeLimit}
          onAnswer={handleAnswer}
        />
      );
    }

    // Image selection
    if (q.type === 'image') {
      return (
        <ImageQuestion
          question={q.question}
          options={q.options}
          onAnswer={handleAnswer}
        />
      );
    }

    // Pattern/Logic/Spatial (similar layout)
    return (
      <div className='text-center max-w-2xl mx-auto'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
          {q.question}
        </h2>

        {q.pattern && (
          <div className='bg-linear-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-8 border border-cyan-200'>
            <p className='text-3xl font-mono font-bold text-cyan-700'>
              {q.pattern}
            </p>
          </div>
        )}

        {q.hint && (
          <div className='text-sm text-gray-500 mb-6'>💡 Gợi ý: {q.hint}</div>
        )}

        <div className='grid grid-cols-2 gap-4 mt-8'>
          {q.options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className='p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-cyan-400 transition-all shadow-md hover:shadow-xl group'
            >
              <div className='text-2xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors'>
                {option.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <GameWrapper
        currentQuestion={currentQ + 1}
        totalQuestions={questions.length}
        onComplete={handleComplete}
      >
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className='w-full'
          >
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>
      </GameWrapper>

      {showCompletion && (
        <CompletionCelebration
          stats={{
            time: `${Math.floor((Date.now() - startTime) / 60000)}:${(
              ((Date.now() - startTime) / 1000) %
              60
            )
              .toFixed(0)
              .padStart(2, '0')}`,
            speed: 'Fast',
            streak: 7,
            badges: [
              { icon: '🧠', name: 'Logic Master' },
              { icon: '⚡', name: 'Quick Thinker' },
              { icon: '🎯', name: 'Pattern Pro' },
            ],
          }}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default IQTest;
