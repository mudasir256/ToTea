import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MenuSection from '@/components/MenuSection'
import FoodMenu from '@/components/FoodMenu'
import Promotions from '@/components/Promotions'
import Locations from '@/components/Locations'
import About from '@/components/About'
import OrderSection from '@/components/OrderSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <MenuSection />
      <FoodMenu />
      <Promotions />
      <Locations />
      <About />
      <OrderSection />
      <Footer />
    </main>
  )
}

