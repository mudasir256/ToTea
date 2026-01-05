'use client'

import { Coffee, Utensils, Clock } from 'lucide-react'

export default function FoodMenu() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Food Menu
          </h2>
          <p className="text-xl text-gray-600">
            Freshly prepared bites to complement your favorite drinks
          </p>
        </div>

        {/* Breakfast Bites */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-700 text-white">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Breakfast Bites</h3>
              <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                <Clock className="w-4 h-4" />
                <span>Available 7:30 AM - 11:00 AM</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Croissants</h4>
              <p className="text-gray-600 leading-relaxed">
                Buttery and flaky croissants baked daily! Choose from Butter Croissant, Chocolate, or Spinach & Feta.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Ube Coconut Croissant</h4>
              <p className="text-gray-600 leading-relaxed">
                A buttery croissant filled with rich ube mascarpone spread and sweet shredded coconut—a dreamy, tropical twist.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Pandan Croissant</h4>
              <p className="text-gray-600 leading-relaxed">
                A flaky croissant filled with creamy pandan mascarpone and sweet shredded coconut—vibrant and aromatic.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Hot Honey Chicken Croissant</h4>
              <p className="text-gray-600 leading-relaxed">
                A croissant sandwich filled with crispy chicken and drizzled with our house-made hot honey. Bold, sweet-heat kick.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Sausage, Egg & Cheese Croissant</h4>
              <p className="text-gray-600 leading-relaxed">
                Savory turkey sausage, scrambled egg, and American cheddar between a choice of brioche or croissant bun.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Egg & Cheese Croissant</h4>
              <p className="text-gray-600 leading-relaxed">
                Classic scrambled egg and American cheddar in a buttery croissant.
              </p>
            </div>
          </div>
        </div>

        {/* All Day Bites */}
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">All Day Bites</h3>
              <p className="text-sm text-gray-600 mt-1">
                Made to order, may take 10-14 minutes!
              </p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm">
              Pair with your choice of sauce on the side: Sriracha Aioli, Roasted Sesame, Thai Basil, or Honey Mustard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Hot Honey Chicken Sandwich</h4>
              <p className="text-gray-600 leading-relaxed">
                Drizzled with our house-made hot honey, crafted with signature sate.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Basil Popcorn Chicken</h4>
              <p className="text-gray-600 leading-relaxed">
                Marinated in garlic and spices and fried to ultra crispiness. Can be mild or spicy.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Taiwanese Chicken Sandwich</h4>
              <p className="text-gray-600 leading-relaxed">
                Marinated in garlic and spices and fried to ultra crispiness. Can be mild or spicy.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Garlic Parmesan Fries</h4>
              <p className="text-gray-600 leading-relaxed">
                Crispy fries tossed with garlic and parmesan. Can be mild or spicy.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Plain Fries</h4>
              <p className="text-gray-600 leading-relaxed">
                Classic crispy fries. Can be mild or spicy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

