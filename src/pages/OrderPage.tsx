import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { OrderOnline } from '@/components/OrderOnline';
import { Footer } from '@/components/Footer';

const OrderPage = () => {
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHeader
          badge="Order Now"
          title="Order Online"
          subtitle="Get your favorite drinks delivered or pick up in store"
        />
        <OrderOnline hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
