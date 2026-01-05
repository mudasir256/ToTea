'use client'

import { ArrowRight, Coffee, Leaf } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-tea-light overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <Leaf className="text-primary-500" size={20} />
            <span className="text-sm font-medium text-gray-700">Fresh Ingredients Daily</span>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo3.png"
            alt="ToTea Bubble Tea Logo"
            width={200}
            height={200}
            className="object-contain drop-shadow-lg"
          />
        </div>

        <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Premium Bubble Tea & Coffee
        </p>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crafted with passion, served with love. Experience the perfect blend of traditional flavors and modern innovation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#order"
            className="bg-primary-400 text-white px-8 py-4 rounded-full hover:bg-primary-500 transition-all transform hover:scale-105 shadow-lg font-semibold flex items-center space-x-2"
          >
            <span>Order Now</span>
            <ArrowRight size={20} />
          </a>
          <a
            href="#menu"
            className="bg-white text-primary-500 px-8 py-4 rounded-full hover:bg-primary-50 transition-all border-2 border-primary-400 font-semibold shadow-md"
          >
            View Menu
          </a>
        </div>

        <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Coffee className="text-primary-500" size={18} />
            <span>Fresh Daily</span>
          </div>
          <div className="flex items-center space-x-2">
            <Leaf className="text-primary-500" size={18} />
            <span>Premium Ingredients</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}

