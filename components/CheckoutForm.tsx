'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Truck, CreditCard, User, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

type DeliveryMethod = 'pickup' | 'ubereats'

export default function CheckoutForm() {
  const router = useRouter()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order processing
    setTimeout(() => {
      alert('Order placed successfully!')
      clearCart()
      router.push('/')
      setIsSubmitting(false)
    }, 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Link
            href="/menu"
            className="inline-block bg-primary-400 text-white px-6 py-3 rounded-full hover:bg-primary-500 transition-colors font-semibold"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1 // 10% tax
  const deliveryFee = deliveryMethod === 'ubereats' ? 2.99 : 0
  const total = subtotal + tax + deliveryFee

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/menu"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Menu</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-bold text-primary-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        deliveryMethod === 'pickup' ? 'bg-primary-500' : 'bg-gray-200'
                      }`}>
                        <MapPin className={`w-5 h-5 ${
                          deliveryMethod === 'pickup' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">Pickup</h4>
                        <p className="text-sm text-gray-600">Pick up at store</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('ubereats')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryMethod === 'ubereats'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        deliveryMethod === 'ubereats' ? 'bg-primary-500' : 'bg-gray-200'
                      }`}>
                        <Truck className={`w-5 h-5 ${
                          deliveryMethod === 'ubereats' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">Uber Eats</h4>
                        <p className="text-sm text-gray-600">Home delivery</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Information Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="(703) 555-0100"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {deliveryMethod === 'ubereats' && (
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      required={deliveryMethod === 'ubereats'}
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="123 Main St, City, State ZIP"
                    />
                  </div>
                )}

                {deliveryMethod === 'pickup' && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Pickup Location:</strong> Visit us at any of our locations. We'll notify you when your order is ready!
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-400 text-white px-6 py-4 rounded-full hover:bg-primary-500 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Total Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Total</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {deliveryMethod === 'ubereats' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  {deliveryMethod === 'pickup' 
                    ? 'Your order will be ready for pickup in approximately 15-20 minutes.'
                    : 'Your order will be delivered via Uber Eats. Estimated delivery time: 30-45 minutes.'
                  }
                </p>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• All prices include applicable taxes</p>
                <p>• Payment will be processed upon order confirmation</p>
                {deliveryMethod === 'ubereats' && (
                  <p>• Delivery fee may vary based on distance</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

