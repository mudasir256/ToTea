import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';

const AboutPage = () => {
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader
          badge="Our Story"
          title="About Us"
          subtitle="Crafted with passion, served with love"
        />
        <About hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
