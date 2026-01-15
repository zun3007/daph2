import { useState, useEffect, useRef } from 'react';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import {
  GameWrapper,
  CompletionCelebration,
  FunInterlude,
} from '../components/ui/Gamification';
import {
  EmojiQuestion,
  SwipeQuestion,
  SliderQuestion,
  ImageQuestion,
  RapidTapQuestion,
  MultiSelectQuestion,
} from '../components/ui/QuestionType';

// ============================================
// PERSONALITY TEST MODULE - FIXED VERSION
// ============================================
//
// 🔧 FIXES APPLIED:
// 1. Không trigger completion ngay khi mount
// 2. Resume logic đúng - check nếu đã complete thì show completion
// 3. hasCompletedRef để tránh double trigger
// 4. Delay initial render để tránh flash

// Questions data
const questions = [
  // Warm-up questions (1-5)
  {
    id: 'pers_001',
    type: 'emoji',
    question: 'Sáng thứ 2, bạn cảm thấy thế nào?',
    options: [
      { value: 1, icon: '😫', label: 'Uể oải' },
      { value: 2, icon: '😐', label: 'Bình thường' },
      { value: 3, icon: '😊', label: 'Ổn' },
      { value: 4, icon: '🤩', label: 'Hứng khởi' },
      { value: 5, icon: '🔥', label: 'Siêu năng lượng' },
    ],
  },
  {
    id: 'pers_002',
    type: 'swipe',
    question: 'Cuối tuần lý tưởng của bạn?',
    optionA: { label: '🏠 Ở nhà chill', value: 'introvert' },
    optionB: { label: '🎉 Party với bạn bè', value: 'extrovert' },
  },
  {
    id: 'pers_003',
    type: 'slider',
    question: 'Bạn thích làm việc một mình hay theo nhóm?',
    min: 1,
    max: 5,
    labels: {
      min: 'Solo 🎧',
      max: 'Team 👥',
    },
  },
  {
    id: 'pers_004',
    type: 'emoji',
    question: 'Khi gặp vấn đề khó, bạn thường:',
    options: [
      { value: 'logic', icon: '🧠', label: 'Phân tích logic' },
      { value: 'feeling', icon: '💝', label: 'Theo cảm xúc' },
      { value: 'ask', icon: '🗣️', label: 'Hỏi người khác' },
      { value: 'wait', icon: '⏳', label: 'Chờ đợi' },
    ],
  },
  {
    id: 'pers_005',
    type: 'swipe',
    question: 'Bạn thích lên kế hoạch hay tùy hứng?',
    optionA: { label: '📋 Lên kế hoạch chi tiết', value: 'planner' },
    optionB: { label: '🎲 Tùy cơ ứng biến', value: 'spontaneous' },
  },

  // Core questions (6-10)
  {
    id: 'pers_006',
    type: 'emoji',
    question: 'Bạn xử lý stress như thế nào?',
    options: [
      { value: 'exercise', icon: '🏃', label: 'Tập thể dục' },
      { value: 'music', icon: '🎵', label: 'Nghe nhạc' },
      { value: 'talk', icon: '💬', label: 'Tâm sự' },
      { value: 'sleep', icon: '😴', label: 'Ngủ' },
      { value: 'game', icon: '🎮', label: 'Chơi game' },
    ],
  },
  {
    id: 'pers_007',
    type: 'slider',
    question: 'Bạn dễ bị ảnh hưởng bởi người khác không?',
    min: 1,
    max: 5,
    labels: {
      min: 'Độc lập 💪',
      max: 'Dễ ảnh hưởng 🌊',
    },
  },
  {
    id: 'pers_008',
    type: 'swipe',
    question: 'Deadline gần kề, bạn:',
    optionA: { label: '😰 Lo lắng, làm ngay', value: 'anxious' },
    optionB: { label: '😎 Bình tĩnh, từ từ', value: 'calm' },
  },
  {
    id: 'pers_009',
    type: 'emoji',
    question: 'Môi trường làm việc lý tưởng?',
    options: [
      { value: 'quiet', icon: '🤫', label: 'Yên tĩnh' },
      { value: 'music', icon: '🎧', label: 'Có nhạc' },
      { value: 'busy', icon: '🏢', label: 'Náo nhiệt' },
      { value: 'nature', icon: '🌿', label: 'Gần thiên nhiên' },
      { value: 'home', icon: '🏠', label: 'Tại nhà' },
    ],
  },
  {
    id: 'pers_010',
    type: 'slider',
    question: 'Bạn có dễ dàng thử những điều mới không?',
    min: 1,
    max: 5,
    labels: {
      min: 'Thận trọng 🐢',
      max: 'Thích khám phá 🚀',
    },
  },

  // Deep dive questions (11-15)
  {
    id: 'pers_011',
    type: 'multiselect',
    question: 'Chọn 3 từ mô tả bạn nhất:',
    options: [
      { value: 'creative', label: 'Sáng tạo', icon: '🎨' },
      { value: 'logical', label: 'Logic', icon: '🧮' },
      { value: 'caring', label: 'Quan tâm', icon: '💝' },
      { value: 'ambitious', label: 'Tham vọng', icon: '🎯' },
      { value: 'patient', label: 'Kiên nhẫn', icon: '🧘' },
      { value: 'adventurous', label: 'Phiêu lưu', icon: '🗺️' },
    ],
    min: 3,
    max: 3,
  },
  {
    id: 'pers_012',
    type: 'swipe',
    question: 'Khi có xung đột, bạn:',
    optionA: { label: '🕊️ Tìm cách hòa giải', value: 'peace' },
    optionB: { label: '⚔️ Đối mặt trực tiếp', value: 'confront' },
  },
  {
    id: 'pers_013',
    type: 'emoji',
    question: 'Điều gì motivate bạn nhất?',
    options: [
      { value: 'money', icon: '💰', label: 'Tiền bạc' },
      { value: 'recognition', icon: '🏆', label: 'Được công nhận' },
      { value: 'growth', icon: '📈', label: 'Phát triển' },
      { value: 'helping', icon: '🤝', label: 'Giúp đỡ người khác' },
      { value: 'freedom', icon: '🕊️', label: 'Tự do' },
    ],
  },
  {
    id: 'pers_014',
    type: 'slider',
    question: 'Bạn coi trọng ý kiến người khác như thế nào?',
    min: 1,
    max: 5,
    labels: {
      min: 'Tự tin vào bản thân 💪',
      max: 'Lắng nghe nhiều 👂',
    },
  },
  {
    id: 'pers_015',
    type: 'swipe',
    question: 'Bạn thích công việc:',
    optionA: { label: '📊 Ổn định, có cấu trúc', value: 'stable' },
    optionB: { label: '🎢 Thử thách, đa dạng', value: 'dynamic' },
  },

  // Fast finish questions (16-20)
  {
    id: 'pers_016',
    type: 'rapid',
    question: 'Chọn nhanh! Bạn là:',
    timeLimit: 5,
    options: [
      { value: 'leader', label: '👑 Leader' },
      { value: 'supporter', label: '🤝 Supporter' },
      { value: 'creator', label: '🎨 Creator' },
      { value: 'analyst', label: '📊 Analyst' },
    ],
  },
  {
    id: 'pers_017',
    type: 'emoji',
    question: 'Khi nhận feedback tiêu cực:',
    options: [
      { value: 'improve', icon: '📈', label: 'Cố gắng cải thiện' },
      { value: 'sad', icon: '😢', label: 'Buồn một chút' },
      { value: 'defend', icon: '🛡️', label: 'Giải thích lý do' },
      { value: 'ignore', icon: '🙄', label: 'Bỏ qua' },
    ],
  },
  {
    id: 'pers_018',
    type: 'slider',
    question: 'Thử thách mới khiến bạn cảm thấy:',
    min: 1,
    max: 5,
    labels: {
      min: 'Lo lắng 😰',
      max: 'Hào hứng 🤩',
    },
  },
  {
    id: 'pers_019',
    type: 'rapid',
    question: 'Nếu thắng 1 tỷ, việc đầu tiên bạn làm?',
    timeLimit: 5,
    options: [
      { value: 'invest', label: '💰 Đầu tư' },
      { value: 'travel', label: '✈️ Du lịch' },
      { value: 'family', label: '👨‍👩‍👧 Cho gia đình' },
      { value: 'business', label: '🚀 Khởi nghiệp' },
    ],
  },
  {
    id: 'pers_020',
    type: 'slider',
    question: 'Bạn là người theo xu hướng hay tạo xu hướng?',
    min: 1,
    max: 5,
    labels: {
      min: 'Theo trend 👥',
      max: 'Tạo trend 🚀',
    },
  },
];

