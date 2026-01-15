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

// Static module configuration
const MODULES = [
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

  // Track if we're initializing to prevent auto-save during init
  const isInitializing = useRef(true);

  // Session & Progress
  const [sessionId, setSessionId] = useState(null);
  const [currentModule, setCurrentModule] = useState('personality');

  // Test answers
  const [answers, setAnswers] = useState({});

  // Progress tracking
  const [progress, setProgress] = useState({
    completedModules: [],
    totalModules: 7,
    answeredQuestions: 0,
    totalQuestions: 106,
  });

  // Module progress - track current question index per module
  const [moduleProgress, setModuleProgress] = useState({});

  // Use static modules config
  const modules = MODULES;

  // Initialize session
  useEffect(() => {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('daph2_session');

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionId(session.sessionId);
        setCurrentModule(session.currentModule);
        setAnswers(session.answers || {});
        setProgress(
          session.progress || {
            totalQuestions: 106,
            answeredQuestions: 0,
            completedModules: [],
          }
        );
        setModuleProgress(session.moduleProgress || {});
      } catch (error) {
        console.error('Error loading session:', error);
        // Create new session if corrupted
        const newSessionId = nanoid();
        setSessionId(newSessionId);
      }
    } else {
      // Create new session
      const newSessionId = nanoid();
      setSessionId(newSessionId);
    }

    // Mark initialization complete after state updates settle
    setTimeout(() => {
      isInitializing.current = false;
    }, 0);
  }, []); // No dependencies - only run once

  // Save session to localStorage (memoized)
  const saveSession = useCallback(
    (sid, module, answersData, progressData, moduleProgressData) => {
      try {
        const session = {
          sessionId: sid,
          currentModule: module,
          answers: answersData,
          progress: progressData,
          moduleProgress: moduleProgressData,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem('daph2_session', JSON.stringify(session));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    },
    []
  );

  // Auto-save on changes (debounced to prevent too many writes)
  useEffect(() => {
    // Skip auto-save during initialization
    if (isInitializing.current) return;

    // Don't save until session exists
    if (!sessionId) return;

    // Debounce save to prevent infinite loops
    const timeoutId = setTimeout(() => {
      saveSession(sessionId, currentModule, answers, progress, moduleProgress);
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    sessionId,
    currentModule,
    answers,
    progress,
    moduleProgress,
    saveSession,
  ]);

  // Save answer for a question
  const saveAnswer = useCallback((moduleId, questionId, answer) => {
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
  }, []); // No external dependencies

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
      // All modules complete - go to loading
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

  // Submit test to backend
  const submitTest = useCallback(async () => {
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
  }, [sessionId, answers, navigate]);

  // Reset test
  const resetTest = useCallback(() => {
    localStorage.removeItem('daph2_session');
    const newSessionId = nanoid();
    setSessionId(newSessionId);
    setCurrentModule('personality');
    setAnswers({});
    setProgress({
      completedModules: [],
      totalModules: 7,
      answeredQuestions: 0,
      totalQuestions: 106,
    });
    navigate('/test');
  }, [navigate]);

  // Get current module info
  const getCurrentModuleInfo = useCallback(() => {
    return modules.find((m) => m.id === currentModule);
  }, [modules, currentModule]);

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

  // Module progress helpers
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
    // State
    sessionId,
    currentModule,
    answers,
    progress,
    modules,
    moduleProgress,

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
    setModuleQuestionIndex,
    getModuleQuestionIndex,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
