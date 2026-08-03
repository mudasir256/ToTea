import { useLenis } from "@/hooks/useLenis";
import { Header } from "@/components/Header";
import { Locations } from "@/components/Locations";
import { Footer } from "@/components/Footer";

const LocationsPage = () => {
  useLenis();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Locations hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default LocationsPage;
