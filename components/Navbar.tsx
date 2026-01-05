'use client'

import { useState } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo3.png"
              alt="ToTea Bubble Tea Logo"
              width={150}
              height={150}
              className="object-contain"
            />
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
            className="md:hidden text-gray-700 hover:text-primary-500"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4 pt-2">
            <Link
              href="/"
              className="block text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="block text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base py-2"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/about"
              className="block text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-800 hover:text-primary-500 transition-colors font-semibold text-base py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <a
              href="#order"
              className="block bg-primary-400 text-white px-8 py-3 rounded-full hover:bg-primary-500 transition-all font-semibold text-center shadow-lg text-base"
              onClick={() => setIsOpen(false)}
            >
              Order Online
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

