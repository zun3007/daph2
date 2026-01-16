import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Context
import { TestProvider } from './contexts/TestContext';
import CareerTest from './pages/CareerTest';
import EQTest from './pages/EQTest';
import HistoryLookup from './pages/HistoryLookup';
import IQTest from './pages/IQTest';
import LandingPage from './pages/LandingPage';
import LoadingScreen from './pages/LoadingScreen';
import NotFound from './pages/NotFound';
import PersonalInfoForm from './pages/PersonalForm';
import ResultsPage from './pages/ResultPage';
import TestFlow from './pages/TestFlow';

function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/test' element={<TestFlow />}>
            <Route index element={<Navigate to='iq' replace />} />
            <Route path='iq' element={<IQTest />} />
            <Route path='eq' element={<EQTest />} />
            <Route path='career' element={<CareerTest />} />
            <Route path='personal' element={<PersonalInfoForm />} />
          </Route>

          <Route path='/loading' element={<LoadingScreen />} />
          <Route path='/results/:sessionId' element={<ResultsPage />} />
          <Route path='/lookup' element={<HistoryLookup />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </TestProvider>
    </BrowserRouter>
  );
}

export default App;
