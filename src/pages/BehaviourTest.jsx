import { useState } from 'react';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import {
  GameWrapper,
  CompletionCelebration,
} from '../components/ui/Gamification';
import { EmojiQuestion, ImageQuestion } from '../components/ui/QuestionType';

// ============================================
// BEHAVIOR TEST MODULE
// Scenario-based, real-life situations
// ============================================

function BehaviorTest() {
  const { saveAnswer, goToNextModule, currentModule } = useTestContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  // eslint-disable-next-line react-hooks/purity
  const [startTime] = useState(Date.now());

  // Scenario-based questions (15 questions)
  const questions = [
    // Scenario Questions (Real-life situations)
    {
      id: 'behav_001',
      type: 'scenario',
      scenario:
        '🎯 Trong một cuộc họp nhóm, bạn nhận ra kế hoạch hiện tại có vấn đề nghiêm trọng nhưng mọi người dường như đồng ý. Bạn sẽ:',
      options: [
        { value: 'speak_up', label: 'Lên tiếng ngay lập tức', icon: '🗣️' },
        {
          value: 'wait_private',
          label: 'Đợi sau và nói riêng với leader',
          icon: '💬',
        },
        {
          value: 'suggest_review',
          label: 'Đề xuất review lại một lần nữa',
          icon: '🔍',
        },
        { value: 'go_along', label: 'Theo đa số, có thể mình sai', icon: '👥' },
      ],
    },
    {
      id: 'behav_002',
      type: 'scenario',
      scenario:
        '⏰ Deadline đang đến gần, nhưng công việc chưa xong. Đồng nghiệp cần giúp đỡ khẩn cấp. Bạn:',
      options: [
        { value: 'help_first', label: 'Giúp ngay, mình lo sau', icon: '🤝' },
        {
          value: 'finish_mine',
          label: 'Hoàn thành việc mình trước',
          icon: '✅',
        },
        {
          value: 'split_time',
          label: 'Chia thời gian giúp cả hai',
          icon: '⚖️',
        },
        { value: 'ask_leader', label: 'Hỏi leader xem ưu tiên gì', icon: '👔' },
      ],
    },
    {
      id: 'behav_003',
      type: 'scenario',
      scenario:
        '💼 Bạn được offer một công việc lương cao nhưng không đam mê, và một công việc mơ ước nhưng lương thấp hơn. Bạn chọn:',
      options: [
        {
          value: 'high_salary',
          label: 'Lương cao - ổn định tài chính',
          icon: '💰',
        },
        {
          value: 'passion',
          label: 'Đam mê - hạnh phúc quan trọng hơn',
          icon: '❤️',
        },
        { value: 'negotiate', label: 'Thương lượng với cả hai', icon: '🤝' },
        {
          value: 'need_time',
          label: 'Cần thời gian suy nghĩ thêm',
          icon: '🤔',
        },
      ],
    },

    // Quick Emoji Reactions
    {
      id: 'behav_004',
      type: 'emoji',
      question:
        'Ai đó phê bình công việc của bạn trước mặt mọi người. Cảm giác?',
      options: [
        { value: 1, icon: '😡', label: 'Tức giận' },
        { value: 2, icon: '😔', label: 'Buồn' },
        { value: 3, icon: '😐', label: 'Bình tĩnh' },
        { value: 4, icon: '🤔', label: 'Tò mò feedback' },
        { value: 5, icon: '😊', label: 'Biết ơn góp ý' },
      ],
    },
    {
      id: 'behav_005',
      type: 'emoji',
      question: 'Bạn mắc lỗi lớn trong dự án. Phản ứng đầu tiên?',
      options: [
        { value: 1, icon: '😰', label: 'Hoảng sợ' },
        { value: 2, icon: '😞', label: 'Tự trách' },
        { value: 3, icon: '😐', label: 'Chấp nhận' },
        { value: 4, icon: '💪', label: 'Tìm cách fix' },
        { value: 5, icon: '🎯', label: 'Học từ lỗi' },
      ],
    },

    // Visual/Image selection
    {
      id: 'behav_006',
      type: 'image',
      question: 'Khi gặp khó khăn, bạn thường tìm đến:',
      options: [
        {
          value: 'friends',
          icon: '👥',
          label: 'Bạn bè',
          description: 'Chia sẻ cảm xúc',
        },
        {
          value: 'mentor',
          icon: '👨‍🏫',
          label: 'Mentor',
          description: 'Lời khuyên kinh nghiệm',
        },
        {
          value: 'alone',
          icon: '🧘',
          label: 'Một mình',
          description: 'Tự giải quyết',
        },
        {
          value: 'research',
          icon: '📚',
          label: 'Tìm hiểu',
          description: 'Đọc và nghiên cứu',
        },
      ],
    },

    // More scenarios
    {
      id: 'behav_007',
      type: 'scenario',
      scenario:
        '🎤 Được yêu cầu thuyết trình trước 100 người về chủ đề không quen thuộc trong 3 ngày. Bạn:',
      options: [
        {
          value: 'accept_confident',
          label: 'Nhận và tự tin chuẩn bị',
          icon: '💪',
        },
        {
          value: 'accept_nervous',
          label: 'Nhận nhưng hơi lo lắng',
          icon: '😰',
        },
        {
          value: 'negotiate',
          label: 'Xin thêm thời gian hoặc support',
          icon: '🤝',
        },
        { value: 'decline', label: 'Từ chối vì chưa sẵn sàng', icon: '🙅' },
      ],
    },
    {
      id: 'behav_008',
      type: 'scenario',
      scenario:
        '🤔 Phát hiện đồng nghiệp làm sai nhưng họ không nhận ra. Việc này không ảnh hưởng bạn. Bạn:',
      options: [
        { value: 'tell_directly', label: 'Nói thẳng với họ', icon: '🗣️' },
        { value: 'tell_leader', label: 'Báo với leader', icon: '👔' },
        { value: 'hint_subtle', label: 'Gợi ý tinh tế', icon: '💡' },
        {
          value: 'not_my_business',
          label: 'Không phải việc của mình',
          icon: '🤷',
        },
      ],
    },

    // Emoji reactions
    {
      id: 'behav_009',
      type: 'emoji',
      question: 'Cảm giác của bạn về việc làm việc dưới áp lực cao?',
      options: [
        { value: 1, icon: '😫', label: 'Stress quá' },
        { value: 2, icon: '😟', label: 'Không thích' },
        { value: 3, icon: '😐', label: 'OK được' },
        { value: 4, icon: '😤', label: 'Thích thử thách' },
        { value: 5, icon: '🔥', label: 'Thích cực!' },
      ],
    },

    // More scenarios
    {
      id: 'behav_010',
      type: 'scenario',
      scenario: '💡 Có ý tưởng sáng tạo nhưng team leader không đồng ý. Bạn:',
      options: [
        { value: 'push_harder', label: 'Thuyết phục mạnh mẽ hơn', icon: '💪' },
        { value: 'gather_data', label: 'Thu thập data chứng minh', icon: '📊' },
        { value: 'accept_decision', label: 'Chấp nhận quyết định', icon: '✅' },
        { value: 'try_anyway', label: 'Thử làm riêng để demo', icon: '🚀' },
      ],
    },
    {
      id: 'behav_011',
      type: 'image',
      question: 'Phong cách làm việc của bạn:',
      options: [
        {
          value: 'structured',
          icon: '📋',
          label: 'Có kế hoạch',
          description: 'Chi tiết, rõ ràng',
        },
        {
          value: 'flexible',
          icon: '🌊',
          label: 'Linh hoạt',
          description: 'Thích ứng tình huống',
        },
        {
          value: 'creative',
          icon: '🎨',
          label: 'Sáng tạo',
          description: 'Thử nghiệm mới',
        },
        {
          value: 'efficient',
          icon: '⚡',
          label: 'Hiệu quả',
          description: 'Nhanh, chính xác',
        },
      ],
    },
    {
      id: 'behav_012',
      type: 'emoji',
      question: 'Khi nhận nhiệm vụ mới hoàn toàn xa lạ?',
      options: [
        { value: 1, icon: '😰', label: 'Lo lắng' },
        { value: 2, icon: '😕', label: 'Không chắc' },
        { value: 3, icon: '😐', label: 'Bình thường' },
        { value: 4, icon: '🤔', label: 'Tò mò' },
        { value: 5, icon: '🤩', label: 'Hào hứng!' },
      ],
    },
    {
      id: 'behav_013',
      type: 'scenario',
      scenario:
        '🏆 Được đề xuất lên vị trí quản lý nhưng bạn thích làm chuyên môn hơn. Bạn:',
      options: [
        {
          value: 'accept_grow',
          label: 'Nhận để phát triển bản thân',
          icon: '📈',
        },
        {
          value: 'decline_expert',
          label: 'Từ chối, tập trung chuyên môn',
          icon: '🎯',
        },
        { value: 'try_short', label: 'Thử trong thời gian ngắn', icon: '⏱️' },
        {
          value: 'negotiate_hybrid',
          label: 'Thương lượng vai trò hybrid',
          icon: '🤝',
        },
      ],
    },
    {
      id: 'behav_014',
      type: 'image',
      question: 'Trong team, bạn thường đảm nhận vai trò:',
      options: [
        {
          value: 'leader',
          icon: '👑',
          label: 'Leader',
          description: 'Dẫn dắt team',
        },
        {
          value: 'coordinator',
          icon: '🤝',
          label: 'Điều phối',
          description: 'Kết nối mọi người',
        },
        {
          value: 'executor',
          icon: '⚙️',
          label: 'Thực thi',
          description: 'Làm việc hiệu quả',
        },
        {
          value: 'creative',
          icon: '💡',
          label: 'Sáng tạo',
          description: 'Đưa ý tưởng mới',
        },
      ],
    },
    {
      id: 'behav_015',
      type: 'scenario',
      scenario:
        '🎁 Cấp trên offer cho bạn làm dự án lớn nhưng không có thêm lương. Bạn:',
      options: [
        {
          value: 'accept_opportunity',
          label: 'Nhận vì cơ hội học hỏi',
          icon: '🚀',
        },
        {
          value: 'negotiate_bonus',
          label: 'Thương lượng bonus/benefits',
          icon: '💰',
        },
        { value: 'decline_polite', label: 'Từ chối lịch sự', icon: '🙅' },
        { value: 'ask_future', label: 'Hỏi về tăng lương sau này', icon: '📈' },
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

  // Render different question types
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

    if (q.type === 'image') {
      return (
        <ImageQuestion
          question={q.question}
          options={q.options}
          onAnswer={handleAnswer}
        />
      );
    }

    // Scenario type (custom for this module)
    if (q.type === 'scenario') {
      return (
        <div className='text-center max-w-3xl mx-auto'>
          {/* Scenario description */}
          <div className='bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-200'>
            <p className='text-lg text-gray-800 leading-relaxed'>
              {q.scenario}
            </p>
          </div>

          {/* Options */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {q.options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className='p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-emerald-400 transition-all text-left shadow-md hover:shadow-xl group'
              >
                <div className='flex items-start gap-4'>
                  <div className='text-4xl group-hover:scale-110 transition-transform'>
                    {option.icon}
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-900 mb-1'>
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
            // eslint-disable-next-line react-hooks/purity
            time: `${Math.floor((Date.now() - startTime) / 60000)}:${
              // eslint-disable-next-line react-hooks/purity
              (((Date.now() - startTime) / 1000) % 60)
                .toFixed(0)
                .padStart(2, '0')
            }`,
            speed: 'Excellent',
            streak: 8,
            badges: [
              { icon: '🎯', name: 'Decision Maker' },
              { icon: '🤝', name: 'Team Player' },
              { icon: '💡', name: 'Problem Solver' },
            ],
          }}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default BehaviorTest;
