// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// QUESTION TYPE COMPONENTS - FIXED VERSION
// ============================================

// 1. EMOJI REACTION - ✅ FIXED: Show labels under each emoji!
export const EmojiQuestion = ({ question, options, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (emoji) => {
    setSelected(emoji.value);

    // Vibrate on mobile
    if (navigator.vibrate) navigator.vibrate(10);

    // Auto-advance after animation
    setTimeout(() => {
      onAnswer(emoji.value);
    }, 300);
  };

  return (
    <div className='text-center'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-12'>
        {question}
      </h2>

      {/* ✅ FIXED: Grid layout with labels under each emoji */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto px-4'>
        {options.map((emoji) => (
          <motion.button
            key={emoji.value}
            onClick={() => handleSelect(emoji)}
            className={`flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-2xl transition-all ${
              selected === emoji.value
                ? 'bg-emerald-100 scale-105 shadow-lg'
                : 'hover:scale-105 hover:bg-gray-50 bg-white border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Emoji Icon */}
            <div className='text-4xl md:text-5xl'>{emoji.icon}</div>

            {/* ✅ Label Text */}
            {emoji.label && (
              <span className='text-xs md:text-sm font-semibold text-gray-700 text-center leading-tight'>
                {emoji.label}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// 2. SWIPE CARDS - ✅ REDESIGNED: Compact, clear, one at a time!
export const SwipeQuestion = ({ question, optionA, optionB, onAnswer }) => {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleSwipe = (direction, option) => {
    setSwipeDirection(direction);
    if (navigator.vibrate) navigator.vibrate(20);

    setTimeout(() => {
      onAnswer(option);
    }, 350);
  };

  // Determine which option is being chosen based on drag
  const getActiveOption = () => {
    if (dragOffset < -50) return 'left';
    if (dragOffset > 50) return 'right';
    return null;
  };

  const activeOption = getActiveOption();

  return (
    <div className='text-center px-4'>
      <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8'>
        {question}
      </h2>

      {/* Compact buttons for all screens */}
      <div className='max-w-lg mx-auto space-y-3'>
        <motion.button
          onClick={() => handleSwipe('left', optionA.value)}
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          className='w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-red-400 hover:shadow-lg transition-all group'
        >
          <div className='text-3xl'>{optionA.icon}</div>
          <div className='flex-1 text-left'>
            <div className='text-base md:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors'>
              {optionA.label}
            </div>
            {optionA.description && (
              <div className='text-xs md:text-sm text-gray-500 mt-0.5'>
                {optionA.description}
              </div>
            )}
          </div>
          <div className='text-gray-400 group-hover:text-red-500 transition-colors'>
            👈
          </div>
        </motion.button>

        <div className='text-center py-2'>
          <span className='text-xs text-gray-400 font-medium'>hoặc</span>
        </div>

        <motion.button
          onClick={() => handleSwipe('right', optionB.value)}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className='w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all group'
        >
          <div className='text-gray-400 group-hover:text-emerald-500 transition-colors'>
            👉
          </div>
          <div className='flex-1 text-left'>
            <div className='text-base md:text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors'>
              {optionB.label}
            </div>
            {optionB.description && (
              <div className='text-xs md:text-sm text-gray-500 mt-0.5'>
                {optionB.description}
              </div>
            )}
          </div>
          <div className='text-3xl'>{optionB.icon}</div>
        </motion.button>
      </div>

      {/* Visual feedback hint */}
      <div className='mt-6 text-xs text-gray-400'>
        💡 Chọn option phù hợp với bạn nhất
      </div>
    </div>
  );
};

// 3. SLIDER QUESTION
export const SliderQuestion = ({ question, min, max, labels, onAnswer }) => {
  const [value, setValue] = useState(Math.floor((min + max) / 2));

  const handleSubmit = () => {
    onAnswer(value);
  };

  return (
    <div className='text-center max-w-2xl mx-auto px-4'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
        {question}
      </h2>

      <div className='mb-8'>
        <div className='text-5xl md:text-6xl mb-4 font-bold text-emerald-600'>
          {value}
        </div>

        <input
          type='range'
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className='w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500'
        />

        {labels && (
          <div className='flex justify-between mt-4 text-sm md:text-base text-gray-600 font-medium'>
            <span>{labels.min}</span>
            <span>{labels.max}</span>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className='px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-colors'
      >
        Tiếp theo →
      </motion.button>
    </div>
  );
};

// 4. IMAGE SELECTION
export const ImageQuestion = ({ question, options, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option.value);
    if (navigator.vibrate) navigator.vibrate(10);

    setTimeout(() => {
      onAnswer(option.value);
    }, 300);
  };

  return (
    <div className='text-center'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
        {question}
      </h2>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto'>
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option)}
            className={`p-6 rounded-2xl border-2 transition-all ${
              selected === option.value
                ? 'bg-emerald-100 border-emerald-500 scale-105'
                : 'bg-white border-gray-200 hover:border-emerald-400 hover:scale-105'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className='text-5xl mb-3'>{option.icon}</div>
            <div className='text-sm font-semibold text-gray-700'>
              {option.label}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// 5. RAPID TAP (Time pressure!) - FIXED VERSION
export const RapidTapQuestion = ({
  question,
  options,
  timeLimit = 10,
  onAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selected, setSelected] = useState(null);
  const hasAnsweredRef = useRef(false);

  // Timer logic with useEffect
  useEffect(() => {
    if (hasAnsweredRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasAnsweredRef.current) {
            hasAnsweredRef.current = true;
            // Defer state update to avoid rendering during render
            setTimeout(() => onAnswer(null), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAnswer]);

  const handleAnswer = useCallback(
    (value) => {
      if (hasAnsweredRef.current) return;
      hasAnsweredRef.current = true;

      setSelected(value);
      if (navigator.vibrate) navigator.vibrate(10);

      setTimeout(() => onAnswer(value), 200);
    },
    [onAnswer]
  );

  return (
    <div className='text-center'>
      <div className='mb-6'>
        <div
          className={`text-5xl font-bold ${
            timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-emerald-600'
          }`}
        >
          {timeLeft}s
        </div>
        <div className='text-sm text-gray-500 mt-2'>Trả lời nhanh!</div>
      </div>

      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
        {question}
      </h2>

      <div className='grid grid-cols-2 gap-4 max-w-2xl mx-auto'>
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            disabled={hasAnsweredRef.current}
            className={`p-6 rounded-2xl border-2 font-bold text-xl transition-all ${
              selected === option.value
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-white border-gray-200 hover:border-emerald-400 text-gray-900'
            }`}
            whileHover={{ scale: hasAnsweredRef.current ? 1 : 1.05 }}
            whileTap={{ scale: hasAnsweredRef.current ? 1 : 0.95 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// 6. MULTI-SELECT
export const MultiSelectQuestion = ({
  question,
  options,
  min,
  max,
  onAnswer,
}) => {
  const [selected, setSelected] = useState([]);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      if (selected.length < max) {
        setSelected([...selected, value]);
      }
    }
  };

  const handleSubmit = () => {
    if (selected.length >= min && selected.length <= max) {
      onAnswer(selected);
    }
  };

  const isValid = selected.length >= min && selected.length <= max;

  return (
    <div className='text-center max-w-3xl mx-auto px-4'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
        {question}
      </h2>
      <p className='text-sm text-gray-500 mb-8'>
        Chọn {min === max ? min : `${min}-${max}`} lựa chọn ({selected.length}/
        {max})
      </p>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8'>
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => toggleOption(option.value)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selected.includes(option.value)
                ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg'
                : 'bg-white border-gray-200 hover:border-emerald-400 text-gray-900'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className='flex items-center gap-3'>
              <div className='text-2xl'>{option.icon}</div>
              <div className='text-sm font-semibold'>{option.label}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: isValid ? 1.05 : 1 }}
        whileTap={{ scale: isValid ? 0.95 : 1 }}
        onClick={handleSubmit}
        disabled={!isValid}
        className={`px-10 py-4 rounded-xl font-bold shadow-lg transition-all ${
          isValid
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Tiếp theo →
      </motion.button>
    </div>
  );
};
