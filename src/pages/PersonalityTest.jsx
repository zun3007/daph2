/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { useTestContext } from '../contexts/TestContext.jsx';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// Question Type Components
import {
  EmojiQuestion,
  SwipeQuestion,
  SliderQuestion,
  ImageQuestion,
  RapidTapQuestion,
  MultiSelectQuestion,
} from '../components/ui/QuestionType.jsx';

// Gamification
import {
  GameWrapper,
  CompletionCelebration,
} from '../components/ui/Gamification.jsx';

// ============================================
// PERSONALITY TEST MODULE
// ============================================

function PersonalityTest() {
  const { saveAnswer, goToNextModule, currentModule } = useTestContext();

  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [startTime] = useState(Date.now());

  // ============================================
  // QUESTIONS - Mix of different types!
  // ============================================

  const questions = [
    // WARM-UP: Emoji Questions (Fast & Fun!)
    {
      id: 'pers_001',
      type: 'emoji',
      question: 'Cảm giác của bạn về việc gặp gỡ người mới?',
      options: [
        { value: 1, icon: '😱', label: 'Sợ lắm!' },
        { value: 2, icon: '😬', label: 'Hơi lo' },
        { value: 3, icon: '😐', label: 'Bình thường' },
        { value: 4, icon: '😊', label: 'Thích' },
        { value: 5, icon: '😍', label: 'Yêu thích!' },
      ],
    },
    {
      id: 'pers_002',
      type: 'emoji',
      question: 'Làm việc nhóm vs làm việc một mình?',
      options: [
        { value: 1, icon: '😴', label: 'Nhóm = boring' },
        { value: 2, icon: '😐', label: 'OK với nhóm' },
        { value: 3, icon: '😊', label: 'Thích nhóm' },
        { value: 4, icon: '😁', label: 'Yêu làm nhóm' },
        { value: 5, icon: '🤩', label: 'Team player 100%' },
      ],
    },
    {
      id: 'pers_003',
      type: 'emoji',
      question: 'Party cuối tuần - bạn cảm thấy thế nào?',
      options: [
        { value: 1, icon: '😫', label: 'Mệt mỏi' },
        { value: 2, icon: '🥱', label: 'Chán' },
        { value: 3, icon: '😐', label: 'OK' },
        { value: 4, icon: '😆', label: 'Vui' },
        { value: 5, icon: '🥳', label: 'Party time!' },
      ],
    },

    // CORE: Swipe Cards (Tinder-style for major traits)
    {
      id: 'pers_004',
      type: 'swipe',
      question: 'Which describes you better?',
      optionA: {
        value: 'introvert',
        icon: '🏠',
        label: 'Introvert',
        description: 'Recharge alone, deep conversations',
      },
      optionB: {
        value: 'extrovert',
        icon: '🎉',
        label: 'Extrovert',
        description: 'Energized by people, social butterfly',
      },
    },
    {
      id: 'pers_005',
      type: 'swipe',
      question: 'Khi đưa ra quyết định...',
      optionA: {
        value: 'thinking',
        icon: '🧠',
        label: 'Logic',
        description: 'Phân tích, lý trí, khách quan',
      },
      optionB: {
        value: 'feeling',
        icon: '❤️',
        label: 'Cảm xúc',
        description: 'Cảm nhận, giá trị, con người',
      },
    },

    // MIX: Image Selection (Visual preferences)
    {
      id: 'pers_006',
      type: 'image',
      question: 'Môi trường làm việc lý tưởng của bạn?',
      options: [
        {
          value: 'office',
          icon: '🏢',
          label: 'Office',
          description: 'Văn phòng chuyên nghiệp',
        },
        {
          value: 'cafe',
          icon: '☕',
          label: 'Cafe',
          description: 'Linh hoạt, sáng tạo',
        },
        {
          value: 'home',
          icon: '🏠',
          label: 'Remote',
          description: 'Làm từ nhà thoải mái',
        },
        {
          value: 'outdoor',
          icon: '🌳',
          label: 'Outdoor',
          description: 'Ngoài trời, năng động',
        },
      ],
    },

    // SLIDER: Nuanced measurement
    {
      id: 'pers_007',
      type: 'slider',
      question: 'Bạn là người chi tiết hay big picture?',
      min: 1,
      max: 5,
      labels: {
        min: 'Chi tiết 🔍',
        max: 'Big Picture 🌏',
      },
    },
    {
      id: 'pers_008',
      type: 'slider',
      question: 'Lập kế hoạch vs Spontaneous?',
      min: 1,
      max: 5,
      labels: {
        min: 'Kế hoạch 📋',
        max: 'Tự phát 🎲',
      },
    },

    // RAPID TAP: Quick reactions
    {
      id: 'pers_009',
      type: 'rapid',
      question: 'Cuối tuần bạn thích làm gì?',
      timeLimit: 5,
      options: [
        { value: 'social', label: 'Hang out' },
        { value: 'relax', label: 'Chill ở nhà' },
        { value: 'adventure', label: 'Khám phá' },
        { value: 'learn', label: 'Học thứ mới' },
      ],
    },

    // MULTI-SELECT: Interests & Values
    {
      id: 'pers_010',
      type: 'multiselect',
      question: 'Top 3 giá trị quan trọng với bạn?',
      min: 3,
      max: 3,
      options: [
        { value: 'freedom', label: 'Tự do', icon: '🕊️' },
        { value: 'security', label: 'Ổn định', icon: '🛡️' },
        { value: 'growth', label: 'Phát triển', icon: '📈' },
        { value: 'connection', label: 'Kết nối', icon: '🤝' },
        { value: 'creativity', label: 'Sáng tạo', icon: '🎨' },
        { value: 'impact', label: 'Tác động', icon: '💪' },
        { value: 'balance', label: 'Cân bằng', icon: '⚖️' },
        { value: 'adventure', label: 'Phiêu lưu', icon: '🌍' },
      ],
    },

    // MORE QUESTIONS...
    {
      id: 'pers_011',
      type: 'emoji',
      question: 'Speaking in public - how do you feel?',
      options: [
        { value: 1, icon: '😱' },
        { value: 2, icon: '😰' },
        { value: 3, icon: '😐' },
        { value: 4, icon: '😊' },
        { value: 5, icon: '🤩' },
      ],
    },
    {
      id: 'pers_012',
      type: 'slider',
      question: 'Risk-taker vs Play it safe?',
      min: 1,
      max: 5,
      labels: {
        min: 'Safe 🛡️',
        max: 'Risk 🎲',
      },
    },
    {
      id: 'pers_013',
      type: 'image',
      question: 'Your ideal weekend looks like...',
      options: [
        { value: 'party', icon: '🎉', label: 'Party!' },
        { value: 'nature', icon: '🏔️', label: 'Nature' },
        { value: 'home', icon: '🏠', label: 'Home' },
        { value: 'city', icon: '🌆', label: 'City' },
      ],
    },
    {
      id: 'pers_014',
      type: 'swipe',
      question: 'Your communication style...',
      optionA: {
        value: 'direct',
        icon: '🎯',
        label: 'Direct',
        description: 'Straight to the point',
      },
      optionB: {
        value: 'diplomatic',
        icon: '🤝',
        label: 'Diplomatic',
        description: 'Careful with words',
      },
    },
    {
      id: 'pers_015',
      type: 'rapid',
      question: 'First thing you do in the morning?',
      timeLimit: 5,
      options: [
        { value: 'check_phone', label: '📱 Check phone' },
        { value: 'exercise', label: '💪 Exercise' },
        { value: 'coffee', label: '☕ Coffee' },
        { value: 'meditate', label: '🧘 Meditate' },
      ],
    },

    // FINAL QUESTIONS
    {
      id: 'pers_016',
      type: 'slider',
      question: 'Compete vs Collaborate?',
      min: 1,
      max: 5,
      labels: {
        min: 'Compete 🏆',
        max: 'Collaborate 🤝',
      },
    },
    {
      id: 'pers_017',
      type: 'multiselect',
      question: 'Your top strengths? (Pick 3)',
      min: 3,
      max: 3,
      options: [
        { value: 'analytical', label: 'Analytical', icon: '🔍' },
        { value: 'creative', label: 'Creative', icon: '🎨' },
        { value: 'leadership', label: 'Leadership', icon: '👑' },
        { value: 'empathy', label: 'Empathy', icon: '❤️' },
        { value: 'organized', label: 'Organized', icon: '📋' },
        { value: 'adaptable', label: 'Adaptable', icon: '🔄' },
        { value: 'communicator', label: 'Communicator', icon: '💬' },
        { value: 'problem_solver', label: 'Problem Solver', icon: '🧩' },
      ],
    },
    {
      id: 'pers_018',
      type: 'emoji',
      question: 'Change & new experiences?',
      options: [
        { value: 1, icon: '😨' },
        { value: 2, icon: '😬' },
        { value: 3, icon: '😐' },
        { value: 4, icon: '😃' },
        { value: 5, icon: '🤩' },
      ],
    },
    {
      id: 'pers_019',
      type: 'rapid',
      question: 'If you won $1M, first thing you do?',
      timeLimit: 5,
      options: [
        { value: 'invest', label: '💰 Invest' },
        { value: 'travel', label: '✈️ Travel' },
        { value: 'family', label: '👨‍👩‍👧 Family' },
        { value: 'business', label: '🚀 Start business' },
      ],
    },
    {
      id: 'pers_020',
      type: 'slider',
      question: 'Following trends vs Setting trends?',
      min: 1,
      max: 5,
      labels: {
        min: 'Follow 👥',
        max: 'Lead 🚀',
      },
    },
  ];

  // ============================================
  // HANDLERS
  // ============================================

  const handleAnswer = (answer) => {
    const question = questions[currentQ];

    // Save to context
    saveAnswer(currentModule, question.id, answer);

    // Move to next question or complete
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Module complete!
      handleComplete();
    }
  };

  const handleComplete = () => {
    setShowCompletion(true);
  };

  const handleContinue = () => {
    goToNextModule();
  };

  // ============================================
  // RENDER QUESTION
  // ============================================

  const renderQuestion = () => {
    const q = questions[currentQ];

    switch (q.type) {
      case 'emoji':
        return (
          <EmojiQuestion
            question={q.question}
            options={q.options}
            onAnswer={handleAnswer}
          />
        );

      case 'swipe':
        return (
          <SwipeQuestion
            question={q.question}
            optionA={q.optionA}
            optionB={q.optionB}
            onAnswer={handleAnswer}
          />
        );

      case 'slider':
        return (
          <SliderQuestion
            question={q.question}
            min={q.min}
            max={q.max}
            labels={q.labels}
            onAnswer={handleAnswer}
          />
        );

      case 'image':
        return (
          <ImageQuestion
            question={q.question}
            options={q.options}
            onAnswer={handleAnswer}
          />
        );

      case 'rapid':
        return (
          <RapidTapQuestion
            question={q.question}
            options={q.options}
            timeLimit={q.timeLimit}
            onAnswer={handleAnswer}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectQuestion
            question={q.question}
            options={q.options}
            min={q.min}
            max={q.max}
            onAnswer={handleAnswer}
          />
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  // ============================================
  // RENDER
  // ============================================

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

      {/* Completion Celebration */}
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
            streak: 10,
            badges: [
              { icon: '🎭', name: 'Personality Pro' },
              { icon: '⚡', name: 'Speed Demon' },
              { icon: '🔥', name: 'On Fire!' },
            ],
          }}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default PersonalityTest;
