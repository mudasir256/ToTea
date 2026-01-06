'use client'

import { useState } from 'react'
import { Menu, X, ShoppingBag, Coffee } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-3">
              {/* Logo Square */}
              <div className="bg-primary-400 rounded-lg p-2.5 md:p-3 flex items-center justify-center shadow-sm">
                <Coffee className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
              </div>
              {/* Logo Text */}
              <div className="flex flex-col">
                <span 
                  className="text-lg md:text-xl font-bold leading-tight relative"
                  style={{
                    color: '#1f2937',
                    textShadow: `
                      1px 1px 0px rgba(0,0,0,0.1),
                      2px 2px 0px rgba(0,0,0,0.1),
                      3px 3px 0px rgba(0,0,0,0.1),
                      4px 4px 0px rgba(0,0,0,0.1),
                      0px 0px 10px rgba(0,0,0,0.1),
                      0px 0px 20px rgba(0,0,0,0.05)
                    `,
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.1)',
                  }}
                >
                  ToTea
                </span>
                <span className="text-[10px] md:text-xs text-gray-600 leading-tight">bubble tea</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base">
              Home
            </Link>
            <Link href="/menu" className="text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base">
              Menu
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base">
              About
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base">
              Contact
            </Link>
            <a
              href="#order"
              className="bg-primary-400 text-white px-8 py-3 rounded-full hover:bg-primary-500 transition-all transform hover:scale-105 font-semibold flex items-center space-x-2 shadow-lg text-base"
            >
              <ShoppingBag size={20} />
              <span>Order Online</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-primary-500 transition-transform duration-300"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
              />
              <X 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-6 space-y-4 pt-2">
            <Link
              href="/"
              className={`block text-center text-gray-800 hover:text-primary-500 transition-all font-semibold text-base py-2 transform ${
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '0.1s' : '0s' }}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`block text-center text-gray-800 hover:text-primary-500 transition-all font-semibold text-base py-2 transform ${
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '0.15s' : '0s' }}
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/about"
              className={`block text-center text-gray-800 hover:text-primary-500 transition-all font-semibold text-base py-2 transform ${
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '0.2s' : '0s' }}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block text-center text-gray-800 hover:text-primary-500 transition-all font-semibold text-base py-2 transform ${
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: isOpen ? '0.25s' : '0s' }}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <a
              href="#order"
              className={`block bg-primary-400 text-white px-8 py-3 rounded-full hover:bg-primary-500 transition-all font-semibold text-center shadow-lg text-base transform ${
                isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
              }`}
              style={{ transitionDelay: isOpen ? '0.3s' : '0s' }}
              onClick={() => setIsOpen(false)}
            >
              Order Online
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

