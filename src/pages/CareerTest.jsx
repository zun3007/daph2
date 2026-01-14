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

  // Career Questions (10 questions)
  const questions = [
    // Industry interests
    {
      id: 'career_001',
      type: 'multiselect',
      question: 'Chọn 3 ngành nghề bạn quan tâm nhất:',
      min: 3,
      max: 3,
      options: [
        { value: 'tech', label: 'Technology/IT', icon: '💻' },
        { value: 'business', label: 'Business/Finance', icon: '💼' },
        { value: 'creative', label: 'Creative/Design', icon: '🎨' },
        { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'marketing', label: 'Marketing/Sales', icon: '📢' },
        { value: 'engineering', label: 'Engineering', icon: '⚙️' },
        { value: 'media', label: 'Media/Entertainment', icon: '🎬' },
      ],
    },

    // Work style preferences
    {
      id: 'career_002',
      type: 'swipe',
      question: 'Bạn thích làm việc:',
      optionA: {
        value: 'remote',
        icon: '🏠',
        label: 'Remote',
        description: 'Làm ở nhà, linh hoạt địa điểm',
      },
      optionB: {
        value: 'office',
        icon: '🏢',
        label: 'Office',
        description: 'Văn phòng, gặp gỡ trực tiếp',
      },
    },
    {
      id: 'career_003',
      type: 'swipe',
      question: 'Bạn muốn:',
      optionA: {
        value: 'specialist',
        icon: '🎯',
        label: 'Chuyên sâu',
        description: 'Expert trong 1 lĩnh vực',
      },
      optionB: {
        value: 'generalist',
        icon: '🌐',
        label: 'Đa dạng',
        description: 'Biết nhiều lĩnh vực khác nhau',
      },
    },

    // Company culture
    {
      id: 'career_004',
      type: 'image',
      question: 'Môi trường công ty lý tưởng:',
      options: [
        {
          value: 'corporate',
          icon: '🏢',
          label: 'Corporate',
          description: 'Chuyên nghiệp, quy trình rõ',
        },
        {
          value: 'startup',
          icon: '🚀',
          label: 'Startup',
          description: 'Năng động, sáng tạo',
        },
        {
          value: 'ngo',
          icon: '🤝',
          label: 'NGO',
          description: 'Phi lợi nhuận, ý nghĩa',
        },
        {
          value: 'freelance',
          icon: '🌍',
          label: 'Freelance',
          description: 'Độc lập, tự do',
        },
      ],
    },

    // Career goals
    {
      id: 'career_005',
      type: 'multiselect',
      question: 'Top 3 mục tiêu nghề nghiệp của bạn:',
      min: 3,
      max: 3,
      options: [
        { value: 'money', label: 'Kiếm nhiều tiền', icon: '💰' },
        { value: 'impact', label: 'Tạo tác động', icon: '🎯' },
        { value: 'growth', label: 'Phát triển bản thân', icon: '📈' },
        { value: 'balance', label: 'Work-life balance', icon: '⚖️' },
        { value: 'recognition', label: 'Được công nhận', icon: '🏆' },
        { value: 'autonomy', label: 'Độc lập/Tự chủ', icon: '🦅' },
        { value: 'learning', label: 'Học hỏi liên tục', icon: '📚' },
        { value: 'security', label: 'Ổn định/Bảo đảm', icon: '🛡️' },
      ],
    },

    // Work pace
    {
      id: 'career_006',
      type: 'swipe',
      question: 'Bạn thích nhịp làm việc:',
      optionA: {
        value: 'fast',
        icon: '⚡',
        label: 'Nhanh',
        description: 'Deadline gấp, nhiều task',
      },
      optionB: {
        value: 'steady',
        icon: '🐢',
        label: 'Ổn định',
        description: 'Từ từ, chất lượng',
      },
    },

    // Role preferences
    {
      id: 'career_007',
      type: 'image',
      question: 'Vai trò bạn muốn trong 5 năm tới:',
      options: [
        {
          value: 'ic',
          icon: '⚙️',
          label: 'Individual Contributor',
          description: 'Chuyên môn cao',
        },
        {
          value: 'manager',
          icon: '👔',
          label: 'Manager',
          description: 'Quản lý team',
        },
        {
          value: 'leader',
          icon: '👑',
          label: 'Executive',
          description: 'Lãnh đạo cấp cao',
        },
        {
          value: 'founder',
          icon: '🚀',
          label: 'Founder',
          description: 'Khởi nghiệp',
        },
      ],
    },

    // Learning style
    {
      id: 'career_008',
      type: 'multiselect',
      question: 'Chọn 3 cách học và phát triển bạn thích:',
      min: 3,
      max: 3,
      options: [
        { value: 'courses', label: 'Courses/Training', icon: '🎓' },
        { value: 'mentor', label: 'Mentorship', icon: '👨‍🏫' },
        { value: 'doing', label: 'Learning by doing', icon: '⚙️' },
        { value: 'reading', label: 'Books/Articles', icon: '📚' },
        { value: 'networking', label: 'Networking', icon: '🤝' },
        { value: 'projects', label: 'Side projects', icon: '💡' },
        { value: 'conference', label: 'Conferences', icon: '🎤' },
        { value: 'community', label: 'Communities', icon: '👥' },
      ],
    },

    // Risk appetite
    {
      id: 'career_009',
      type: 'swipe',
      question: 'Về nghề nghiệp, bạn là:',
      optionA: {
        value: 'safe',
        icon: '🛡️',
        label: 'An toàn',
        description: 'Ổn định, ít rủi ro',
      },
      optionB: {
        value: 'risk',
        icon: '🎲',
        label: 'Mạo hiểm',
        description: 'Thử thách, cơ hội lớn',
      },
    },

    // Future vision
    {
      id: 'career_010',
      type: 'image',
      question: 'Trong 10 năm, bạn muốn:',
      options: [
        {
          value: 'ceo',
          icon: '👑',
          label: 'CEO/Executive',
          description: 'Lãnh đạo tổ chức',
        },
        {
          value: 'expert',
          icon: '🎯',
          label: 'Top Expert',
          description: 'Chuyên gia hàng đầu',
        },
        {
          value: 'own_business',
          icon: '🚀',
          label: 'Own Business',
          description: 'Doanh nghiệp riêng',
        },
        {
          value: 'portfolio',
          icon: '🌈',
          label: 'Portfolio Career',
          description: 'Nhiều vai trò',
        },
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
            streak: 6,
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
