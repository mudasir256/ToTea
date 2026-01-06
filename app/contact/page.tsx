import Navbar from '@/components/Navbar'
import PageHeader from '@/components/PageHeader'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader 
        title="Contact Us"
        subtitle="Get in Touch"
        description="Have a question, feedback, or just want to say hello? We'd love to hear from you!"
        backgroundImage="/images/PRK-18-1638x2048.jpg"
      />
      <ContactForm />
      <Footer />
    </main>
  )
}

