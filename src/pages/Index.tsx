import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HappyHour } from '@/components/HappyHour';
import { Menu } from '@/components/Menu';
import { Locations } from '@/components/Locations';
import { About } from '@/components/About';
import { OrderOnline } from '@/components/OrderOnline';
import { Footer } from '@/components/Footer';

const Index = () => {
  // Initialize smooth scrolling with Lenis
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HappyHour />
        <Menu />
        <Locations />
        <About />
        <OrderOnline />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