function PersonalityTest() {
  const { saveAnswer, goToNextModule, completeModule, answers } =
    useTestContext();

  // States
  const [currentQ, setCurrentQ] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showInterlude, setShowInterlude] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // eslint-disable-next-line react-hooks/purity
  const [startTime] = useState(Date.now());

  // Refs để tránh double trigger
  const hasCompletedRef = useRef(false);
  const isInitializedRef = useRef(false);

  // ============================================
  // RESUME LOGIC - FIXED
  // ============================================
  useEffect(() => {
    // Chỉ chạy 1 lần khi mount
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Đếm số câu đã trả lời
    const moduleAnswers = answers?.personality || {};
    const answeredCount = Object.keys(moduleAnswers).length;

    console.log('PersonalityTest init:', {
      answeredCount,
      totalQuestions: questions.length,
    });

    // Case 1: Đã hoàn thành test trước đó
    if (answeredCount >= questions.length) {
      console.log('Module already completed, showing completion');
      // Đã hoàn thành → hiển thị completion screen
      hasCompletedRef.current = true;
      setShowCompletion(true);
      setIsReady(true);
      return;
    }

    // Case 2: Đang làm dở → resume từ câu tiếp theo
    if (answeredCount > 0 && answeredCount < questions.length) {
      console.log('Resuming from question:', answeredCount);
      setCurrentQ(answeredCount);
    }

    // Case 3: Mới bắt đầu → currentQ = 0 (default)

    // Đánh dấu đã ready để render
    setIsReady(true);
  }, [answers?.personality]); // Empty deps - chỉ chạy 1 lần

  // ============================================
  // HANDLERS
  // ============================================
  const handleAnswer = (answer) => {
    const question = questions[currentQ];

    // Save answer
    saveAnswer('personality', question.id, answer);

    // Check if should show interlude (every 5 questions)
    const nextQ = currentQ + 1;
    const shouldShowInterlude = nextQ % 5 === 0 && nextQ < questions.length;

    // Move to next question or complete
    if (currentQ < questions.length - 1) {
      if (shouldShowInterlude) {
        setShowInterlude(true);
      } else {
        setCurrentQ(nextQ);
      }
    } else {
      // Last question answered → complete!
      handleComplete();
    }
  };

  const handleInterludeContinue = () => {
    setShowInterlude(false);
    setCurrentQ(currentQ + 1);
  };

  const handleComplete = () => {
    // Tránh double trigger
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    console.log('PersonalityTest completed!');

    // Mark module as complete in context
    completeModule('personality');

    // Show celebration
    setShowCompletion(true);
  };

  const handleContinue = () => {
    // Navigate to next module
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
        return <div>Unknown question type: {q.type}</div>;
    }
  };

  // ============================================
  // CALCULATE STATS FOR COMPLETION
  // ============================================
  const getCompletionStats = () => {
    // eslint-disable-next-line react-hooks/purity
    const endTime = Date.now();
    const totalSeconds = Math.round((endTime - startTime) / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return {
      time: `${mins}:${secs.toString().padStart(2, '0')}`,
      speed:
        totalSeconds < 300 ? 'Fast' : totalSeconds < 600 ? 'Normal' : 'Careful',
      streak: questions.length,
      badges: [
        { icon: '🎭', name: 'Personality Pro' },
        { icon: '⚡', name: 'Speed Demon' },
        { icon: '🔥', name: 'On Fire!' },
      ],
    };
  };

  // ============================================
  // RENDER
  // ============================================

  // Loading state - chờ init xong
  if (!isReady) {
    return (
      <div className='h-full flex items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50'>
        <div className='text-center'>
          <div className='text-4xl mb-4 animate-bounce'>🎭</div>
          <p className='text-gray-600'>Đang tải...</p>
        </div>
      </div>
    );
  }

  // Completion screen (nếu đã hoàn thành)
  if (showCompletion) {
    return (
      <CompletionCelebration
        stats={getCompletionStats()}
        onContinue={handleContinue}
      />
    );
  }

  // Main test UI
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

      {/* Fun Interlude - mỗi 5 câu */}
      <AnimatePresence>
        {showInterlude && <FunInterlude onContinue={handleInterludeContinue} />}
      </AnimatePresence>
    </>
  );
}

export default PersonalityTest;
