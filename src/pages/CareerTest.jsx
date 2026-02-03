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

  // Career Questions - Teen friendly
  const questions = [
    {
      id: 'career_001',
      type: 'multiselect',
      question: 'Chọn 3 lĩnh vực bạn thấy hứng thú nhất:',
      min: 3,
      max: 3,
      options: [
        { value: 'tech', label: 'Công nghệ (code, AI, game)', icon: '💻' },
        { value: 'business', label: 'Kinh doanh (bán hàng, quản lý)', icon: '💼' },
        { value: 'creative', label: 'Sáng tạo (thiết kế, vẽ, film)', icon: '🎨' },
        { value: 'healthcare', label: 'Y tế (bác sĩ, dược, chăm sóc)', icon: '🏥' },
        { value: 'education', label: 'Giáo dục (dạy học, đào tạo)', icon: '📚' },
        { value: 'marketing', label: 'Marketing (quảng cáo, TikTok)', icon: '📢' },
        { value: 'engineering', label: 'Kỹ thuật (xây dựng, cơ khí)', icon: '⚙️' },
        { value: 'media', label: 'Media (content, báo chí, YouTube)', icon: '🎬' },
      ],
    },
    {
      id: 'career_002',
      type: 'swipe',
      question: 'Bạn thích làm việc ở đâu hơn?',
      optionA: {
        value: 'remote',
        icon: '🏠',
        label: 'Ở nhà, quán cafe, bất cứ đâu',
        description: 'Tự do chọn nơi làm việc',
      },
      optionB: {
        value: 'office',
        icon: '🏢',
        label: 'Văn phòng, có team xung quanh',
        description: 'Làm việc cùng mọi người',
      },
    },
    {
      id: 'career_003',
      type: 'slider',
      question: 'Nếu phải chọn: Lương cao hay làm điều mình thích?',
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
      question: 'Bạn thích môi trường làm việc kiểu nào?',
      options: [
        { value: 'startup', icon: '🚀', label: 'Năng động, thay đổi liên tục' },
        { value: 'corporate', icon: '🏛️', label: 'Ổn định, có lộ trình rõ' },
        { value: 'freelance', icon: '🎨', label: 'Tự do, tự quyết mọi thứ' },
        { value: 'ngo', icon: '🌍', label: 'Giúp đời, tạo ảnh hưởng' },
        { value: 'government', icon: '🏢', label: 'Nhà nước, ổn định lâu dài' },
      ],
    },
    {
      id: 'career_005',
      type: 'multiselect',
      question: 'Top 3 điều bạn coi trọng nhất khi đi làm:',
      min: 3,
      max: 3,
      options: [
        { value: 'growth', label: 'Phát triển bản thân', icon: '📈' },
        { value: 'balance', label: 'Cân bằng học tập & vui chơi', icon: '⚖️' },
        { value: 'impact', label: 'Giúp ích cho xã hội', icon: '🌟' },
        { value: 'income', label: 'Thu nhập cao', icon: '💰' },
        { value: 'recognition', label: 'Được công nhận', icon: '🏆' },
        { value: 'autonomy', label: 'Tự chủ, tự quyết', icon: '🎯' },
        { value: 'teamwork', label: 'Làm việc nhóm vui vẻ', icon: '🤝' },
        { value: 'innovation', label: 'Được sáng tạo', icon: '💡' },
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
