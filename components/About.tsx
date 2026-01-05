'use client'

import { Heart, Leaf, Award, Users } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Promise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe in the integrity of providing our customers with quality, whole food, and organic ingredients to satisfy your taste buds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Leaf className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Ingredients</h3>
            <p className="text-gray-600">
              We only use premium loose leaf teas and fresh, organic ingredients
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Made with Love</h3>
            <p className="text-gray-600">
              Every drink is crafted with passion and attention to detail
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Award className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Daily</h3>
            <p className="text-gray-600">
              All our baked goods are made fresh in-house daily
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect Every Time</h3>
            <p className="text-gray-600">
              Our promise is to make your drink perfect, every time
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-tea-light rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Quality You Can Taste
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We believe in the integrity of providing our customers with quality, whole food, and organic ingredients to satisfy your taste buds. We only use premium loose leaf teas. Every drink has been perfected over time with the best ingredients and all of our baked goods are made fresh in-house daily.
            </p>
            <p className="text-lg font-semibold text-primary-600">
              Our promise is to make your drink perfect, every time. If it isn't, let us know and we'll make it right.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

