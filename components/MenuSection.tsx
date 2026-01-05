'use client'

import { Coffee, Leaf, Snowflake, Cookie } from 'lucide-react'

interface MenuItem {
  name: string
  description: string
  category?: string
  caffeineFree?: boolean
  image?: string
}

interface MenuCategory {
  title: string
  icon: React.ReactNode
  items: MenuItem[]
  color: string
}

const menuData: MenuCategory[] = [
  {
    title: 'Vietnamese Coffee',
    icon: <Coffee className="w-6 h-6" />,
    color: 'from-amber-600 to-amber-800',
    items: [
      {
        name: 'The Classic',
        description: 'Our slow dripped, traditional Vietnamese Coffee. Rich & nutty, strong but sweet.',
        image: '/images/PRK-8-1638x2048.jpg',
      },
      {
        name: 'The Dark Side',
        description: 'BOLDER, STRONGER, DARKER version of "the Classic" Vietnamese coffee.',
        image: '/images/PRK-13-1638x2048.jpg',
      },
      {
        name: 'House Special Coffee',
        description: 'Our Classic Vietnamese Coffee topped with dairy-free sea salt cream.',
        image: '/images/PRK-18-1638x2048.jpg',
      },
      {
        name: 'Vietnamese Egg Coffee',
        description: 'A decadent twist on tradition. Slow-dripped and topped with a luscious, whipped egg cream — silky, frothy, and naturally sweet.',
        image: '/images/PRK-27-scaled.jpg',
      },
      {
        name: 'Brown Sugar Latte',
        description: 'Vietnamese Cold Brew sweetened with brown sugar and dairy-free sea salt cream.',
        image: '/images/PRK-32-scaled-e1751401727612.jpg',
      },
      {
        name: 'Ube Cream Cold Brew',
        description: 'Vietnamese Coffee topped with cold brew and dairy-free ube cream.',
        image: '/images/PRK-37-scaled.jpg',
      },
      {
        name: 'Matcha Cream Cold Brew',
        description: 'Vietnamese Coffee topped with cold brew and dairy-free matcha cream.',
        image: '/images/PRK-38-1638x2048.jpg',
      },
      {
        name: 'Classic Cold Brew',
        description: 'Classic unsweetened Vietnamese Cold Brew.',
        image: '/images/PRK-48-scaled-e1758558138889-1631x2048.jpg',
      },
    ],
  },
  {
    title: 'Fruit Tea',
    icon: <Leaf className="w-6 h-6" />,
    color: 'from-primary-400 to-primary-600',
    items: [
      {
        name: 'Sea Salt Jasmine Tea',
        description: 'Jasmine Green Tea topped with dairy-free sea salt cream.',
        image: '/images/PARK-9-scaled.jpg',
      },
      {
        name: 'Peach Oolong Tea',
        description: 'Oolong Tea topped with strawberry and peach bits.',
        image: '/images/PARK-12-1638x2048.jpg',
      },
      {
        name: 'Mango Jasmine Tea',
        description: 'Jasmine Green Tea topped with pineapple, mango, and assorted jelly.',
        image: '/images/PARK-13-1638x2048.jpg',
      },
      {
        name: 'White Peach Jasmine',
        description: 'Jasmine Green Tea infused with white peach, topped with strawberry popping boba.',
        image: '/images/PARK-16-1638x2048.jpg',
      },
      {
        name: 'Strawberry Passionfruit Tea',
        description: 'Strawberry Passionfruit Tea topped with lychee, strawberries, and lychee jelly.',
        image: '/images/PRK-54-1366x2048.jpg',
      },
      {
        name: 'Lychee Lemonade',
        description: 'Butterfly Pea Tea and Lemonade topped with lychee and lychee jelly.',
        image: '/images/PRK-57-1638x2048.jpg',
      },
      {
        name: 'Herbal Hibiscus',
        description: 'Hibiscus Tea topped with mixed berries and lychee jelly.',
        caffeineFree: true,
        image: '/images/PRK-69-1638x2048.jpg',
      },
      {
        name: 'Honey Chrysanthemum Tea',
        description: 'Chrysanthemum Tea topped with aloe vera.',
        caffeineFree: true,
        image: '/images/PRK-71-1638x2048.jpg',
      },
    ],
  },
  {
    title: 'Matcha',
    icon: <Leaf className="w-6 h-6" />,
    color: 'from-emerald-500 to-emerald-700',
    items: [
      {
        name: 'Matcha Latte',
        description: 'Sweetened with cane sugar.',
        image: '/images/PRK-73-1638x2048.jpg',
      },
      {
        name: 'Horchata Matcha',
        description: 'Flavored with Horchata and topped with dairy-free sea salt cream and cinnamon.',
        image: '/images/PRK-14-scaled-e1764796862801-1376x2048.jpg',
      },
      {
        name: 'Strawberry Matcha Dalgona',
        description: 'Fresh strawberry milk topped with dairy-free matcha cream.',
        image: '/images/PaRK-52-copy.jpg',
      },
      {
        name: 'Blue Matcha',
        description: 'Coconut water, butterfly pea tea, and coconut milk sweetened with cane sugar and topped with dairy-free matcha cream.',
        image: '/images/PRK-38-1366x2048.jpg',
      },
      {
        name: 'Mango Matcha',
        description: 'Sweetened with fresh mango purée.',
        image: '/images/PARK-9-scaled.jpg',
      },
      {
        name: 'Supreme Matcha',
        description: 'Sweetened with cane sugar and topped with dairy-free matcha cream and matcha powder.',
        image: '/images/PARK-12-1638x2048.jpg',
      },
    ],
  },
  {
    title: 'Milk Tea',
    icon: <Coffee className="w-6 h-6" />,
    color: 'from-amber-400 to-amber-600',
    items: [
      {
        name: 'Classic Milk Tea',
        description: 'Traditional black tea with creamy milk and your choice of sweetness.',
        image: '/images/PRK-8-1638x2048.jpg',
      },
      {
        name: 'Taro Milk Tea',
        description: 'Creamy taro with milk tea, topped with taro custard.',
        image: '/images/PRK-13-1638x2048.jpg',
      },
      {
        name: 'Thai Milk Tea',
        description: 'Rich and creamy Thai-style milk tea with authentic flavors.',
        image: '/images/PRK-18-1638x2048.jpg',
      },
      {
        name: 'Jasmine Milk Tea',
        description: 'Fragrant jasmine green tea with creamy milk.',
        image: '/images/PRK-27-scaled.jpg',
      },
      {
        name: 'Brown Sugar Milk Tea',
        description: 'Classic milk tea with rich brown sugar syrup.',
        image: '/images/PRK-32-scaled-e1751401727612.jpg',
      },
    ],
  },
  {
    title: 'Slush',
    icon: <Snowflake className="w-6 h-6" />,
    color: 'from-blue-400 to-blue-600',
    items: [
      {
        name: 'Lychee Berry',
        description: 'Blended lychee and berries topped with lychee and strawberries.',
        caffeineFree: true,
        image: '/images/PRK-37-scaled.jpg',
      },
      {
        name: 'Honey Dew',
        description: 'Blended honeydew and cream topped with assorted jelly.',
        caffeineFree: true,
        image: '/images/PRK-38-1638x2048.jpg',
      },
      {
        name: 'Coco Taro',
        description: 'Blended coconut and taro topped with flan and taro custards.',
        caffeineFree: true,
        image: '/images/PRK-48-scaled-e1758558138889-1631x2048.jpg',
      },
      {
        name: 'Coconut Affogato',
        description: 'Blended coconut and cream topped with cold brew.',
        image: '/images/PRK-54-1366x2048.jpg',
      },
    ],
  },
  {
    title: 'Pastries',
    icon: <Cookie className="w-6 h-6" />,
    color: 'from-rose-400 to-rose-600',
    items: [
      {
        name: 'Espresso Bread Pudding',
        description: 'Soft, custardy bread pudding with rich mascarpone espresso cream on top.',
        image: '/images/PRK-57-1638x2048.jpg',
      },
      {
        name: 'Tiramisu Brownie',
        description: 'Crafted with rich Vietnamese coffee, creamy mascarpone, and 100% cocoa powder.',
        image: '/images/PRK-69-1638x2048.jpg',
      },
      {
        name: 'Cupcakes',
        description: 'Soft, fluffy, and moist cake topped with creamy frosting. Available in Mango Orange, Vietnamese Coffee, Strawberry Shortcake, or Pumpkin Spice.',
        image: '/images/PRK-71-1638x2048.jpg',
      },
      {
        name: 'Portuguese Egg Tarts',
        description: 'Heavenly fusion of flaky pastry and house-made creamy custard. Available in Original, Ube, or Black Sesame.',
        image: '/images/PRK-73-1638x2048.jpg',
      },
      {
        name: 'Cookies',
        description: 'Freshly baked cookies. Available in Sea Salt Chocolate Chip, Red Velvet Oreo, Cookie Monster, or Ube Crinkle.',
        image: '/images/PRK-14-scaled-e1764796862801-1376x2048.jpg',
      },
      {
        name: 'Ube Coconut Croissant',
        description: 'Buttery croissant filled with rich ube mascarpone spread and sweet shredded coconut.',
        image: '/images/PaRK-52-copy.jpg',
      },
      {
        name: 'Pandan Croissant',
        description: 'Flaky croissant filled with creamy pandan mascarpone and sweet shredded coconut.',
        image: '/images/PRK-38-1366x2048.jpg',
      },
    ],
  },
]

