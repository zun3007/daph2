// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState } from 'react';

// ============================================
// QUESTION TYPE COMPONENTS
// ============================================

// 1. EMOJI REACTION (Fastest, most engaging!)
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
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
        {question}
      </h2>

      <div className='flex justify-center gap-4 flex-wrap'>
        {options.map((emoji) => (
          <motion.button
            key={emoji.value}
            onClick={() => handleSelect(emoji)}
            className={`text-6xl md:text-7xl p-4 rounded-2xl transition-all ${
              selected === emoji.value
                ? 'bg-emerald-100 scale-110'
                : 'hover:scale-110 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {emoji.icon}
          </motion.button>
        ))}
      </div>

      {options[0].label && (
        <div className='flex justify-between mt-6 text-sm text-gray-500 px-4'>
          <span>{options[0].label}</span>
          <span>{options[options.length - 1].label}</span>
        </div>
      )}
    </div>
  );
};

// 2. SWIPE CARDS (Tinder-style)
export const SwipeQuestion = ({ question, optionA, optionB, onAnswer }) => {
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleSwipe = (direction, option) => {
    setSwipeDirection(direction);
    if (navigator.vibrate) navigator.vibrate(20);

    setTimeout(() => {
      onAnswer(option);
    }, 400);
  };

  return (
    <div className='text-center'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
        {question}
      </h2>

      <div className='relative h-96 flex items-center justify-center'>
        <motion.div
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x > 100) {
              handleSwipe('right', optionB.value);
            } else if (info.offset.x < -100) {
              handleSwipe('left', optionA.value);
            }
          }}
          animate={
            swipeDirection === 'left'
              ? { x: -300, rotate: -20, opacity: 0 }
              : swipeDirection === 'right'
              ? { x: 300, rotate: 20, opacity: 0 }
              : { x: 0, rotate: 0, opacity: 1 }
          }
          className='absolute bg-white rounded-3xl shadow-2xl p-8 w-80 h-80 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing border-4 border-gray-100'
        >
          <div className='text-6xl mb-4'>{optionA.icon}</div>
          <h3 className='text-2xl font-bold text-gray-900 mb-2'>
            {optionA.label}
          </h3>
          <p className='text-gray-600 text-center'>{optionA.description}</p>

          <div className='absolute bottom-4 text-sm text-gray-400'>
            ← Swipe để chọn →
          </div>
        </motion.div>
      </div>

      {/* Click buttons as alternative to swipe */}
      <div className='flex gap-4 justify-center mt-8'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe('left', optionA.value)}
          className='px-8 py-4 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg'
        >
          {optionA.icon} {optionA.label}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe('right', optionB.value)}
          className='px-8 py-4 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg'
        >
          {optionB.label} {optionB.icon}
        </motion.button>
      </div>
    </div>
  );
};

// 3. SLIDER SCALE
export const SliderQuestion = ({
  question,
  min = 1,
  max = 5,
  labels,
  onAnswer,
}) => {
  const [value, setValue] = useState(Math.ceil((min + max) / 2));
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    setValue(parseInt(e.target.value));
  };

  const handleConfirm = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    onAnswer(value);
  };

  return (
    <div className='text-center max-w-2xl mx-auto'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
        {question}
      </h2>

      <div className='mb-8'>
        {/* Current value display */}
        <motion.div
          animate={{ scale: isDragging ? 1.2 : 1 }}
          className='text-7xl font-bold text-emerald-600 mb-4'
        >
          {value}
        </motion.div>

        {/* Slider */}
        <input
          type='range'
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className='w-full h-3 bg-linear-to-r from-red-200 via-yellow-200 to-emerald-200 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-8
            [&::-webkit-slider-thumb]:h-8
            [&::-webkit-slider-thumb]:bg-emerald-600
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110'
        />

        {/* Labels */}
        {labels && (
          <div className='flex justify-between mt-4 text-sm text-gray-600 px-2'>
            <span>{labels.min}</span>
            <span>{labels.max}</span>
          </div>
        )}
      </div>

      {/* Confirm button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConfirm}
        className='px-12 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg shadow-lg'
      >
        Xác Nhận
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

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto'>
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-6 rounded-2xl border-4 transition-all ${
              selected === option.value
                ? 'border-emerald-500 bg-emerald-50 shadow-xl'
                : 'border-gray-200 hover:border-emerald-300 bg-white'
            }`}
          >
            {/* Icon/Image */}
            <div className='text-6xl mb-3'>{option.icon || option.image}</div>

            {/* Label */}
            <div className='font-semibold text-gray-900'>{option.label}</div>

            {/* Description */}
            {option.description && (
              <p className='text-sm text-gray-600 mt-2'>{option.description}</p>
            )}

            {/* Checkmark */}
            {selected === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='absolute top-2 right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white'
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// 5. RAPID TAP (Quick choice with timer)
export const RapidTapQuestion = ({
  question,
  options,
  timeLimit = 5,
  onAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selected, setSelected] = useState(null);

  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-select first option if time runs out
          if (!selected) {
            onAnswer(options[0].value);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelect = (option) => {
    setSelected(option.value);
    if (navigator.vibrate) navigator.vibrate(10);

    setTimeout(() => {
      onAnswer(option.value);
    }, 200);
  };

  return (
    <div className='text-center'>
      {/* Timer */}
      <motion.div
        animate={{ scale: timeLeft <= 2 ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.5, repeat: timeLeft <= 2 ? Infinity : 0 }}
        className={`text-6xl font-bold mb-4 ${
          timeLeft <= 2 ? 'text-red-500' : 'text-emerald-600'
        }`}
      >
        {timeLeft}
      </motion.div>

      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
        First Instinct!
      </h2>
      <p className='text-lg text-gray-600 mb-8'>{question}</p>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto'>
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className={`py-8 px-4 rounded-xl font-bold text-lg transition-all ${
              selected === option.value
                ? 'bg-emerald-500 text-white shadow-xl'
                : 'bg-white border-2 border-gray-200 hover:border-emerald-300'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// 6. MULTI-SELECT CHIPS
export const MultiSelectQuestion = ({
  question,
  options,
  min = 1,
  max = 5,
  onAnswer,
}) => {
  const [selected, setSelected] = useState([]);

  const toggleOption = (option) => {
    if (selected.includes(option.value)) {
      setSelected(selected.filter((v) => v !== option.value));
    } else if (selected.length < max) {
      setSelected([...selected, option.value]);
      if (navigator.vibrate) navigator.vibrate(5);
    }
  };

  const handleConfirm = () => {
    if (selected.length >= min) {
      onAnswer(selected);
    }
  };

  return (
    <div className='text-center max-w-3xl mx-auto'>
      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
        {question}
      </h2>
      <p className='text-gray-600 mb-8'>
        Chọn {min === max ? min : `${min}-${max}`} mục
        {selected.length > 0 && ` • Đã chọn: ${selected.length}/${max}`}
      </p>

      <div className='flex flex-wrap gap-3 justify-center mb-8'>
        {options.map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <motion.button
              key={option.value}
              onClick={() => toggleOption(option)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.icon && <span className='mr-2'>{option.icon}</span>}
              {option.label}
              {isSelected && <span className='ml-2'>✓</span>}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConfirm}
        disabled={selected.length < min}
        className={`px-12 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
          selected.length >= min
            ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Tiếp Theo ({selected.length}/{max})
      </motion.button>
    </div>
  );
};

export default {
  EmojiQuestion,
  SwipeQuestion,
  SliderQuestion,
  ImageQuestion,
  RapidTapQuestion,
  MultiSelectQuestion,
};
