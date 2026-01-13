import FeaturesSection from '../components/landing/FeaturesSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import HeroSection from '../components/landing/HeroSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import StatsSection from '../components/landing/StatsSection';

export default function LandingPage() {
  return (
    <div className='font-sans antialiased bg-white'>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StatsSection />
      <FinalCTASection />
    </div>
  );
}
