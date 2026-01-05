import Navbar from '@/components/Navbar'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <ContactForm />
      </div>
      <Footer />
    </main>
  )
}

