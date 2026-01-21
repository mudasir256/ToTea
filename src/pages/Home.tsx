import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HappyHour } from '@/components/HappyHour';
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
        <OrderOnline hideHeader />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
