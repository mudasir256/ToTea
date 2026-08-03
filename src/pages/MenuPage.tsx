import { useLenis } from "@/hooks/useLenis";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { Footer } from "@/components/Footer";

const MenuPage = () => {
  useLenis();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Menu hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
