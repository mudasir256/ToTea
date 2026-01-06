import Navbar from '@/components/Navbar'
import PageHeader from '@/components/PageHeader'
import CheckoutForm from '@/components/CheckoutForm'
import Footer from '@/components/Footer'

export default function CheckoutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader 
        title="Checkout"
        subtitle="Complete Your Order"
        description="Review your order and choose your preferred delivery method"
        backgroundImage="/images/PRK-27-scaled.jpg"
      />
      <CheckoutForm />
      <Footer />
    </main>
  )
}

