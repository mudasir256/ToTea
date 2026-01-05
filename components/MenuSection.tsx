'use client'

import { Coffee, Leaf, Snowflake, Cookie } from 'lucide-react'

interface MenuItem {
  name: string
  description: string
  category?: string
  caffeineFree?: boolean
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
      },
      {
        name: 'The Dark Side',
        description: 'BOLDER, STRONGER, DARKER version of "the Classic" Vietnamese coffee.',
      },
      {
        name: 'House Special Coffee',
        description: 'Our Classic Vietnamese Coffee topped with dairy-free sea salt cream.',
      },
      {
        name: 'Vietnamese Egg Coffee',
        description: 'A decadent twist on tradition. Slow-dripped and topped with a luscious, whipped egg cream — silky, frothy, and naturally sweet.',
      },
      {
        name: 'Brown Sugar Latte',
        description: 'Vietnamese Cold Brew sweetened with brown sugar and dairy-free sea salt cream.',
      },
      {
        name: 'Ube Cream Cold Brew',
        description: 'Vietnamese Coffee topped with cold brew and dairy-free ube cream.',
      },
      {
        name: 'Matcha Cream Cold Brew',
        description: 'Vietnamese Coffee topped with cold brew and dairy-free matcha cream.',
      },
      {
        name: 'Classic Cold Brew',
        description: 'Classic unsweetened Vietnamese Cold Brew.',
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
      },
      {
        name: 'Peach Oolong Tea',
        description: 'Oolong Tea topped with strawberry and peach bits.',
      },
      {
        name: 'Mango Jasmine Tea',
        description: 'Jasmine Green Tea topped with pineapple, mango, and assorted jelly.',
      },
      {
        name: 'White Peach Jasmine',
        description: 'Jasmine Green Tea infused with white peach, topped with strawberry popping boba.',
      },
      {
        name: 'Strawberry Passionfruit Tea',
        description: 'Strawberry Passionfruit Tea topped with lychee, strawberries, and lychee jelly.',
      },
      {
        name: 'Lychee Lemonade',
        description: 'Butterfly Pea Tea and Lemonade topped with lychee and lychee jelly.',
      },
      {
        name: 'Herbal Hibiscus',
        description: 'Hibiscus Tea topped with mixed berries and lychee jelly.',
        caffeineFree: true,
      },
      {
        name: 'Honey Chrysanthemum Tea',
        description: 'Chrysanthemum Tea topped with aloe vera.',
        caffeineFree: true,
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
      },
      {
        name: 'Horchata Matcha',
        description: 'Flavored with Horchata and topped with dairy-free sea salt cream and cinnamon.',
      },
      {
        name: 'Strawberry Matcha Dalgona',
        description: 'Fresh strawberry milk topped with dairy-free matcha cream.',
      },
      {
        name: 'Blue Matcha',
        description: 'Coconut water, butterfly pea tea, and coconut milk sweetened with cane sugar and topped with dairy-free matcha cream.',
      },
      {
        name: 'Mango Matcha',
        description: 'Sweetened with fresh mango purée.',
      },
      {
        name: 'Supreme Matcha',
        description: 'Sweetened with cane sugar and topped with dairy-free matcha cream and matcha powder.',
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
      },
      {
        name: 'Taro Milk Tea',
        description: 'Creamy taro with milk tea, topped with taro custard.',
      },
      {
        name: 'Thai Milk Tea',
        description: 'Rich and creamy Thai-style milk tea with authentic flavors.',
      },
      {
        name: 'Jasmine Milk Tea',
        description: 'Fragrant jasmine green tea with creamy milk.',
      },
      {
        name: 'Brown Sugar Milk Tea',
        description: 'Classic milk tea with rich brown sugar syrup.',
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
      },
      {
        name: 'Honey Dew',
        description: 'Blended honeydew and cream topped with assorted jelly.',
        caffeineFree: true,
      },
      {
        name: 'Coco Taro',
        description: 'Blended coconut and taro topped with flan and taro custards.',
        caffeineFree: true,
      },
      {
        name: 'Coconut Affogato',
        description: 'Blended coconut and cream topped with cold brew.',
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
      },
      {
        name: 'Tiramisu Brownie',
        description: 'Crafted with rich Vietnamese coffee, creamy mascarpone, and 100% cocoa powder.',
      },
      {
        name: 'Cupcakes',
        description: 'Soft, fluffy, and moist cake topped with creamy frosting. Available in Mango Orange, Vietnamese Coffee, Strawberry Shortcake, or Pumpkin Spice.',
      },
      {
        name: 'Portuguese Egg Tarts',
        description: 'Heavenly fusion of flaky pastry and house-made creamy custard. Available in Original, Ube, or Black Sesame.',
      },
      {
        name: 'Cookies',
        description: 'Freshly baked cookies. Available in Sea Salt Chocolate Chip, Red Velvet Oreo, Cookie Monster, or Ube Crinkle.',
      },
      {
        name: 'Ube Coconut Croissant',
        description: 'Buttery croissant filled with rich ube mascarpone spread and sweet shredded coconut.',
      },
      {
        name: 'Pandan Croissant',
        description: 'Flaky croissant filled with creamy pandan mascarpone and sweet shredded coconut.',
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
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-semibold text-gray-900">{item.name}</h4>
                      {item.caffeineFree && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                          Caffeine-Free
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
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

