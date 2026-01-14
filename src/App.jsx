import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Context
import { TestProvider } from './contexts/TestContext';
import LandingPage from './pages/LandingPage';
import LoadingScreen from './pages/LoadingScreen';
import HistoryLookup from './pages/HistoryLookup';
import NotFound from './pages/NotFound';
import PersonalityTest from './pages/PersonalityTest';
import TestFlow from './pages/TestFlow';
import BehaviorTest from './pages/BehaviourTest';
import IQTest from './pages/IQTest';
import EQTest from './pages/EQTest';
import IkigaiTest from './pages/IkigaiTest';
import CareerTest from './pages/CareerTest';
import PersonalInfoForm from './pages/PersonalForm';
import ResultsPage from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/test' element={<TestFlow />}>
            <Route index element={<Navigate to='personality' replace />} />
            <Route path='personality' element={<PersonalityTest />} />
            <Route path='behavior' element={<BehaviorTest />} />
            <Route path='iq' element={<IQTest />} />
            <Route path='eq' element={<EQTest />} />
            <Route path='ikigai' element={<IkigaiTest />} />
            <Route path='career' element={<CareerTest />} />
            <Route path='personal' element={<PersonalInfoForm />} />
          </Route>

          <Route path='/loading' element={<LoadingScreen />} />

          <Route path='/results/:sessionId' element={<ResultsPage />} />

          <Route path='/lookup' element={<HistoryLookup />} />

          <Route path='/results/token/:token' element={<ResultsPage />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </TestProvider>
    </BrowserRouter>
  );
}

export default App;
