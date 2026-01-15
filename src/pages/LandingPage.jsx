import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import SnapScrollContainer from '../components/utils/SnapScrollContainer';

export default function LandingPage() {
  return (
    <SnapScrollContainer
      sections={[
        HeroSection,
        ProblemSection,
        SolutionSection,
        HowItWorksSection,
        FeaturesSection,
        StatsSection,
        FinalCTASection,
      ]}
    />
  );
}
