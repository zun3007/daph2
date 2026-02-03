/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import {
  GameWrapper,
  CompletionCelebration,
} from '../components/ui/Gamification';
// ✅ FIX: Add SwipeQuestion to imports!
import {
  EmojiQuestion,
  SliderQuestion,
  SwipeQuestion,
} from '../components/ui/QuestionType';

// ============================================
// EQ TEST MODULE
// Emotional Intelligence - empathy, self-awareness
// ============================================

function EQTest() {
  const { saveAnswer, goToNextModule, currentModule } = useTestContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [startTime] = useState(Date.now());

  // EQ Questions - Teen friendly
  const questions = [
    {
      id: 'eq_001',
      type: 'emoji',
      question:
        'Bạn đang thuyết trình trước lớp và có bạn comment chê. Bạn cảm thấy:',
      options: [
        { value: 1, icon: '😤', label: 'Tức giận' },
        { value: 2, icon: '😕', label: 'Bị tổn thương' },
        { value: 3, icon: '🤔', label: 'Tò mò tại sao' },
        { value: 4, icon: '😌', label: 'Bình tĩnh lắng nghe' },
        { value: 5, icon: '🙏', label: 'Cảm ơn góp ý' },
      ],
    },
    {
      id: 'eq_002',
      type: 'swipe',
      question: 'Bạn thấy bạn thân khóc trong toilet trường. Bạn sẽ:',
      optionA: {
        value: 'space',
        label: '🚶 Cho bạn không gian',
        icon: '🚶',
        description: 'Để bạn tự bình tĩnh lại',
      },
      optionB: {
        value: 'approach',
        label: '🤗 Đến hỏi thăm ngay',
        icon: '🤗',
        description: 'Lắng nghe và ở bên bạn',
      },
    },
    {
      id: 'eq_003',
      type: 'slider',
      question: 'Bạn có dễ nhận ra khi bạn bè đang buồn dù họ vẫn cười?',
      min: 1,
      max: 5,
      labels: {
        min: 'Rất khó 😶',
        max: 'Rất dễ 👁️',
      },
    },
    {
      id: 'eq_004',
      type: 'emoji',
      question: 'Khi bị thua game lúc sắp thắng, bạn thường:',
      options: [
        { value: 1, icon: '💥', label: 'Bùng nổ luôn' },
        { value: 2, icon: '😤', label: 'Khó kiềm chế' },
        { value: 3, icon: '😐', label: 'Hơi bực nhưng ok' },
        { value: 4, icon: '😌', label: 'Chill, game thôi mà' },
        { value: 5, icon: '🧘', label: 'Bình thường, chơi lại' },
      ],
    },
    {
      id: 'eq_005',
      type: 'swipe',
      question: 'Bạn thân vô tình nói điều làm bạn buồn. Bạn sẽ:',
      optionA: {
        value: 'confront',
        label: '💬 Nói thẳng luôn',
        icon: '💬',
        description: 'Nói rõ để bạn hiểu',
      },
      optionB: {
        value: 'process',
        label: '🤔 Suy nghĩ trước đã',
        icon: '🤔',
        description: 'Bình tĩnh rồi mới nói',
      },
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

    if (q.type === 'emoji') {
      return (
        <EmojiQuestion
          question={q.question}
          options={q.options}
          onAnswer={handleAnswer}
        />
      );
    }

    if (q.type === 'slider') {
      return (
        <SliderQuestion
          question={q.question}
          min={q.min}
          max={q.max}
          labels={q.labels}
          onAnswer={handleAnswer}
        />
      );
    }

    // ✅ FIX: Add SwipeQuestion case!
    if (q.type === 'swipe') {
      return (
        <SwipeQuestion
          question={q.question}
          optionA={q.optionA}
          optionB={q.optionB}
          onAnswer={handleAnswer}
        />
      );
    }

    // Scenario (if needed later)
    if (q.type === 'scenario') {
      return (
        <div className='text-center max-w-3xl mx-auto'>
          <div className='bg-linear-to-r from-pink-50 to-red-50 rounded-2xl p-6 mb-8 border border-pink-200'>
            <p className='text-lg text-gray-800 leading-relaxed'>
              {q.scenario}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {q.options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className='p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-pink-400 transition-all text-left shadow-md hover:shadow-xl group'
              >
                <div className='flex items-start gap-4'>
                  <div className='text-4xl group-hover:scale-110 transition-transform'>
                    {option.icon}
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-900'>
                      {option.label}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    return null;
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
            speed: 'Thoughtful',
            streak: 5,
            badges: [
              { icon: '💝', name: 'Empathy Expert' },
              { icon: '🎭', name: 'Emotion Reader' },
              { icon: '🤝', name: 'Connection Master' },
            ],
          }}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default EQTest;
