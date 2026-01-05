import Navbar from '@/components/Navbar'
import MenuSection from '@/components/MenuSection'
import FoodMenu from '@/components/FoodMenu'
import Footer from '@/components/Footer'

export default function MenuPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <MenuSection />
        <FoodMenu />
      </div>
      <Footer />
    </main>
  )
}

