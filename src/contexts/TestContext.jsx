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

const MODULES = [
  { id: 'iq', name: 'IQ Test', icon: '🧠', questionCount: 5 },
  { id: 'eq', name: 'EQ Test', icon: '💝', questionCount: 5 },
  { id: 'career', name: 'Career', icon: '💼', questionCount: 5 },
  { id: 'personal', name: 'About You', icon: '✨', questionCount: 6 },
];

const IQ_CORRECT_ANSWERS = {
  iq_001: 42,
  iq_002: 'B',
  iq_003: 5,
  iq_004: 'dog',
  iq_005: 'carrot',
};

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

  const [sessionId, setSessionId] = useState(null);
  const [currentModule, setCurrentModule] = useState('iq');
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState({
    completedModules: [],
    totalModules: 4,
    answeredQuestions: 0,
    totalQuestions: 21,
  });
  const [moduleProgress, setModuleProgress] = useState({});

  const modules = MODULES;

  useEffect(() => {
    const savedSession = localStorage.getItem('PathX_session');
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
          },
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
      localStorage.setItem('PathX_session', JSON.stringify(session));
    }
  }, [sessionId, currentModule, answers, progress, moduleProgress]);

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

  const completeModule = useCallback((moduleId) => {
    setProgress((prev) => ({
      ...prev,
      completedModules: [...prev.completedModules, moduleId],
    }));
  }, []);

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

  const goToPreviousModule = useCallback(() => {
    const currentIndex = modules.findIndex((m) => m.id === currentModule);
    if (currentIndex > 0) {
      const prevModule = modules[currentIndex - 1];
      setCurrentModule(prevModule.id);
      navigate(`/test/${prevModule.id}`);
    }
  }, [modules, currentModule, navigate]);

  const submitTest = useCallback(async () => {
    try {
      const scores = computeScores(answers);
      const aiPrompt = generateAIPrompt(scores, answers.personal);

      localStorage.setItem(
        `PathX_prompt_${sessionId}`,
        JSON.stringify({
          sessionId,
          prompt: aiPrompt,
          scores,
          answers,
          timestamp: new Date().toISOString(),
        }),
      );

      navigate('/loading');
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  }, [sessionId, answers, navigate]);

  const resetTest = useCallback(() => {
    localStorage.removeItem('PathX_session');
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

  const getCurrentModuleInfo = useCallback(() => {
    return modules.find((m) => m.id === currentModule);
  }, [modules, currentModule]);

  const isModuleCompleted = useCallback(
    (moduleId) => {
      return progress.completedModules.includes(moduleId);
    },
    [progress.completedModules],
  );

  const getProgressPercentage = useCallback(() => {
    return Math.round(
      (progress.answeredQuestions / progress.totalQuestions) * 100,
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
    [moduleProgress],
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

function computeScores(answers) {
  const iqAnswers = answers.iq || {};
  let iqCorrect = 0;
  for (const [qId, answer] of Object.entries(iqAnswers)) {
    if (IQ_CORRECT_ANSWERS[qId] !== undefined && answer === IQ_CORRECT_ANSWERS[qId]) {
      iqCorrect++;
    }
  }

  const eqAnswers = answers.eq || {};
  const numericEqKeys = ['eq_001', 'eq_003', 'eq_004'];
  const eqNumericScores = numericEqKeys
    .map((k) => eqAnswers[k])
    .filter((v) => typeof v === 'number');
  const eqAverage =
    eqNumericScores.length > 0
      ? Math.round(
          (eqNumericScores.reduce((a, b) => a + b, 0) / eqNumericScores.length) * 10,
        ) / 10
      : 0;

  const careerAnswers = answers.career || {};

  return {
    iq: {
      score: iqCorrect,
      outOf: 5,
    },
    eq: {
      selfAwareness: eqAnswers.eq_001 || 0,
      emotionalControl: eqAnswers.eq_004 || 0,
      empathy: eqAnswers.eq_003 || 0,
      socialResponse: eqAnswers.eq_002 || null,
      conflictStyle: eqAnswers.eq_005 || null,
      average: eqAverage,
    },
    career: {
      interests: careerAnswers.career_001 || [],
      workStyle: careerAnswers.career_002 || null,
      passionVsMoney: careerAnswers.career_003 || 3,
      workEnvironment: careerAnswers.career_004 || null,
      coreValues: careerAnswers.career_005 || [],
    },
  };
}

function generateAIPrompt(scores, personalInfo) {
  const personal = personalInfo || {};

  const JSON_SCHEMA = `{
  "userResults": {
    "iqScore": <number>,
    "iqOutOf": 5,
    "iqLevel": "<string: Thấp/Trung bình/Khá/Cao/Xuất sắc>",
    "eqScores": {
      "selfAwareness": <number 1-5>,
      "emotionalControl": <number 1-5>,
      "empathy": <number 1-5>,
      "conflictStyle": "<string>"
    },
    "eqLevel": "<string: Thấp/Trung bình/Khá/Cao/Xuất sắc>",
    "careerInterests": [<string>],
    "workStyle": "<string>",
    "passionVsMoney": <number 1-5>,
    "workEnvironment": "<string>",
    "coreValues": [<string>]
  },
  "personality": {
    "title": "<string: tên tính cách ngắn gọn, cool, teen-friendly>",
    "emoji": "<single emoji>",
    "summary": "<string: 2-3 câu tóm tắt tính cách, vibes teen>",
    "strengths": ["<string>", "<string>", "<string>"],
    "growthAreas": ["<string>", "<string>", "<string>"],
    "funDescription": "<string: 1-2 câu so sánh vui, ví dụ 'Nếu là anime character thì bạn là...'>"
  },
  "objectiveAssessment": {
    "iqAnalysis": "<string: 2-3 câu phân tích IQ, teen-friendly>",
    "eqAnalysis": "<string: 2-3 câu phân tích EQ, teen-friendly>",
    "careerFit": "<string: 2-3 câu phân tích sự phù hợp nghề>",
    "overallProfile": "<string: 2-3 câu tổng quan, teen-friendly, khách quan>"
  },
  "careerRecommendations": [
    {
      "title": "<string: tên nghề>",
      "emoji": "<single emoji>",
      "matchPercent": <number 60-95>,
      "reason": "<string: 1-2 câu lý do phù hợp>",
      "salaryRange": "<string: ví dụ '15-40 triệu/tháng'>",
      "demandLevel": "<string: Thấp/Trung bình/Cao/Rất cao>",
      "skills": ["<string>", "<string>", "<string>", "<string>"]
    }
  ],
  "numerology": {
    "lifePathNumber": <number>,
    "lifePathMeaning": "<string: 2-3 câu giải thích số chủ đạo>",
    "personalityNumber": <number>,
    "personalityMeaning": "<string: 2-3 câu giải thích số tính cách>",
    "careerAlignment": "<string: 2-3 câu liên hệ thần số học với nghề>"
  },
  "learningRoadmap": [
    {
      "career": "<string: tên nghề>",
      "phases": [
        {
          "phase": "<string: ví dụ 'Nền tảng (0-6 tháng)'>",
          "tasks": ["<string>", "<string>", "<string>"],
          "resources": ["<string>", "<string>", "<string>"]
        }
      ]
    }
  ],
  "funFacts": [
    {
      "emoji": "<single emoji>",
      "fact": "<string: fun fact về thần số học hoặc career>"
    }
  ]
}`;

  const interestLabels = {
    tech: 'Công nghệ (lập trình, AI, game)',
    business: 'Kinh doanh (bán hàng, quản lý)',
    creative: 'Sáng tạo (thiết kế, vẽ, film)',
    healthcare: 'Y tế (bác sĩ, dược)',
    education: 'Giáo dục (dạy học, đào tạo)',
    marketing: 'Marketing (quảng cáo, truyền thông)',
    engineering: 'Kỹ thuật (xây dựng, cơ khí)',
    media: 'Media (nội dung, báo chí)',
  };

  const envLabels = {
    startup: 'Nơi năng động, thay đổi liên tục',
    corporate: 'Nơi ổn định, có lộ trình rõ ràng',
    freelance: 'Tự do, tự quyết định mọi thứ',
    ngo: 'Tổ chức giúp đỡ xã hội',
    government: 'Nhà nước, ổn định lâu dài',
  };

  const valueLabels = {
    growth: 'Phát triển bản thân',
    balance: 'Cân bằng học tập và vui chơi',
    impact: 'Giúp ích cho xã hội',
    income: 'Thu nhập cao',
    recognition: 'Được công nhận',
    autonomy: 'Tự chủ',
    teamwork: 'Làm việc nhóm',
    innovation: 'Sáng tạo',
  };

  const interests = (scores.career.interests || [])
    .map((i) => interestLabels[i] || i)
    .join(', ');
  const env = envLabels[scores.career.workEnvironment] || scores.career.workEnvironment;
  const values = (scores.career.coreValues || [])
    .map((v) => valueLabels[v] || v)
    .join(', ');
  const workStyle =
    scores.career.workStyle === 'remote'
      ? 'Làm việc từ xa (remote)'
      : 'Làm việc tại văn phòng';

  return `Bạn là chuyên gia hướng nghiệp cho học sinh Việt Nam Gen Z (16-19 tuổi). Hãy phân tích kết quả bài test và tạo báo cáo hướng nghiệp.

QUAN TRỌNG: Trả về DUY NHẤT một JSON object theo đúng schema bên dưới. KHÔNG thêm text nào khác ngoài JSON.

## DỮ LIỆU HỌC SINH

Tên: ${personal.full_name || 'Không rõ'}
Ngày sinh: ${personal.birth_date || 'Không rõ'} (Ngày: ${personal.birth_day || '?'}, Tháng: ${personal.birth_month || '?'}, Năm: ${personal.birth_year || '?'})
Tuổi: ${personal.age || 'Không rõ'}
Giới tính: ${personal.gender === 'male' ? 'Nam' : personal.gender === 'female' ? 'Nữ' : 'Khác'}

Điều yêu thích: ${personal.likes || 'Không rõ'}
Điều không thích: ${personal.dislikes || 'Không rõ'}
Ước mơ: ${personal.dreams || 'Không rõ'}

## KẾT QUẢ TEST

### IQ (Tư duy logic):
- Số câu đúng: ${scores.iq.score}/${scores.iq.outOf}

### EQ (Trí tuệ cảm xúc):
- Tự nhận thức cảm xúc: ${scores.eq.selfAwareness}/5
- Kiểm soát cảm xúc: ${scores.eq.emotionalControl}/5
- Đồng cảm với người khác: ${scores.eq.empathy}/5
- Phản ứng xã hội: ${scores.eq.socialResponse === 'space' ? 'Cho không gian riêng' : scores.eq.socialResponse === 'approach' ? 'Đến hỏi thăm ngay' : scores.eq.socialResponse || 'Không rõ'}
- Xử lý xung đột: ${scores.eq.conflictStyle === 'confront' ? 'Nói thẳng ngay' : scores.eq.conflictStyle === 'process' ? 'Suy nghĩ trước rồi mới nói' : scores.eq.conflictStyle || 'Không rõ'}
- Điểm EQ trung bình: ${scores.eq.average}/5

### Career (Sở thích nghề nghiệp):
- Ngành hứng thú: ${interests || 'Không rõ'}
- Phong cách làm việc: ${workStyle}
- Ưu tiên Lương vs Đam mê: ${scores.career.passionVsMoney}/5 (1=Lương cao, 5=Đam mê)
- Môi trường: ${env || 'Không rõ'}
- Giá trị cốt lõi: ${values || 'Không rõ'}

## YÊU CẦU JSON OUTPUT

${JSON_SCHEMA}

## QUY TẮC:
- Tất cả text PHẢI bằng tiếng Việt, giọng teen-friendly, casual, dùng emoji tự nhiên
- careerRecommendations: ĐÚNG 5 nghề, matchPercent từ 60-95, realistic
- learningRoadmap: 1 roadmap cho MỖI nghề đề xuất (5 roadmaps), mỗi cái 3 phases
- funFacts: ĐÚNG 5 fun facts về thần số học và career
- numerology: Tính CHÍNH XÁC life path number từ ngày sinh ${personal.birth_date || ''}
- Giọng văn phải RẤT teen: nói chuyện như bạn bè, dùng từ Gen Z, references anime/game/TikTok
- Khách quan nhưng tích cực, chỉ ra điểm cần cải thiện một cách nhẹ nhàng`;
}
