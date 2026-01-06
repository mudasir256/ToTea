'use client'

import { Coffee, Utensils, Clock, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function FoodMenu() {
  const { addToCart } = useCart()

  const handleAddToCart = (name: string, description: string, image: string, category: string) => {
    addToCart({
      id: `${category}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: name,
      description: description,
      price: 7.99, // Default price for food items
      image: image,
      category: category,
    })
  }

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
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PARK-9-scaled.jpg"
                  alt="Croissants"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Croissants</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Croissants</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Buttery and flaky croissants baked daily! Choose from Butter Croissant, Chocolate, or Spinach & Feta.
                </p>
                <button
                  onClick={() => handleAddToCart('Croissants', 'Buttery and flaky croissants baked daily! Choose from Butter Croissant, Chocolate, or Spinach & Feta.', '/images/PARK-9-scaled.jpg', 'Breakfast Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PARK-12-1638x2048.jpg"
                  alt="Ube Coconut Croissant"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Ube Coconut Croissant</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Ube Coconut Croissant</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  A buttery croissant filled with rich ube mascarpone spread and sweet shredded coconut—a dreamy, tropical twist.
                </p>
                <button
                  onClick={() => handleAddToCart('Ube Coconut Croissant', 'A buttery croissant filled with rich ube mascarpone spread and sweet shredded coconut—a dreamy, tropical twist.', '/images/PARK-12-1638x2048.jpg', 'Breakfast Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PARK-13-1638x2048.jpg"
                  alt="Pandan Croissant"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Pandan Croissant</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Pandan Croissant</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  A flaky croissant filled with creamy pandan mascarpone and sweet shredded coconut—vibrant and aromatic.
                </p>
                <button
                  onClick={() => handleAddToCart('Pandan Croissant', 'A flaky croissant filled with creamy pandan mascarpone and sweet shredded coconut—vibrant and aromatic.', '/images/PARK-13-1638x2048.jpg', 'Breakfast Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PARK-16-1638x2048.jpg"
                  alt="Hot Honey Chicken Croissant"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Hot Honey Chicken Croissant</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Hot Honey Chicken Croissant</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  A croissant sandwich filled with crispy chicken and drizzled with our house-made hot honey. Bold, sweet-heat kick.
                </p>
                <button
                  onClick={() => handleAddToCart('Hot Honey Chicken Croissant', 'A croissant sandwich filled with crispy chicken and drizzled with our house-made hot honey. Bold, sweet-heat kick.', '/images/PARK-16-1638x2048.jpg', 'Breakfast Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PRK-13-1638x2048.jpg"
                  alt="Sausage, Egg & Cheese Croissant"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Sausage, Egg & Cheese Croissant</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Sausage, Egg & Cheese Croissant</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Savory turkey sausage, scrambled egg, and American cheddar between a choice of brioche or croissant bun.
                </p>
                <button
                  onClick={() => handleAddToCart('Sausage, Egg & Cheese Croissant', 'Savory turkey sausage, scrambled egg, and American cheddar between a choice of brioche or croissant bun.', '/images/PRK-13-1638x2048.jpg', 'Breakfast Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PRK-18-1638x2048.jpg"
                  alt="Egg & Cheese Croissant"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Egg & Cheese Croissant</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Egg & Cheese Croissant</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Classic scrambled egg and American cheddar in a buttery croissant.
                </p>
                <button
                  onClick={() => handleAddToCart('Egg & Cheese Croissant', 'Classic scrambled egg and American cheddar in a buttery croissant.', '/images/PRK-18-1638x2048.jpg', 'Breakfast Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
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
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PRK-27-scaled.jpg"
                  alt="Hot Honey Chicken Sandwich"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Hot Honey Chicken Sandwich</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Hot Honey Chicken Sandwich</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Drizzled with our house-made hot honey, crafted with signature sate.
                </p>
                <button
                  onClick={() => handleAddToCart('Hot Honey Chicken Sandwich', 'Drizzled with our house-made hot honey, crafted with signature sate.', '/images/PRK-27-scaled.jpg', 'All Day Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PRK-32-scaled-e1751401727612.jpg"
                  alt="Basil Popcorn Chicken"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Basil Popcorn Chicken</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Basil Popcorn Chicken</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Marinated in garlic and spices and fried to ultra crispiness. Can be mild or spicy.
                </p>
                <button
                  onClick={() => handleAddToCart('Basil Popcorn Chicken', 'Marinated in garlic and spices and fried to ultra crispiness. Can be mild or spicy.', '/images/PRK-32-scaled-e1751401727612.jpg', 'All Day Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PRK-37-scaled.jpg"
                  alt="Taiwanese Chicken Sandwich"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Taiwanese Chicken Sandwich</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Taiwanese Chicken Sandwich</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Marinated in garlic and spices and fried to ultra crispiness. Can be mild or spicy.
                </p>
                <button
                  onClick={() => handleAddToCart('Taiwanese Chicken Sandwich', 'Marinated in garlic and spices and fried to ultra crispiness. Can be mild or spicy.', '/images/PRK-37-scaled.jpg', 'All Day Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PRK-38-1638x2048.jpg"
                  alt="Garlic Parmesan Fries"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Garlic Parmesan Fries</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Garlic Parmesan Fries</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Crispy fries tossed with garlic and parmesan. Can be mild or spicy.
                </p>
                <button
                  onClick={() => handleAddToCart('Garlic Parmesan Fries', 'Crispy fries tossed with garlic and parmesan. Can be mild or spicy.', '/images/PRK-38-1638x2048.jpg', 'All Day Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col">
              <div className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                <img
                  src="/images/PRK-48-scaled-e1758558138889-1631x2048.jpg"
                  alt="Plain Fries"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                    <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">Plain Fries</h5>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">Plain Fries</h4>
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors mb-4">
                  Classic crispy fries. Can be mild or spicy.
                </p>
                <button
                  onClick={() => handleAddToCart('Plain Fries', 'Classic crispy fries. Can be mild or spicy.', '/images/PRK-48-scaled-e1758558138889-1631x2048.jpg', 'All Day Bites')}
                  className="mt-auto w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

