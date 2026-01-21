import { useLenis } from '@/hooks/useLenis';
import { Header } from '@/components/Header';
import { ProductDetail } from '@/components/ProductDetail';
import { Footer } from '@/components/Footer';

const ProductDetailPage = () => {
  useLenis();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ProductDetail />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
