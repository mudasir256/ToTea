import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { HappyHour } from '@/components/HappyHour';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Quality } from '@/components/Quality';
import { OrderOnline } from '@/components/OrderOnline';
import { Reviews } from '@/components/Reviews';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';

const Home = () => {
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative">
        <HeroSection />
        <FeaturedProducts />
        <HappyHour />
        <Quality />
        <OrderOnline hideHeader />
        <Reviews />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
