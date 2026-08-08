import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { Menu } from '@/components/Menu';
import { Footer } from '@/components/Footer';

const OrderPage = () => {
  useLenis();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          badge="Order Now"
          title="Our Drink Menu"
          subtitle="Explore our handcrafted bubble teas, coffees, and smoothies"
        />
        <Menu hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
