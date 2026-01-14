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
  SliderQuestion,
  ImageQuestion,
} from '../components/ui/QuestionType';

// ============================================
// IKIGAI TEST MODULE
// Finding purpose: What you love, what you're good at,
// what the world needs, what you can be paid for
// ============================================

function IkigaiTest() {
  const { saveAnswer, goToNextModule, currentModule } = useTestContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [startTime] = useState(Date.now());

  // Ikigai Questions (16 questions)
  const questions = [
    // What you LOVE (Passion)
    {
      id: 'ikigai_001',
      type: 'multiselect',
      question:
        'Chọn 3 hoạt động bạn thích làm nhất (ngay cả không được trả lương):',
      min: 3,
      max: 3,
      options: [
        { value: 'create', label: 'Sáng tạo', icon: '🎨' },
        { value: 'help', label: 'Giúp đỡ người khác', icon: '🤝' },
        { value: 'analyze', label: 'Phân tích dữ liệu', icon: '📊' },
        { value: 'teach', label: 'Dạy/Chia sẻ', icon: '👨‍🏫' },
        { value: 'build', label: 'Xây dựng/Làm đồ', icon: '🔨' },
        { value: 'organize', label: 'Tổ chức sự kiện', icon: '📋' },
        { value: 'write', label: 'Viết/Kể chuyện', icon: '✍️' },
        { value: 'solve', label: 'Giải quyết vấn đề', icon: '🧩' },
      ],
    },
    {
      id: 'ikigai_002',
      type: 'slider',
      question:
        'Bạn có thường "mất" cảm giác thời gian khi làm điều bạn yêu thích?',
      min: 1,
      max: 5,
      labels: {
        min: 'Hiếm khi 😐',
        max: 'Thường xuyên 🔥',
      },
    },
    {
      id: 'ikigai_003',
      type: 'image',
      question: 'Nếu có 1 năm tự do, bạn muốn làm gì?',
      options: [
        {
          value: 'travel',
          icon: '✈️',
          label: 'Du lịch',
          description: 'Khám phá thế giới',
        },
        {
          value: 'learn',
          icon: '📚',
          label: 'Học tập',
          description: 'Nâng cao kỹ năng',
        },
        {
          value: 'create',
          icon: '🎨',
          label: 'Sáng tạo',
          description: 'Làm project cá nhân',
        },
        {
          value: 'volunteer',
          icon: '🤝',
          label: 'Tình nguyện',
          description: 'Giúp cộng đồng',
        },
      ],
    },

    // What you're GOOD AT (Vocation)
    {
      id: 'ikigai_004',
      type: 'multiselect',
      question: 'Chọn 3 kỹ năng bạn giỏi nhất:',
      min: 3,
      max: 3,
      options: [
        { value: 'communication', label: 'Giao tiếp', icon: '💬' },
        { value: 'technical', label: 'Kỹ thuật', icon: '💻' },
        { value: 'creative', label: 'Sáng tạo', icon: '🎨' },
        { value: 'leadership', label: 'Lãnh đạo', icon: '👑' },
        { value: 'analytical', label: 'Phân tích', icon: '🔍' },
        { value: 'planning', label: 'Lập kế hoạch', icon: '📋' },
        { value: 'empathy', label: 'Thấu hiểu', icon: '❤️' },
        { value: 'selling', label: 'Thuyết phục', icon: '🎯' },
      ],
    },
    {
      id: 'ikigai_005',
      type: 'slider',
      question: 'Người khác có thường xin bạn giúp về lĩnh vực bạn giỏi?',
      min: 1,
      max: 5,
      labels: {
        min: 'Hiếm khi 😐',
        max: 'Thường xuyên 🌟',
      },
    },
    {
      id: 'ikigai_006',
      type: 'image',
      question: 'Bạn học nhanh nhất khi:',
      options: [
        {
          value: 'doing',
          icon: '⚙️',
          label: 'Thực hành',
          description: 'Học bằng làm',
        },
        {
          value: 'reading',
          icon: '📖',
          label: 'Đọc',
          description: 'Tự nghiên cứu',
        },
        {
          value: 'watching',
          icon: '👀',
          label: 'Quan sát',
          description: 'Xem người khác',
        },
        {
          value: 'teaching',
          icon: '👥',
          label: 'Dạy lại',
          description: 'Giải thích cho ai đó',
        },
      ],
    },

    // What the world NEEDS (Mission)
    {
      id: 'ikigai_007',
      type: 'multiselect',
      question: 'Chọn 3 vấn đề bạn muốn giải quyết nhất:',
      min: 3,
      max: 3,
      options: [
        { value: 'education', label: 'Giáo dục', icon: '📚' },
        { value: 'environment', label: 'Môi trường', icon: '🌍' },
        { value: 'health', label: 'Sức khỏe', icon: '🏥' },
        { value: 'poverty', label: 'Nghèo đói', icon: '🤝' },
        { value: 'technology', label: 'Công nghệ', icon: '💻' },
        { value: 'mental', label: 'Tâm lý', icon: '🧠' },
        { value: 'inequality', label: 'Bất bình đẳng', icon: '⚖️' },
        { value: 'innovation', label: 'Đổi mới', icon: '💡' },
      ],
    },
    {
      id: 'ikigai_008',
      type: 'slider',
      question: 'Việc làm của bạn có ý nghĩa quan trọng như thế nào?',
      min: 1,
      max: 5,
      labels: {
        min: 'Có ích cho mình 👤',
        max: 'Thay đổi thế giới 🌍',
      },
    },
    {
      id: 'ikigai_009',
      type: 'image',
      question: 'Bạn muốn được nhớ đến như:',
      options: [
        {
          value: 'innovator',
          icon: '💡',
          label: 'Người đổi mới',
          description: 'Sáng tạo breakthrough',
        },
        {
          value: 'helper',
          icon: '🤝',
          label: 'Người giúp đỡ',
          description: 'Hỗ trợ nhiều người',
        },
        {
          value: 'expert',
          icon: '🎓',
          label: 'Chuyên gia',
          description: 'Bậc thầy lĩnh vực',
        },
        {
          value: 'leader',
          icon: '👑',
          label: 'Người lãnh đạo',
          description: 'Dẫn dắt cộng đồng',
        },
      ],
    },

    // What you can be PAID FOR (Profession)
    {
      id: 'ikigai_010',
      type: 'multiselect',
      question: 'Chọn 3 yếu tố quan trọng nhất trong công việc:',
      min: 3,
      max: 3,
      options: [
        { value: 'salary', label: 'Lương cao', icon: '💰' },
        { value: 'growth', label: 'Phát triển', icon: '📈' },
        { value: 'flexibility', label: 'Linh hoạt', icon: '🕐' },
        { value: 'stability', label: 'Ổn định', icon: '🛡️' },
        { value: 'impact', label: 'Tác động', icon: '🎯' },
        { value: 'creativity', label: 'Sáng tạo', icon: '🎨' },
        { value: 'team', label: 'Đội nhóm tốt', icon: '👥' },
        { value: 'learning', label: 'Học hỏi', icon: '📚' },
      ],
    },
    {
      id: 'ikigai_011',
      type: 'slider',
      question: 'Quan trọng hơn: Passion hay Income?',
      min: 1,
      max: 5,
      labels: {
        min: 'Income 💰',
        max: 'Passion ❤️',
      },
    },
    {
      id: 'ikigai_012',
      type: 'image',
      question: 'Định nghĩa thành công của bạn:',
      options: [
        {
          value: 'wealth',
          icon: '💎',
          label: 'Giàu có',
          description: 'Tự do tài chính',
        },
        {
          value: 'recognition',
          icon: '🏆',
          label: 'Được công nhận',
          description: 'Danh tiếng, ảnh hưởng',
        },
        {
          value: 'happiness',
          icon: '😊',
          label: 'Hạnh phúc',
          description: 'Làm điều yêu thích',
        },
        {
          value: 'contribution',
          icon: '🌟',
          label: 'Đóng góp',
          description: 'Giúp ích xã hội',
        },
      ],
    },

    // Integration & Balance
    {
      id: 'ikigai_013',
      type: 'slider',
      question: 'Bạn sẵn sàng hy sinh thu nhập để làm việc có ý nghĩa?',
      min: 1,
      max: 5,
      labels: {
        min: 'Không 💰',
        max: 'Có ❤️',
      },
    },
    {
      id: 'ikigai_014',
      type: 'image',
      question: 'Công việc lý tưởng của bạn:',
      options: [
        {
          value: 'corporate',
          icon: '🏢',
          label: 'Tập đoàn',
          description: 'Ổn định, phát triển',
        },
        {
          value: 'startup',
          icon: '🚀',
          label: 'Startup',
          description: 'Sáng tạo, nhanh',
        },
        {
          value: 'freelance',
          icon: '🌍',
          label: 'Freelance',
          description: 'Tự do, linh hoạt',
        },
        {
          value: 'social',
          icon: '🤝',
          label: 'Tổ chức XH',
          description: 'Ý nghĩa, đóng góp',
        },
      ],
    },
    {
      id: 'ikigai_015',
      type: 'slider',
      question:
        'Công việc hiện tại (hoặc tương lai) có align với ikigai của bạn?',
      min: 1,
      max: 5,
      labels: {
        min: 'Không 😐',
        max: 'Hoàn toàn 🎯',
      },
    },

    // Final vision
    {
      id: 'ikigai_016',
      type: 'image',
      question: 'Trong 10 năm tới, bạn thấy mình:',
      options: [
        {
          value: 'expert',
          icon: '🎓',
          label: 'Chuyên gia hàng đầu',
          description: 'Master in field',
        },
        {
          value: 'entrepreneur',
          icon: '🚀',
          label: 'Doanh nhân',
          description: 'Xây dựng business',
        },
        {
          value: 'leader',
          icon: '👑',
          label: 'Lãnh đạo cấp cao',
          description: 'Executive position',
        },
        {
          value: 'changemaker',
          icon: '🌍',
          label: 'Người tạo thay đổi',
          description: 'Social impact',
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

    if (q.type === 'image') {
      return (
        <ImageQuestion
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
            speed: 'Thoughtful',
            streak: 10,
            badges: [
              { icon: '🌟', name: 'Purpose Seeker' },
              { icon: '🎯', name: 'Mission Clear' },
              { icon: '💫', name: 'Ikigai Explorer' },
            ],
          }}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default IkigaiTest;
