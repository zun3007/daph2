/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import {
  GameWrapper,
  CompletionCelebration,
} from '../components/ui/Gamification';

import {
  MultiSelectQuestion,
  ImageQuestion,
  SwipeQuestion,
  SliderQuestion,
  EmojiQuestion,
} from '../components/ui/QuestionType';

// ============================================
// CAREER TEST MODULE
// Career interests, work style, industry preferences
// ============================================

function CareerTest() {
  const { saveAnswer, goToNextModule, currentModule } = useTestContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [startTime] = useState(Date.now());

  // Career Questions (5 questions)
  const questions = [
    {
      id: 'career_001',
      type: 'multiselect',
      question: 'Chọn 3 ngành nghề bạn hứng thú nhất:',
      min: 3,
      max: 3,
      options: [
        { value: 'tech', label: 'Technology/IT', icon: '💻' },
        { value: 'business', label: 'Business/Finance', icon: '💼' },
        { value: 'creative', label: 'Creative/Design', icon: '🎨' },
        { value: 'healthcare', label: 'Healthcare/Medical', icon: '🏥' },
        { value: 'education', label: 'Education/Teaching', icon: '📚' },
        { value: 'marketing', label: 'Marketing/Sales', icon: '📢' },
        { value: 'engineering', label: 'Engineering', icon: '⚙️' },
        { value: 'media', label: 'Media/Content', icon: '🎬' },
      ],
    },
    {
      id: 'career_002',
      type: 'swipe',
      question: 'Bạn thích làm việc:',
      optionA: {
        value: 'remote',
        icon: '🏠',
        label: 'Remote/WFH',
        description: 'Linh hoạt thời gian & địa điểm',
      },
      optionB: {
        value: 'office',
        icon: '🏢',
        label: 'Office',
        description: 'Môi trường chuyên nghiệp, team gần',
      },
    },
    {
      id: 'career_003',
      type: 'slider',
      question: 'Lương cao vs Đam mê - Bạn ưu tiên cái nào?',
      min: 1,
      max: 5,
      labels: {
        min: 'Lương cao 💰',
        max: 'Đam mê 🔥',
      },
    },
    {
      id: 'career_004',
      type: 'emoji',
      question: 'Môi trường làm việc lý tưởng của bạn:',
      options: [
        { value: 'startup', icon: '🚀', label: 'Startup - Dynamic' },
        { value: 'corporate', icon: '🏛️', label: 'Corporate - Stable' },
        { value: 'freelance', icon: '🎨', label: 'Freelance - Freedom' },
        { value: 'ngo', icon: '🌍', label: 'NGO - Impact' },
        { value: 'government', icon: '🏢', label: 'Government - Secure' },
      ],
    },
    {
      id: 'career_005',
      type: 'multiselect',
      question: 'Top 3 giá trị quan trọng nhất trong công việc:',
      min: 3,
      max: 3,
      options: [
        { value: 'growth', label: 'Phát triển bản thân', icon: '📈' },
        { value: 'balance', label: 'Work-life balance', icon: '⚖️' },
        { value: 'impact', label: 'Tạo impact xã hội', icon: '🌟' },
        { value: 'income', label: 'Thu nhập cao', icon: '💰' },
        { value: 'recognition', label: 'Được công nhận', icon: '🏆' },
        { value: 'autonomy', label: 'Tự chủ', icon: '🎯' },
        { value: 'teamwork', label: 'Làm việc nhóm', icon: '🤝' },
        { value: 'innovation', label: 'Sáng tạo', icon: '💡' },
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

    if (q.type === 'multiselect') {
      return (
        <MultiSelectQuestion
          question={q.question}
          options={q.options}
          min={q.min}
          max={q.max}
          onAnswer={handleAnswer}
        />
      );
    }

    if (q.type === 'image') {
      return (
        <ImageQuestion
          question={q.question}
          options={q.options}
          onAnswer={handleAnswer}
        />
      );
    }

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

    // ✅ FIX: Add SliderQuestion case!
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

    // ✅ FIX: Add EmojiQuestion case!
    if (q.type === 'emoji') {
      return (
        <EmojiQuestion
          question={q.question}
          options={q.options}
          onAnswer={handleAnswer}
        />
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
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
            speed: 'Quick',
            streak: 5, // ✅ FIX: Đổi từ 6 thành 5
            badges: [
              { icon: '💼', name: 'Career Explorer' },
              { icon: '🎯', name: 'Goal Setter' },
              { icon: '🚀', name: 'Future Ready' },
            ],
          }}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default CareerTest;
