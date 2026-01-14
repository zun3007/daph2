/* eslint-disable react-hooks/purity */
import { useState } from 'react';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import {
  GameWrapper,
  CompletionCelebration,
} from '../components/ui/Gamification';
import { EmojiQuestion, SliderQuestion } from '../components/ui/QuestionType';

// ============================================
// EQ TEST MODULE
// Emotional Intelligence - empathy, self-awareness
// ============================================

function EQTest() {
  const { saveAnswer, goToNextModule, currentModule } = useTestContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [startTime] = useState(Date.now());

  // EQ Questions (15 questions)
  const questions = [
    // Self-awareness (Emoji + Scenarios)
    {
      id: 'eq_001',
      type: 'emoji',
      question: 'Bạn thường nhận ra cảm xúc của mình nhanh như thế nào?',
      options: [
        { value: 1, icon: '😵', label: 'Rất khó' },
        { value: 2, icon: '😕', label: 'Khó' },
        { value: 3, icon: '😐', label: 'Trung bình' },
        { value: 4, icon: '🤔', label: 'Khá nhanh' },
        { value: 5, icon: '🎯', label: 'Rất nhanh' },
      ],
    },
    {
      id: 'eq_002',
      type: 'slider',
      question: 'Bạn có thể điều khiển cảm xúc của mình khi giận dữ?',
      min: 1,
      max: 5,
      labels: {
        min: 'Rất khó 😤',
        max: 'Dễ dàng 😌',
      },
    },

    // Empathy scenarios
    {
      id: 'eq_003',
      type: 'scenario',
      scenario: '💔 Bạn thấy đồng nghiệp khóc trong phòng meeting. Bạn:',
      options: [
        { value: 'approach', label: 'Đến hỏi thăm', icon: '🤗' },
        { value: 'wait', label: 'Đợi họ bình tĩnh rồi hỏi', icon: '⏰' },
        { value: 'text', label: 'Nhắn tin hỏi', icon: '💬' },
        { value: 'space', label: 'Cho họ không gian riêng', icon: '🚶' },
      ],
    },
    {
      id: 'eq_004',
      type: 'emoji',
      question: 'Khi ai đó chia sẻ vấn đề với bạn, bạn thường:',
      options: [
        { value: 1, icon: '🤷', label: 'Không biết làm gì' },
        { value: 2, icon: '💡', label: 'Đưa giải pháp' },
        { value: 3, icon: '👂', label: 'Lắng nghe' },
        { value: 4, icon: '❤️', label: 'Thấu hiểu' },
        { value: 5, icon: '🤝', label: 'Cảm nhận như họ' },
      ],
    },

    // Social Skills
    {
      id: 'eq_005',
      type: 'slider',
      question: 'Bạn có dễ dàng đọc được cảm xúc người khác qua nét mặt?',
      min: 1,
      max: 5,
      labels: {
        min: 'Rất khó 😶',
        max: 'Rất dễ 👀',
      },
    },
    {
      id: 'eq_006',
      type: 'scenario',
      scenario:
        '🎭 Trong buổi gặp mặt, bạn cảm thấy ai đó không thoải mái. Bạn:',
      options: [
        { value: 'ask', label: 'Hỏi thẳng họ', icon: '🗣️' },
        { value: 'change_topic', label: 'Đổi chủ đề', icon: '💬' },
        { value: 'include', label: 'Tìm cách để họ tham gia', icon: '🤝' },
        { value: 'nothing', label: 'Không làm gì', icon: '😐' },
      ],
    },

    // Relationship Management
    {
      id: 'eq_007',
      type: 'emoji',
      question: 'Khi xung đột xảy ra, bạn cảm thấy:',
      options: [
        { value: 1, icon: '😰', label: 'Rất stress' },
        { value: 2, icon: '😟', label: 'Không thoải mái' },
        { value: 3, icon: '😐', label: 'Bình thường' },
        { value: 4, icon: '🤔', label: 'Cơ hội giải quyết' },
        { value: 5, icon: '💪', label: 'Tự tin xử lý' },
      ],
    },
    {
      id: 'eq_008',
      type: 'scenario',
      scenario: '🤝 Hai bạn trong nhóm đang tranh cãi gay gắt. Bạn:',
      options: [
        { value: 'stay_out', label: 'Không can thiệp', icon: '🤷' },
        { value: 'take_side', label: 'Ủng hộ người đúng', icon: '⚖️' },
        { value: 'mediate', label: 'Hòa giải', icon: '🤝' },
        { value: 'separate', label: 'Tách họ ra', icon: '🚪' },
      ],
    },

    // Self-motivation
    {
      id: 'eq_009',
      type: 'slider',
      question: 'Bạn có dễ dàng tự động viên bản thân khi thất bại?',
      min: 1,
      max: 5,
      labels: {
        min: 'Rất khó 😞',
        max: 'Rất dễ 💪',
      },
    },
    {
      id: 'eq_010',
      type: 'emoji',
      question: 'Khi ai đó phê bình bạn, phản ứng của bạn:',
      options: [
        { value: 1, icon: '😡', label: 'Tức giận' },
        { value: 2, icon: '😔', label: 'Buồn/tổn thương' },
        { value: 3, icon: '😐', label: 'Chấp nhận' },
        { value: 4, icon: '🤔', label: 'Suy nghĩ xem đúng không' },
        { value: 5, icon: '🙏', label: 'Biết ơn góp ý' },
      ],
    },

    // Advanced EQ
    {
      id: 'eq_011',
      type: 'scenario',
      scenario:
        '🎯 Bạn thấy leader đang stress và đưa ra quyết định vội vàng. Bạn:',
      options: [
        { value: 'nothing', label: 'Leader tự biết', icon: '🤷' },
        { value: 'ask_time', label: 'Đề nghị thêm thời gian', icon: '⏰' },
        { value: 'voice_concern', label: 'Nói lo ngại', icon: '🗣️' },
        { value: 'support_later', label: 'Hỗ trợ sau quyết định', icon: '🤝' },
      ],
    },
    {
      id: 'eq_012',
      type: 'slider',
      question: 'Bạn có thể cảm nhận được không khí trong phòng khi bước vào?',
      min: 1,
      max: 5,
      labels: {
        min: 'Không 😶',
        max: 'Rất rõ 🎭',
      },
    },

    // Emotional Expression
    {
      id: 'eq_013',
      type: 'emoji',
      question: 'Bạn dễ dàng bày tỏ cảm xúc của mình với người khác?',
      options: [
        { value: 1, icon: '🔒', label: 'Rất khó' },
        { value: 2, icon: '😶', label: 'Khó' },
        { value: 3, icon: '😐', label: 'Trung bình' },
        { value: 4, icon: '😊', label: 'Khá dễ' },
        { value: 5, icon: '🤗', label: 'Rất dễ' },
      ],
    },
    {
      id: 'eq_014',
      type: 'scenario',
      scenario: '💝 Ai đó làm điều tử tế cho bạn. Bạn:',
      options: [
        { value: 'smile', label: 'Mím cười', icon: '😊' },
        { value: 'thank', label: 'Cảm ơn', icon: '🙏' },
        { value: 'express', label: 'Bày tỏ rõ cảm xúc', icon: '💖' },
        { value: 'return', label: 'Tìm cách đáp lại', icon: '🎁' },
      ],
    },

    // Final question
    {
      id: 'eq_015',
      type: 'slider',
      question: 'Sau khi nói chuyện với bạn, người ta thường cảm thấy:',
      min: 1,
      max: 5,
      labels: {
        min: 'Như cũ 😐',
        max: 'Tốt hơn 😊',
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

    // Scenario
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
            streak: 9,
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
