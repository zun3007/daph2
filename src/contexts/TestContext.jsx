import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const TestContext = createContext();

const modules = [
  { id: 'personality', name: 'Tính Cách', icon: '🎭', questionCount: 20 },
  { id: 'behavior', name: 'Hành Vi', icon: '🎯', questionCount: 15 },
  { id: 'iq', name: 'IQ', icon: '🧠', questionCount: 12 },
  { id: 'eq', name: 'EQ', icon: '💝', questionCount: 15 },
  { id: 'ikigai', name: 'Ikigai', icon: '🌟', questionCount: 16 },
  { id: 'career', name: 'Nghề Nghiệp', icon: '💼', questionCount: 10 },
  { id: 'personal', name: 'Cá Nhân', icon: '👤', questionCount: 8 },
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

  // Session & Progress
  const [sessionId, setSessionId] = useState(null);
  const [currentModule, setCurrentModule] = useState('personality');

  // Test answers
  const [answers, setAnswers] = useState({
    personality: {},
    behavior: {},
    iq: {},
    eq: {},
    ikigai: {},
    career: {},
    personal: {},
  });

  // Progress tracking
  const [progress, setProgress] = useState({
    completedModules: [],
    totalModules: 7,
    answeredQuestions: 0,
    totalQuestions: 96, // Approximate total
  });

  const saveSession = (sid, module, answersData, progressData) => {
    const session = {
      sessionId: sid,
      currentModule: module,
      answers: answersData,
      progress: progressData,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('daph2_session', JSON.stringify(session));
  };

  // Initialize session
  useEffect(() => {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('daph2_session');

    if (savedSession) {
      const session = JSON.parse(savedSession);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionId(session.sessionId);
      setCurrentModule(session.currentModule);
      setAnswers(session.answers);
      setProgress(session.progress);
    } else {
      // Create new session
      const newSessionId = nanoid();
      setSessionId(newSessionId);
      saveSession(newSessionId, 'personality', {}, progress);
    }
  }, [progress]);

  // Auto-save on changes
  useEffect(() => {
    if (sessionId) {
      saveSession(sessionId, currentModule, answers, progress);
    }
  }, [sessionId, currentModule, answers, progress]);

  // Save answer for a question
  const saveAnswer = (moduleId, questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [questionId]: answer,
      },
    }));

    // Update progress
    setProgress((prev) => ({
      ...prev,
      answeredQuestions: prev.answeredQuestions + 1,
    }));
  };

  // Mark module as complete
  const completeModule = (moduleId) => {
    setProgress((prev) => ({
      ...prev,
      completedModules: [...prev.completedModules, moduleId],
    }));
  };

  // Navigate to next module
  const goToNextModule = () => {
    const currentIndex = modules.findIndex((m) => m.id === currentModule);

    if (currentIndex < modules.length - 1) {
      const nextModule = modules[currentIndex + 1];
      setCurrentModule(nextModule.id);
      navigate(`/test/${nextModule.id}`);
    } else {
      // All modules complete - go to loading
      submitTest();
    }
  };

  // Navigate to previous module
  const goToPreviousModule = () => {
    const currentIndex = modules.findIndex((m) => m.id === currentModule);

    if (currentIndex > 0) {
      const prevModule = modules[currentIndex - 1];
      setCurrentModule(prevModule.id);
      navigate(`/test/${prevModule.id}`);
    }
  };

  // Submit test to backend
  const submitTest = async () => {
    try {
      // TODO: Save to Supabase
      // const { data, error } = await supabase
      //   .from('test_sessions')
      //   .update({
      //     status: 'completed',
      //     completed_at: new Date().toISOString()
      //   })
      //   .eq('id', sessionId);

      // Save all answers
      // await supabase.from('test_answers').insert(
      //   Object.entries(answers).flatMap(([module, moduleAnswers]) =>
      //     Object.entries(moduleAnswers).map(([questionId, answer]) => ({
      //       session_id: sessionId,
      //       module: module,
      //       question_id: questionId,
      //       answer: answer
      //     }))
      //   )
      // );

      console.log('Test submitted:', { sessionId, answers });

      // Navigate to loading screen
      navigate('/loading');
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  // Reset test
  const resetTest = () => {
    localStorage.removeItem('daph2_session');
    const newSessionId = nanoid();
    setSessionId(newSessionId);
    setCurrentModule('personality');
    setAnswers({
      personality: {},
      behavior: {},
      iq: {},
      eq: {},
      ikigai: {},
      career: {},
      personal: {},
    });
    setProgress({
      completedModules: [],
      totalModules: 7,
      answeredQuestions: 0,
      totalQuestions: 96,
    });
    navigate('/test');
  };

  // Get current module info
  const getCurrentModuleInfo = useCallback(() => {
    return modules.find((m) => m.id === currentModule);
  }, [currentModule]);

  // Check if module is completed
  const isModuleCompleted = useCallback(
    (moduleId) => {
      return progress.completedModules.includes(moduleId);
    },
    [progress.completedModules]
  );

  // Get progress percentage
  const getProgressPercentage = useCallback(() => {
    return Math.round(
      (progress.answeredQuestions / progress.totalQuestions) * 100
    );
  }, [progress.answeredQuestions, progress.totalQuestions]);

  const value = {
    // State
    sessionId,
    currentModule,
    answers,
    progress,
    modules,

    // Actions
    saveAnswer,
    completeModule,
    goToNextModule,
    goToPreviousModule,
    submitTest,
    resetTest,

    // Helpers
    getCurrentModuleInfo,
    isModuleCompleted,
    getProgressPercentage,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
