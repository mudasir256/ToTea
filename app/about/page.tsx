import Navbar from '@/components/Navbar'
import PageHeader from '@/components/PageHeader'
import About from '@/components/About'
import Locations from '@/components/Locations'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader 
        title="About Us"
        subtitle="Our Story & Promise"
        description="We believe in the integrity of providing our customers with quality, whole food, and organic ingredients"
        backgroundImage="/images/PRK-13-1638x2048.jpg"
      />
      <About />
      <Locations />
      <Footer />
    </main>
  )
}

