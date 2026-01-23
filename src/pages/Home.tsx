import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { HappyHour } from '@/components/HappyHour';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Quality } from '@/components/Quality';
import { OrderOnline } from '@/components/OrderOnline';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { ProductDetails } from '@/components/ProductDetails';
import { BuyNowSection } from '@/components/BuyNowSection';
import { products } from '@/data/products';
import { motion } from 'framer-motion';

const Home = () => {
  // Initialize smooth scrolling with Lenis
  useLenis();
  const currentProduct = products[0]; // Use first product only

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative"> 
        <HeroSection />
        <FeaturedProducts />
        <HappyHour />
        <Quality />
        <OrderOnline hideHeader />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
