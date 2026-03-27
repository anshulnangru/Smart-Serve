import HeroSection from '../components/HeroSection'
import ServiceCategories from '../components/ServiceCategories'
import PopularServices from '../components/PopularServices'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import AppPromo from '../components/AppPromo'

export default function HomePage() {
  return (
    <div className="page-enter">
      <HeroSection />
      <ServiceCategories />
      <PopularServices />
      <HowItWorks />
      <Testimonials />
      <AppPromo />
    </div>
  )
}
