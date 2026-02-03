import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
import html2canvas from 'html2canvas';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function CircularProgress({
  value,
  max,
  size = 80,
  strokeWidth = 6,
  color = '#10b981',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = (value / max) * 100;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
      className='relative inline-flex items-center justify-center'
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className='-rotate-90'>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='#e5e7eb'
          strokeWidth={strokeWidth}
          fill='none'
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill='none'
          strokeLinecap='round'
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <span className='absolute text-lg font-bold text-gray-800'>
        {value}/{max}
      </span>
    </div>
  );
}

function EQBar({ label, value, max = 5 }) {
  const percent = (value / max) * 100;
  return (
    <div className='flex items-center gap-3'>
      <span className='text-sm text-gray-600 w-28 shrink-0'>{label}</span>
      <div className='flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden'>
        <motion.div
          className='h-full bg-linear-to-r from-pink-400 to-rose-500 rounded-full'
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
      <span className='text-sm font-semibold text-gray-700 w-8 text-right'>
        {value}/{max}
      </span>
    </div>
  );
}

function MatchBar({ percent }) {
  return (
    <div className='w-full h-3 bg-gray-200 rounded-full overflow-hidden'>
      <motion.div
        className='h-full rounded-full'
        style={{
          background:
            percent >= 85
              ? 'linear-gradient(to right, #10b981, #14b8a6)'
              : percent >= 70
                ? 'linear-gradient(to right, #f59e0b, #eab308)'
                : 'linear-gradient(to right, #6b7280, #9ca3af)',
        }}
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}

function ResultsPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { resetTest } = useTestContext();
  const [data, setData] = useState(null);
  const [expandedRoadmap, setExpandedRoadmap] = useState(0);
  const resultRef = useRef(null);
  const [saving, setSaving] = useState(false);
  console.log(data);

  useEffect(() => {
    const saved = localStorage.getItem(`PathX_result_${sessionId}`);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        setData(null);
      }
    }
  }, [sessionId]);

  const handleShare = useCallback(async () => {
    const text = data
      ? `PathX Smart Orientation - Kết quả của mình!\n${data.personality?.emoji} ${data.personality?.title}\n${data.personality?.summary}\n\nTop nghề phù hợp:\n${(
          data.careerRecommendations || []
        )
          .slice(0, 3)
          .map((c, i) => `${i + 1}. ${c.emoji} ${c.title} (${c.matchPercent}%)`)
          .join('\n')}`
      : 'PathX Smart Orientation';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'PathX - Kết quả hướng nghiệp', text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Đã copy kết quả vào clipboard!');
    }
  }, [data]);

  const handleSaveImage = useCallback(async () => {
    if (!resultRef.current || saving) return;

    setSaving(true);

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ecfdf5',
        scale: window.devicePixelRatio > 1 ? 1.5 : 1,
        useCORS: true,
        scrollY: -window.scrollY, // QUAN TRỌNG
      });

      const dataUrl = canvas.toDataURL('image/png');

      // Mobile-safe: open image
      const win = window.open();
      if (win) {
        win.document.write(
          `<img src="${dataUrl}" style="width:100%;height:auto" />`,
        );
      } else {
        // fallback
        await navigator.clipboard.writeText(dataUrl);
        alert('Không mở được tab mới. Ảnh đã được copy dạng base64.');
      }
    } catch (e) {
      console.error('Save image error:', e);
      alert('Không thể lưu ảnh. Vui lòng thử lại!');
    } finally {
      setSaving(false);
    }
  }, [saving]);

  if (!data) {
    return (
      <div className='min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6'>
        <div className='text-center max-w-md'>
          <div className='text-6xl mb-6'>🔍</div>
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Kết quả không tìm thấy
          </h2>
          <p className='text-gray-600 mb-8'>
            Có thể kết quả đã hết hạn hoặc session không tồn tại.
          </p>
          <div className='flex flex-col gap-3'>
            <Link
              to='/test'
              className='px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all'
            >
              Làm bài test mới
            </Link>
            <Link
              to='/'
              className='px-6 py-3 text-gray-600 hover:text-gray-800 text-center'
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    personality,
    userResults,
    objectiveAssessment,
    careerRecommendations,
    numerology,
    learningRoadmap,
    funFacts,
  } = data;

  return (
    <div
      ref={resultRef}
      className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50'
    >
      {/* Hero Section */}
      <div>
        <section className='relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white'>
          <div className='absolute inset-0 opacity-10'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='absolute rounded-full bg-white'
                style={{
                  width: `${60 + i * 40}px`,
                  height: `${60 + i * 40}px`,
                  left: `${15 + i * 18}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
              />
            ))}
          </div>
          <div className='relative z-10 max-w-4xl mx-auto px-4 py-10 md:py-20 text-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <div className='text-6xl md:text-8xl mb-4'>
                {personality?.emoji || '🌟'}
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='text-3xl md:text-5xl font-bold mb-4'
            >
              {personality?.title || 'Kết quả của bạn'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className='text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed'
            >
              {personality?.summary}
            </motion.p>
          </div>
        </section>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-6 space-y-8 md:py-8 md:space-y-10'>
        {/* Score Cards */}
        <motion.section
          variants={stagger}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'
          >
            📊 Điểm số tổng quan
          </motion.h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
            <motion.div
              variants={fadeUp}
              className='bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100'
            >
              <h3 className='text-sm font-semibold text-gray-500 mb-4'>
                IQ - Tư duy logic
              </h3>
              <div className='flex items-center justify-between'>
                <CircularProgress
                  value={userResults?.iqScore || 0}
                  max={userResults?.iqOutOf || 5}
                />
                <div className='text-right'>
                  <div className='text-2xl font-bold text-emerald-600'>
                    {userResults?.iqLevel || 'N/A'}
                  </div>
                  <div className='text-sm text-gray-500'>Mức độ</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
            >
              <h3 className='text-sm font-semibold text-gray-500 mb-4'>
                EQ - Trí tuệ cảm xúc
              </h3>
              <div className='space-y-2.5'>
                <EQBar
                  label='Tự nhận thức'
                  value={userResults?.eqScores?.selfAwareness || 0}
                />
                <EQBar
                  label='Kiểm soát'
                  value={userResults?.eqScores?.emotionalControl || 0}
                />
                <EQBar
                  label='Đồng cảm'
                  value={userResults?.eqScores?.empathy || 0}
                />
              </div>
              <div className='mt-3 text-right'>
                <span className='text-lg font-bold text-rose-500'>
                  {userResults?.eqLevel || 'N/A'}
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
            >
              <h3 className='text-sm font-semibold text-gray-500 mb-4'>
                Career - Sở thích
              </h3>
              <div className='flex flex-wrap gap-2 mb-3'>
                {(userResults?.careerInterests || []).map((interest, i) => (
                  <span
                    key={i}
                    className='px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium'
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <div className='text-sm text-gray-500'>
                <span className='font-medium'>Môi trường:</span>{' '}
                {userResults?.workEnvironment || 'N/A'}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Personality Section */}
        <motion.section
          variants={stagger}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'
          >
            ✨ Tính cách của bạn
          </motion.h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <motion.div
              variants={fadeUp}
              className='bg-emerald-50 rounded-2xl p-6 border border-emerald-100'
            >
              <h3 className='text-lg font-semibold text-emerald-800 mb-4'>
                💪 Điểm mạnh
              </h3>
              <ul className='space-y-3'>
                {(personality?.strengths || []).map((s, i) => (
                  <li key={i} className='flex items-start gap-2'>
                    <span className='text-emerald-500 mt-0.5'>✓</span>
                    <span className='text-gray-700'>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className='bg-amber-50 rounded-2xl p-6 border border-amber-100'
            >
              <h3 className='text-lg font-semibold text-amber-800 mb-4'>
                🌱 Cần phát triển
              </h3>
              <ul className='space-y-3'>
                {(personality?.growthAreas || []).map((g, i) => (
                  <li key={i} className='flex items-start gap-2'>
                    <span className='text-amber-500 mt-0.5'>→</span>
                    <span className='text-gray-700'>{g}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          {personality?.funDescription && (
            <motion.div
              variants={fadeUp}
              className='mt-4 bg-purple-50 rounded-2xl p-6 border border-purple-100'
            >
              <p className='text-purple-800 text-lg italic text-center'>
                &ldquo;{personality.funDescription}&rdquo;
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Objective Assessment */}
        <motion.section
          variants={stagger}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'
          >
            🔍 Đánh giá khách quan
          </motion.h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[
              {
                title: '🧠 Phân tích IQ',
                text: objectiveAssessment?.iqAnalysis,
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                titleColor: 'text-blue-800',
              },
              {
                title: '💝 Phân tích EQ',
                text: objectiveAssessment?.eqAnalysis,
                bg: 'bg-pink-50',
                border: 'border-pink-100',
                titleColor: 'text-pink-800',
              },
              {
                title: '💼 Sự phù hợp nghề',
                text: objectiveAssessment?.careerFit,
                bg: 'bg-teal-50',
                border: 'border-teal-100',
                titleColor: 'text-teal-800',
              },
              {
                title: '📋 Tổng quan',
                text: objectiveAssessment?.overallProfile,
                bg: 'bg-gray-50',
                border: 'border-gray-200',
                titleColor: 'text-gray-800',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`${item.bg} rounded-2xl p-6 border ${item.border}`}
              >
                <h3 className={`font-semibold ${item.titleColor} mb-3`}>
                  {item.title}
                </h3>
                <p className='text-gray-700 leading-relaxed break-words'>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Career Recommendations */}
        <motion.section
          variants={stagger}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'
          >
            🎯 Top 5 nghề phù hợp
          </motion.h2>
          <div className='space-y-4'>
            {(careerRecommendations || []).map((career, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'
              >
                <div className='flex items-start gap-4'>
                  <div className='text-4xl shrink-0'>{career.emoji}</div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between flex-wrap gap-2 mb-2'>
                      <h3 className='text-lg font-bold text-gray-900'>
                        {career.title}
                      </h3>
                      <span className='text-lg font-bold text-emerald-600'>
                        {career.matchPercent}%
                      </span>
                    </div>
                    <MatchBar percent={career.matchPercent} />
                    <p className='text-gray-600 mt-3 mb-3'>{career.reason}</p>
                    <div className='flex flex-wrap gap-4 text-sm mb-3'>
                      <span className='text-gray-500'>
                        💰 {career.salaryRange}
                      </span>
                      <span className='text-gray-500'>
                        📈 {career.demandLevel}
                      </span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {(career.skills || []).map((skill, j) => (
                        <span
                          key={j}
                          className='px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Numerology Section */}
        <motion.section
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className='bg-linear-to-br from-purple-600 via-indigo-600 to-violet-700 rounded-3xl p-6 md:p-10 text-white overflow-hidden relative'
          >
            <div className='absolute inset-0 opacity-10'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='absolute text-6xl'
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${10 + (i % 3) * 35}%`,
                    transform: `rotate(${i * 45}deg)`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
            <div className='relative z-10'>
              <h2 className='text-2xl font-bold mb-8 flex items-center gap-2'>
                🔮 Thần số học
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                  <div className='text-5xl font-bold mb-2'>
                    {numerology?.lifePathNumber || '?'}
                  </div>
                  <div className='text-white/70 text-sm mb-3'>
                    Số chủ đạo (Life Path)
                  </div>
                  <p className='text-white/90 leading-relaxed'>
                    {numerology?.lifePathMeaning}
                  </p>
                </div>
                <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                  <div className='text-5xl font-bold mb-2'>
                    {numerology?.personalityNumber || '?'}
                  </div>
                  <div className='text-white/70 text-sm mb-3'>Số tính cách</div>
                  <p className='text-white/90 leading-relaxed'>
                    {numerology?.personalityMeaning}
                  </p>
                </div>
              </div>
              {numerology?.careerAlignment && (
                <div className='mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6'>
                  <h3 className='font-semibold mb-2'>🎯 Liên hệ nghề nghiệp</h3>
                  <p className='text-white/90 leading-relaxed'>
                    {numerology.careerAlignment}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* Learning Roadmap */}
        <motion.section initial={{ opacity: 1 }}>
          <motion.h2
            variants={fadeUp}
            className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'
          >
            📚 Lộ trình học tập
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className='flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300'
          >
            {(learningRoadmap || []).map((rm, i) => (
              <button
                key={i}
                onClick={() => setExpandedRoadmap(i)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  expandedRoadmap === i
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {rm.career}
              </button>
            ))}
          </motion.div>
          {learningRoadmap && learningRoadmap[expandedRoadmap] && (
            <motion.div
              key={expandedRoadmap}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-4'
            >
              {learningRoadmap[expandedRoadmap].phases.map((phase, i) => (
                <motion.div
                  key={`${expandedRoadmap}-${i}`}
                  variants={fadeUp}
                  className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative'
                >
                  {i < learningRoadmap[expandedRoadmap].phases.length - 1 && (
                    <div className='absolute left-10 top-full w-0.5 h-4 bg-emerald-200' />
                  )}
                  <div className='flex items-start gap-4'>
                    <div className='w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold shrink-0'>
                      {i + 1}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-gray-900 mb-3'>
                        {phase.phase}
                      </h3>
                      <div className='mb-3'>
                        <h4 className='text-sm font-semibold text-gray-500 mb-2'>
                          Việc cần làm:
                        </h4>
                        <ul className='space-y-1.5'>
                          {(phase.tasks || []).map((task, j) => (
                            <li
                              key={j}
                              className='flex items-start gap-2 text-sm text-gray-700 leading-relaxed'
                            >
                              <span className='text-emerald-500 mt-0.5'>•</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className='text-sm font-semibold text-gray-500 mb-2'>
                          Tài nguyên:
                        </h4>
                        <div className='flex flex-wrap gap-2'>
                          {(phase.resources || []).map((res, j) => (
                            <span
                              key={j}
                              className='px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm'
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Fun Facts */}
        <motion.section
          variants={stagger}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'
          >
            💫 Fun Facts
          </motion.h2>
          <div className='flex gap-4 overflow-x-auto pb-4'>
            {(funFacts || []).map((fact, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className='min-w-65 max-w-75 bg-linear-to-br from-violet-50 to-purple-50 rounded-2xl p-4 md:p-6 border border-purple-100 shrink-0'
              >
                <div className='text-3xl mb-3'>{fact.emoji}</div>
                <p className='text-gray-700 leading-relaxed text-sm'>
                  {fact.fact}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Action Bar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
        >
          <div className='flex flex-col sm:flex-row gap-3 md:gap-4 justify-center'>
            <button
              onClick={handleShare}
              className='px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2'
            >
              📤 Chia sẻ kết quả
            </button>
            <button
              onClick={handleSaveImage}
              disabled={saving}
              className='px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50'
            >
              {saving ? '⏳ Đang lưu...' : '📸 Lưu ảnh kết quả'}
            </button>
            <button
              onClick={() => {
                resetTest();
                navigate('/test');
              }}
              className='px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2'
            >
              🔄 Làm lại test
            </button>
            <Link
              to='/'
              className='px-6 py-3 text-gray-500 hover:text-gray-700 text-center flex items-center justify-center gap-2'
            >
              🏠 Về trang chủ
            </Link>
          </div>
        </motion.section>

        <div className='h-8' />
      </div>
    </div>
  );
}

export default ResultsPage;
