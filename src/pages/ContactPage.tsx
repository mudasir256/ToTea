import { useLenis } from "@/hooks/useLenis";
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const ContactPage = () => {
  useLenis();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Contact hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
