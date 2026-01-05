'use client'

import { ShoppingBag, ExternalLink, Smartphone } from 'lucide-react'

export default function OrderSection() {
  return (
    <section id="order" className="py-20 bg-gradient-to-br from-primary-400 to-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Order Online
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Skip the line and order ahead for pick-up or delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <a
            href="https://totea.toast.site/order"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary-500 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-center group"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors">
              <ShoppingBag className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Toast Pick-Up</h3>
            <p className="text-gray-600 mb-4">Order ahead for quick pick-up</p>
            <div className="flex items-center justify-center space-x-2 text-primary-500 font-medium">
              <span>Order Now</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          <a
            href="https://www.ubereats.com/store/totea"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary-500 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-center group"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors">
              <Smartphone className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Uber Eats</h3>
            <p className="text-gray-600 mb-4">Delivery or pick-up available</p>
            <div className="flex items-center justify-center space-x-2 text-primary-500 font-medium">
              <span>Order Now</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          <a
            href="https://www.doordash.com/store/totea"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary-500 rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-center group"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors">
              <Smartphone className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">DoorDash</h3>
            <p className="text-gray-600 mb-4">Fast delivery to your door</p>
            <div className="flex items-center justify-center space-x-2 text-primary-500 font-medium">
              <span>Order Now</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        </div>

        <div className="mt-12 text-center">
          <p className="text-primary-100 text-sm">
            💡 <strong>Tip:</strong> Order through Uber Eats for special promotions and BOGO deals!
          </p>
        </div>
      </div>
    </section>
  )
}

