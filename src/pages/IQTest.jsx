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

  // IQ Questions (12 questions - shorter but more challenging)
  const questions = [
    // Pattern Recognition
    {
      id: 'iq_001',
      type: 'pattern',
      question: 'Tìm số tiếp theo trong dãy:',
      pattern: '2, 4, 8, 16, 32, ?',
      options: [
        { value: '48', label: '48' },
        { value: '64', label: '64' },
        { value: '52', label: '52' },
        { value: '128', label: '128' },
      ],
    },
    {
      id: 'iq_002',
      type: 'pattern',
      question: 'Số nào không cùng nhóm?',
      pattern: '3, 6, 9, 12, 14, 18',
      options: [
        { value: '3', label: '3' },
        { value: '14', label: '14' },
        { value: '12', label: '12' },
        { value: '18', label: '18' },
      ],
    },

    // Logic Puzzles
    {
      id: 'iq_003',
      type: 'logic',
      question: 'Nếu A = 1, B = 2, C = 3... thì "CAT" = ?',
      options: [
        { value: '24', label: '24' },
        { value: '25', label: '25' },
        { value: '23', label: '23' },
        { value: '26', label: '26' },
      ],
    },
    {
      id: 'iq_004',
      type: 'logic',
      question:
        '3 con mèo bắt 3 con chuột trong 3 phút. 100 con mèo bắt 100 con chuột mất bao lâu?',
      options: [
        { value: '3', label: '3 phút' },
        { value: '100', label: '100 phút' },
        { value: '33', label: '33 phút' },
        { value: '300', label: '300 phút' },
      ],
    },

    // Visual Pattern
    {
      id: 'iq_005',
      type: 'image',
      question: 'Hình nào hoàn thành pattern?',
      options: [
        { value: 'a', icon: '△', label: 'A' },
        { value: 'b', icon: '□', label: 'B' },
        { value: 'c', icon: '○', label: 'C' },
        { value: 'd', icon: '◇', label: 'D' },
      ],
    },

    // Quick Math
    {
      id: 'iq_006',
      type: 'rapid',
      question: '25% của 80 = ?',
      timeLimit: 10,
      options: [
        { value: '15', label: '15' },
        { value: '20', label: '20' },
        { value: '25', label: '25' },
        { value: '30', label: '30' },
      ],
    },
    {
      id: 'iq_007',
      type: 'rapid',
      question: '7 × 8 + 12 = ?',
      timeLimit: 8,
      options: [
        { value: '68', label: '68' },
        { value: '62', label: '62' },
        { value: '56', label: '56' },
        { value: '70', label: '70' },
      ],
    },

    // Word Logic
    {
      id: 'iq_008',
      type: 'logic',
      question: 'LISTEN có cùng chữ cái với từ nào?',
      options: [
        { value: 'SILENT', label: 'SILENT' },
        { value: 'LISTEN', label: 'LISTEN' },
        { value: 'TALKING', label: 'TALKING' },
        { value: 'SOUND', label: 'SOUND' },
      ],
    },

    // Spatial Reasoning
    {
      id: 'iq_009',
      type: 'spatial',
      question: 'Nếu gấp hình vuông theo đường chéo 2 lần, ta được hình gì?',
      options: [
        { value: 'triangle', label: '△ Tam giác' },
        { value: 'rectangle', label: '▭ Chữ nhật' },
        { value: 'circle', label: '○ Tròn' },
        { value: 'square_small', label: '□ Vuông nhỏ' },
      ],
    },

    // Quick Thinking
    {
      id: 'iq_010',
      type: 'rapid',
      question:
        'Trong 1 phòng có 4 góc. Mỗi góc có 1 con mèo. Trước mỗi con mèo có 3 con mèo. Có bao nhiêu con mèo?',
      timeLimit: 15,
      options: [
        { value: '4', label: '4 con' },
        { value: '12', label: '12 con' },
        { value: '16', label: '16 con' },
        { value: '7', label: '7 con' },
      ],
    },

    // Pattern completion
    {
      id: 'iq_011',
      type: 'pattern',
      question: 'Hoàn thành: AB, CD, EF, GH, ?',
      pattern: 'Tìm cặp tiếp theo',
      options: [
        { value: 'IJ', label: 'IJ' },
        { value: 'HI', label: 'HI' },
        { value: 'JK', label: 'JK' },
        { value: 'IK', label: 'IK' },
      ],
    },

    // Final challenge
    {
      id: 'iq_012',
      type: 'logic',
      question: 'Nếu 1=3, 2=3, 3=5, 4=4, 5=4, thì 6=?',
      hint: 'Đếm số chữ cái',
      options: [
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
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
