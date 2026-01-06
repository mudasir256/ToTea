import Navbar from '@/components/Navbar'
import PageHeader from '@/components/PageHeader'
import MenuSection from '@/components/MenuSection'
import FoodMenu from '@/components/FoodMenu'
import Footer from '@/components/Footer'

export default function MenuPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader 
        title="Our Menu"
        subtitle="Premium Bubble Tea & Coffee"
        description="Discover our carefully crafted selection of beverages and treats made with the finest ingredients"
        backgroundImage="/images/PRK-8-1638x2048.jpg"
      />
      <MenuSection />
      <FoodMenu />
      <Footer />
    </main>
  )
}

