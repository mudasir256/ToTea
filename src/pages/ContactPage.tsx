import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const ContactPage = () => {
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader
          badge="Get in Touch"
          title="Contact Us"
          subtitle="Have a question or feedback? We'd love to hear from you"
        />
        <Contact hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
