import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const TestContext = createContext();

// ✅ UPDATED: 4 modules mới với question count chính xác
const MODULES = [
  { id: 'iq', name: 'IQ Test', icon: '🧠', questionCount: 5 },
  { id: 'eq', name: 'EQ Test', icon: '💝', questionCount: 5 },
  { id: 'career', name: 'Career', icon: '💼', questionCount: 5 },
  { id: 'personal', name: 'About You', icon: '✨', questionCount: 6 },
];

// eslint-disable-next-line react-refresh/only-export-components
export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within TestProvider');
  }
  return context;
};

export const TestProvider = ({ children }) => {
  const navigate = useNavigate();
  const isInitializing = useRef(true);

  // Session & Progress
  const [sessionId, setSessionId] = useState(null);
  const [currentModule, setCurrentModule] = useState('iq'); // ✅ Start with IQ

  // Test answers
  const [answers, setAnswers] = useState({});

  // ✅ UPDATED: Progress tracking với numbers mới
  const [progress, setProgress] = useState({
    completedModules: [],
    totalModules: 4, // ✅ 4 modules
    answeredQuestions: 0,
    totalQuestions: 21, // ✅ 5+5+5+6 = 21
  });

  // Module progress
  const [moduleProgress, setModuleProgress] = useState({});

  const modules = MODULES;

  // Initialize session
  useEffect(() => {
    const savedSession = localStorage.getItem('daph2_session');

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setSessionId(session.sessionId);
        setCurrentModule(session.currentModule || 'iq');
        setAnswers(session.answers || {});
        setProgress(
          session.progress || {
            completedModules: [],
            totalModules: 4,
            answeredQuestions: 0,
            totalQuestions: 21,
          }
        );
        setModuleProgress(session.moduleProgress || {});
      } catch (error) {
        console.error('Error loading session:', error);
        const newSessionId = nanoid();
        setSessionId(newSessionId);
      }
    } else {
      const newSessionId = nanoid();
      setSessionId(newSessionId);
    }

    isInitializing.current = false;
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!isInitializing.current && sessionId) {
      const session = {
        sessionId,
        currentModule,
        answers,
        progress,
        moduleProgress,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('daph2_session', JSON.stringify(session));
    }
  }, [sessionId, currentModule, answers, progress, moduleProgress]);

  // Save answer
  const saveAnswer = useCallback((moduleId, questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [questionId]: answer,
      },
    }));

    setProgress((prev) => ({
      ...prev,
      answeredQuestions: prev.answeredQuestions + 1,
    }));
  }, []);

  // Mark module as complete
  const completeModule = useCallback((moduleId) => {
    setProgress((prev) => ({
      ...prev,
      completedModules: [...prev.completedModules, moduleId],
    }));
  }, []);

  // Navigate to next module
  const goToNextModule = useCallback(() => {
    const currentIndex = modules.findIndex((m) => m.id === currentModule);

    if (currentIndex < modules.length - 1) {
      const nextModule = modules[currentIndex + 1];
      setCurrentModule(nextModule.id);
      navigate(`/test/${nextModule.id}`);
    } else {
      navigate('/loading');
    }
  }, [modules, currentModule, navigate]);

  // Navigate to previous module
  const goToPreviousModule = useCallback(() => {
    const currentIndex = modules.findIndex((m) => m.id === currentModule);

    if (currentIndex > 0) {
      const prevModule = modules[currentIndex - 1];
      setCurrentModule(prevModule.id);
      navigate(`/test/${prevModule.id}`);
    }
  }, [modules, currentModule, navigate]);

  // ✅ UPDATED: Generate AI prompt and submit test
  const submitTest = useCallback(async () => {
    try {
      // ====================================
      // GENERATE AI ANALYSIS PROMPT
      // ====================================
      const aiPrompt = generateAIPrompt(answers);

      console.log('=== DAPH2 TEST COMPLETED ===');
      console.log('Session ID:', sessionId);
      console.log('Total Answers:', Object.keys(answers).length);
      console.log('\n=== AI PROMPT GENERATED ===\n');
      console.log(aiPrompt);
      console.log('\n=========================\n');

      // ====================================
      // TODO: SEND TO AI API
      // ====================================
      // const response = await fetch('/api/analyze', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sessionId,
      //     prompt: aiPrompt,
      //     answers: answers
      //   })
      // });
      // const result = await response.json();

      // ====================================
      // TODO: SAVE TO SUPABASE
      // ====================================
      // await supabase.from('test_sessions').update({
      //   status: 'completed',
      //   ai_prompt: aiPrompt,
      //   completed_at: new Date().toISOString()
      // }).eq('id', sessionId);

      // Save AI prompt to localStorage for now
      localStorage.setItem(
        `daph2_prompt_${sessionId}`,
        JSON.stringify({
          sessionId,
          prompt: aiPrompt,
          answers,
          timestamp: new Date().toISOString(),
        })
      );

      // Navigate to loading screen
      navigate('/loading');
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  }, [sessionId, answers, navigate]);

  // Reset test
  const resetTest = useCallback(() => {
    localStorage.removeItem('daph2_session');
    const newSessionId = nanoid();
    setSessionId(newSessionId);
    setCurrentModule('iq');
    setAnswers({});
    setProgress({
      completedModules: [],
      totalModules: 4,
      answeredQuestions: 0,
      totalQuestions: 21,
    });
    setModuleProgress({});
    navigate('/test');
  }, [navigate]);

  // Helpers
  const getCurrentModuleInfo = useCallback(() => {
    return modules.find((m) => m.id === currentModule);
  }, [modules, currentModule]);

  const isModuleCompleted = useCallback(
    (moduleId) => {
      return progress.completedModules.includes(moduleId);
    },
    [progress.completedModules]
  );

  const getProgressPercentage = useCallback(() => {
    return Math.round(
      (progress.answeredQuestions / progress.totalQuestions) * 100
    );
  }, [progress.answeredQuestions, progress.totalQuestions]);

  const setModuleQuestionIndex = useCallback((moduleId, questionIndex) => {
    setModuleProgress((prev) => ({
      ...prev,
      [moduleId]: questionIndex,
    }));
  }, []);

  const getModuleQuestionIndex = useCallback(
    (moduleId) => {
      return moduleProgress[moduleId] || 0;
    },
    [moduleProgress]
  );

  const value = {
    sessionId,
    currentModule,
    answers,
    progress,
    modules,
    moduleProgress,
    saveAnswer,
    completeModule,
    goToNextModule,
    goToPreviousModule,
    submitTest,
    resetTest,
    getCurrentModuleInfo,
    isModuleCompleted,
    getProgressPercentage,
    setModuleQuestionIndex,
    getModuleQuestionIndex,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

// ====================================
// AI PROMPT GENERATOR
// ====================================
function generateAIPrompt(answers) {
  const prompt = `# DAPH2 Smart Orientation - Career Guidance Analysis

## Candidate Profile Assessment

Please analyze this Vietnamese teenager's career assessment results and provide comprehensive guidance in Vietnamese.

---

## 📊 TEST RESULTS

### 1. IQ TEST (Logical Reasoning)
${formatModuleAnswers(answers.iq, 'IQ')}

### 2. EQ TEST (Emotional Intelligence)
${formatModuleAnswers(answers.eq, 'EQ')}

### 3. CAREER TEST (Work Preferences)
${formatModuleAnswers(answers.career, 'Career')}

### 4. PERSONAL INFORMATION
${formatPersonalInfo(answers.personal)}

---

## 🎯 ANALYSIS REQUEST

Please provide a comprehensive career guidance report in Vietnamese with the following sections:

### 1. PERSONALITY OVERVIEW (Tổng quan tính cách)
- Core personality traits based on IQ and EQ results
- Strengths and growth areas
- Working style preferences

### 2. EMOTIONAL INTELLIGENCE ANALYSIS (Phân tích EQ)
- Empathy level and social awareness
- Self-awareness and emotional regulation
- Relationship management style

### 3. CAREER RECOMMENDATIONS (Gợi ý nghề nghiệp)
- Top 5 suitable career paths with reasoning
- Industries that align with their profile
- Work environment preferences (startup/corporate/freelance)

### 4. EDUCATION PATH (Lộ trình học tập)
- Recommended majors/fields of study
- Skills to develop
- Learning style suggestions

### 5. NUMEROLOGY INSIGHTS (Thần số học) 
Based on birth date: ${answers.personal?.birth_date || 'Not provided'}
- Life path number and meaning
- Master number analysis
- Name numerology (if provided)
- Career alignment with numerology

### 6. ACTION PLAN (Kế hoạch hành động)
- Short-term steps (next 6 months)
- Long-term goals (1-3 years)
- Resources and next steps

### 7. IKIGAI FRAMEWORK (Biểu đồ Ikigai)
Create an Ikigai analysis showing:
- What they LOVE (from likes/dreams)
- What they're GOOD AT (from IQ/skills)
- What the WORLD NEEDS (from values)
- What they can be PAID FOR (from career preferences)

---

## 📝 FORMATTING REQUIREMENTS

- Write in Vietnamese, friendly tone for teenagers
- Use emojis for visual appeal
- Include specific examples and actionable advice
- Reference their actual answers in the analysis
- Be encouraging and realistic
- Format with clear headers and bullet points

---

## 🔒 IMPORTANT NOTES

- This is a 16-19 year old Vietnamese student
- Focus on Vietnamese education system and job market
- Consider work-life balance preferences
- Respect their stated values and dreams
- Provide both idealistic and practical advice

Please generate the complete analysis now.`;

  return prompt;
}

// Helper: Format module answers with ACTUAL QUESTIONS
function formatModuleAnswers(moduleAnswers, moduleName) {
  if (!moduleAnswers) return `No ${moduleName} data available.`;

  // Question mappings - extracted from actual test modules
  const questionMappings = {
    iq: {
      iq_001: 'Tìm số tiếp theo trong dãy: 2, 4, 8, 16, 32, ?',
      iq_002: 'Số nào không cùng nhóm: 3, 6, 9, 12, 14, 18?',
      iq_003: 'Nếu A=1, B=2, C=3... thì CAT = ?',
      iq_004:
        '3 con mèo bắt 3 con chuột trong 3 phút. 100 con mèo bắt 100 con chuột mất bao lâu?',
      iq_005: 'Hình nào hoàn thành pattern?',
    },
    eq: {
      eq_001: 'Bạn thường nhận ra cảm xúc của mình nhanh như thế nào?',
      eq_002: 'Khi ai đó chỉ trích ý kiến của bạn trong meeting, bạn cảm thấy:',
      eq_003: 'Bạn có thể điều khiển cảm xúc của mình khi giận dữ?',
      eq_004: 'Bạn có dễ dàng đọc được cảm xúc người khác qua nét mặt?',
      eq_005: 'Khi xung đột xảy ra, bạn cảm thấy:',
    },
    career: {
      career_001: 'Chọn 3 ngành nghề bạn hứng thú nhất',
      career_002: 'Bạn thích làm việc: Remote/WFH hay Office?',
      career_003:
        'Lương cao vs Đam mê - Bạn ưu tiên cái nào? (1=Lương cao, 5=Đam mê)',
      career_004: 'Môi trường làm việc lý tưởng của bạn',
      career_005: 'Top 3 giá trị quan trọng nhất trong công việc',
    },
  };

  const moduleQuestions = questionMappings[moduleName] || {};

  return Object.entries(moduleAnswers)
    .map(([questionId, answer]) => {
      const question = moduleQuestions[questionId] || questionId;

      // Format answer based on type
      let formattedAnswer;
      if (Array.isArray(answer)) {
        formattedAnswer = answer.join(', ');
      } else if (typeof answer === 'object') {
        formattedAnswer = JSON.stringify(answer);
      } else {
        formattedAnswer = answer;
      }

      return `**Q: ${question}**\nA: ${formattedAnswer}`;
    })
    .join('\n\n');
}

// Helper: Format personal info
function formatPersonalInfo(personalInfo) {
  if (!personalInfo) return 'No personal information provided.';

  return `
**Full Name:** ${personalInfo.full_name || 'Not provided'}
**Birth Date:** ${personalInfo.birth_date || 'Not provided'} (Day: ${
    personalInfo.birth_day
  }, Month: ${personalInfo.birth_month}, Year: ${personalInfo.birth_year})
**Age:** ${personalInfo.age || 'Not provided'}
**Gender:** ${personalInfo.gender || 'Not provided'}

**What they LOVE:**
${personalInfo.likes || 'Not provided'}

**What they DISLIKE:**
${personalInfo.dislikes || 'Not provided'}

**Dreams & Goals:**
${personalInfo.dreams || 'Not provided'}
`;
}
