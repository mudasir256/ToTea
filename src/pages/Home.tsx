import { useLenis } from "@/hooks/useLenis";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HomeStory } from "@/components/HomeStory";
import { BestSellers } from "@/components/BestSellers";
import { OrderOnline } from "@/components/OrderOnline";
import { Footer } from "@/components/Footer";

const Home = () => {
  useLenis();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HomeStory />
        <BestSellers />
        <OrderOnline />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

