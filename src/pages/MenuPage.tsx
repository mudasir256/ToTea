import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { Menu } from '@/components/Menu';
import { OrderOnline } from '@/components/OrderOnline';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const MenuPage = () => {
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader
          badge="Delicious Selection"
          title="Our Menu"
          subtitle="Taste The Crunch - $20-40 per person"
        />
        <Menu hideHeader />
        <OrderOnline hideHeader />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
