'use client'

import { Star, Clock } from 'lucide-react'

export default function Promotions() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-400 to-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-yellow-300" />
              <span className="text-sm font-semibold text-primary-100 uppercase tracking-wide">
                Special Offer
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Late Night Happy Hour
            </h2>
            <p className="text-xl text-primary-100 mb-6">
              Every night from 9 PM - 1 AM, enjoy $4 regular sized drinks including Specialteas, Milk Teas, Cold Brews, and Vietnamese Coffee!
            </p>
            <div className="flex items-center space-x-2 text-primary-100">
              <Clock className="w-5 h-5" />
              <span className="font-medium">9:00 PM - 1:00 AM Daily</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">What's Included</h3>
            <ul className="space-y-3 text-primary-100">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                <span>Specialteas</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                <span>Milk Teas</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                <span>Cold Brews</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                <span>Vietnamese Coffee</span>
              </li>
            </ul>
            <a
              href="#order"
              className="mt-6 inline-block bg-white text-primary-500 px-6 py-3 rounded-full hover:bg-primary-50 transition-colors font-semibold"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

