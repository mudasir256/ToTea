import Navbar from '@/components/Navbar'
import About from '@/components/About'
import Locations from '@/components/Locations'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <About />
        <Locations />
      </div>
      <Footer />
    </main>
  )
}