export default function MenuSection() {
  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted selection of beverages and treats
          </p>
        </div>

        <div className="space-y-20">
          {menuData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="scroll-mt-20">
              <div className="flex items-center space-x-3 mb-8">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                  {category.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 h-full flex flex-col"
                  >
                    {item.image ? (
                      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-sm transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                            <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">{item.name}</h5>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <div className={`p-4 rounded-full bg-gradient-to-r ${category.color} text-white opacity-50`}>
                          {category.icon}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                            <h5 className="text-lg font-bold text-gray-900 whitespace-nowrap">{item.name}</h5>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col bg-white group-hover:bg-gradient-to-br group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-500">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors flex-1">{item.name}</h4>
                        {item.caffeineFree && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-semibold whitespace-nowrap ml-2">
                            Caffeine-Free
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed text-sm flex-1 transition-colors">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-50 to-tea-light rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add-ons</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Creams</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>Pandan Cream (Dairy-Free)</li>
                <li>Tiramisu Cream</li>
                <li>Sea Salt Cream (Dairy-Free)</li>
                <li>Ube Cream (Dairy-Free)</li>
                <li>Matcha Cream (Dairy-Free)</li>
                <li>Cinnamon Cream (Dairy-Free)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Boba & Custards</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>Black Boba</li>
                <li>Crystal Boba</li>
                <li>Strawberry Boba</li>
                <li>Honey Sago</li>
                <li>Flan Custard</li>
                <li>Taro Custard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Jellies & Aloe</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>Lychee Jelly</li>
                <li>Coconut Jelly</li>
                <li>Aloe Vera</li>
                <li>Assorted Jelly</li>
                <li>Coffee Jelly</li>
                <li>Grass Jelly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fruits</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>Lychee</li>
                <li>Mango</li>
                <li>Mixed Berries</li>
                <li>Peach</li>
                <li>Pineapple</li>
                <li>Strawberry</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

