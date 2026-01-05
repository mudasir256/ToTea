'use client'

import { ArrowRight, Coffee, Leaf } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full min-w-full min-h-full object-cover"
          style={{
            width: '100vw',
            height: '100vh',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        >
          <source src="/header-bg.mp4" type="video/mp4" />
        </video>
        {/* Enhanced Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/10 via-transparent to-primary-900/30"></div>
        <div className="absolute inset-0 bg-primary-400/10"></div>
      </div>

      {/* Subtle animated particles effect */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-300/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div className="flex justify-center mb-10 animate-fade-in">
          <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white/50">
            <Leaf className="text-primary-500" size={22} />
            <span className="text-sm font-semibold text-gray-800">Fresh Ingredients Daily</span>
          </div>
        </div>



        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl animate-fade-in animation-delay-400">
          <span className="text-primary-600">
            ToTea
          </span>
        </h1>

        <p className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-xl animate-fade-in animation-delay-600">
          Premium Bubble Tea & Coffee
        </p>
        
        <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto drop-shadow-lg leading-relaxed animate-fade-in animation-delay-800">
          Crafted with passion, served with love. Experience the perfect blend of traditional flavors and modern innovation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 animate-fade-in animation-delay-1000">
          <a
            href="#order"
            className="group bg-primary-400 text-white px-10 py-5 rounded-full hover:bg-primary-500 transition-all transform hover:scale-110 shadow-2xl font-bold text-lg flex items-center space-x-3 border-2 border-white/30"
          >
            <span>Order Now</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/menu"
            className="bg-white/95 backdrop-blur-md text-primary-600 px-10 py-5 rounded-full hover:bg-white transition-all transform hover:scale-110 border-2 border-white/50 font-bold text-lg shadow-2xl"
          >
            View Menu
          </a>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-base animate-fade-in animation-delay-1200">
          <div className="flex items-center space-x-2 bg-white/25 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-lg">
            <Coffee className="text-white" size={20} />
            <span className="font-semibold text-white">Fresh Daily</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/25 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-lg">
            <Leaf className="text-white" size={20} />
            <span className="font-semibold text-white">Premium Ingredients</span>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}

