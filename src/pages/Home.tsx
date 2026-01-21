import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HappyHour } from '@/components/HappyHour';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Quality } from '@/components/Quality';
import { OrderOnline } from '@/components/OrderOnline';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Home = () => {
  // Initialize smooth scrolling with Lenis
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main> 
        <Hero />
        <HappyHour />
        <FeaturedProducts />
        <Quality />
        <OrderOnline hideHeader />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
